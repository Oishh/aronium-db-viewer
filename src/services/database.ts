import initSqlJs, { type Database } from 'sql.js';
import type { DatabaseConnection, PosTransaction, DatabaseStats, TableInfo, TableColumn } from '@/types/database';

class DatabaseService {
  private SQL: any = null;
  private db: Database | null = null;

  async initialize(): Promise<void> {
    if (!this.SQL) {
      this.SQL = await initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
      });
    }
  }

  async loadFromFile(file: File): Promise<DatabaseConnection> {
    await this.initialize();
    
    const fileBuffer = await file.arrayBuffer();
    const data = new Uint8Array(fileBuffer);
    
    if (this.SQL) {
      this.db = new this.SQL.Database(data);
      return {
        db: this.db,
        isConnected: true,
      };
    }
    
    throw new Error('Failed to initialize SQL.js');
  }

  async loadFromUrl(url: string): Promise<DatabaseConnection> {
    await this.initialize();
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load database from URL: ${response.statusText}`);
    }
    
    const fileBuffer = await response.arrayBuffer();
    const data = new Uint8Array(fileBuffer);
    
    if (this.SQL) {
      this.db = new this.SQL.Database(data);
      return {
        db: this.db,
        isConnected: true,
      };
    }
    
    throw new Error('Failed to initialize SQL.js');
  }

  async getTables(): Promise<string[]> {
    if (!this.db) throw new Error('No database connection');
    
    const result = this.db.exec(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    
    if (result.length === 0) return [];
    
    return result[0].values.map(row => row[0] as string);
  }

  async getTableInfo(tableName: string): Promise<TableInfo> {
    if (!this.db) throw new Error('No database connection');
    
    const pragmaResult = this.db.exec(`PRAGMA table_info('${tableName}')`);
    const countResult = this.db.exec(`SELECT COUNT(*) FROM '${tableName}'`);
    
    const columns: TableColumn[] = pragmaResult[0]?.values.map(row => ({
      name: row[1] as string,
      type: row[2] as string,
      isNotNull: Boolean(row[3]),
      isPrimaryKey: Boolean(row[5]),
    })) || [];
    
    const rowCount = countResult[0]?.values[0][0] as number || 0;
    
    return {
      name: tableName,
      columns,
      rowCount,
    };
  }

  async getTransactions(tableName: string, limit = 100, offset = 0): Promise<PosTransaction[]> {
    if (!this.db) throw new Error('No database connection');
    
    const result = this.db.exec(`
      SELECT * FROM '${tableName}' 
      LIMIT ${limit} OFFSET ${offset}
    `);
    
    if (result.length === 0) return [];
    
    const columns = result[0].columns;
    return result[0].values.map((row, rowIndex) => {
      const transaction: Record<string, unknown> = {};
      columns.forEach((col, index) => {
        transaction[col] = row[index];
      });
      
      // Try to map common field names to our PosTransaction interface
      const getId = () => {
        return transaction.id || transaction.ID || transaction.Id || rowIndex + 1;
      };
      
      const getTimestamp = () => {
        return transaction.timestamp || transaction.date || transaction.created_at || 
               transaction.DateTime || transaction.Date || transaction.Time || 
               new Date().toISOString();
      };
      
      const getAmount = () => {
        const amount = transaction.amount || transaction.total || transaction.price || 
                      transaction.Total || transaction.Amount || transaction.value || 0;
        return typeof amount === 'number' ? amount : parseFloat(String(amount)) || 0;
      };
      
      const getDescription = () => {
        return transaction.description || transaction.name || transaction.item || 
               transaction.product || transaction.Description || transaction.Name || 
               transaction.title || `Transaction ${getId()}`;
      };
      
      const getCategory = () => {
        return transaction.category || transaction.type || transaction.Category || 
               transaction.Type || transaction.class || 'Uncategorized';
      };
      
      const getPaymentMethod = () => {
        return transaction.payment_method || transaction.paymentMethod || 
               transaction.method || transaction.PaymentMethod || transaction.payment || 
               transaction.Payment || 'Unknown';
      };
      
      return {
        id: getId() as number,
        timestamp: String(getTimestamp()),
        amount: getAmount(),
        description: String(getDescription()),
        category: String(getCategory()),
        paymentMethod: String(getPaymentMethod()),
      };
    });
  }

  async getDatabaseStats(tableName: string): Promise<DatabaseStats> {
    if (!this.db) throw new Error('No database connection');
    
    // First, get the table structure to understand what fields are available
    const tableInfo = await this.getTableInfo(tableName);
    const columns = tableInfo.columns.map(col => col.name);
    
    // Find potential amount fields
    const amountFields = columns.filter(col => 
      /amount|total|price|value|cost|sum/i.test(col)
    );
    const amountField = amountFields[0] || 'amount';
    
    // Find potential date fields
    const dateFields = columns.filter(col => 
      /date|time|timestamp|created|modified/i.test(col)
    );
    const dateField = dateFields[0] || 'timestamp';
    
    // Find potential category fields
    const categoryFields = columns.filter(col => 
      /category|type|class|group|kind/i.test(col)
    );
    const categoryField = categoryFields[0] || 'category';
    
    // Get total count
    const totalResult = this.db.exec(`SELECT COUNT(*) FROM '${tableName}'`);
    const totalCount = totalResult[0]?.values[0][0] as number || 0;
    
    // Get total amount (only if amount field exists)
    let totalAmount = 0;
    if (amountFields.length > 0) {
      try {
        const amountResult = this.db.exec(`SELECT SUM(${amountField}) FROM '${tableName}' WHERE ${amountField} IS NOT NULL`);
        totalAmount = amountResult[0]?.values[0][0] as number || 0;
      } catch {
        // Ignore if amount field doesn't exist or isn't numeric
      }
    }
    
    // Get date range (only if date field exists)
    let startDate = '';
    let endDate = '';
    if (dateFields.length > 0) {
      try {
        const dateResult = this.db.exec(`
          SELECT MIN(${dateField}), MAX(${dateField}) FROM '${tableName}'
          WHERE ${dateField} IS NOT NULL
        `);
        startDate = dateResult[0]?.values[0][0] as string || '';
        endDate = dateResult[0]?.values[0][1] as string || '';
      } catch {
        // Ignore if date field doesn't exist
      }
    }
    
    // Get categories (only if category field exists)
    let categories: string[] = [];
    if (categoryFields.length > 0) {
      try {
        const categoryResult = this.db.exec(`
          SELECT DISTINCT ${categoryField} FROM '${tableName}'
          WHERE ${categoryField} IS NOT NULL
          ORDER BY ${categoryField}
          LIMIT 50
        `);
        categories = categoryResult[0]?.values.map(row => row[0] as string) || [];
      } catch {
        // Ignore if category field doesn't exist
      }
    }
    
    return {
      totalTransactions: totalCount,
      totalAmount,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      categories,
    };
  }

  async executeQuery(query: string): Promise<unknown[][]> {
    if (!this.db) throw new Error('No database connection');
    
    const result = this.db.exec(query);
    return result.map(r => r.values);
  }

  async getRawTableData(tableName: string, limit = 100, offset = 0): Promise<{columns: string[], rows: unknown[][]}> {
    if (!this.db) throw new Error('No database connection');
    
    const result = this.db.exec(`
      SELECT * FROM '${tableName}' 
      LIMIT ${limit} OFFSET ${offset}
    `);
    
    if (result.length === 0) {
      return { columns: [], rows: [] };
    }
    
    return {
      columns: result[0].columns,
      rows: result[0].values,
    };
  }

  disconnect(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  isConnected(): boolean {
    return this.db !== null;
  }
}

export const databaseService = new DatabaseService();