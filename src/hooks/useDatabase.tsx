import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { databaseService } from '@/services/database';
import type { DatabaseStats, TableInfo, PosTransaction } from '@/types/database';

interface DatabaseContextType {
  isConnected: boolean;
  isLoading: boolean;
  fileName: string | null;
  tables: string[];
  currentTable: string | null;
  stats: DatabaseStats | null;
  transactions: PosTransaction[];
  rawData: { columns: string[], rows: unknown[][] } | null;
  error: string | null;
  loadDatabase: (file: File) => Promise<void>;
  selectTable: (tableName: string) => Promise<void>;
  disconnect: () => void;
  getTableInfo: (tableName: string) => Promise<TableInfo | null>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<string | null>(null);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [transactions, setTransactions] = useState<PosTransaction[]>([]);
  const [rawData, setRawData] = useState<{ columns: string[], rows: unknown[][] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectTable = useCallback(async (tableName: string) => {
    if (!isConnected) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [tableStats, tableTransactions, tableRawData] = await Promise.all([
        databaseService.getDatabaseStats(tableName),
        databaseService.getTransactions(tableName, 50), // Load first 50 transactions
        databaseService.getRawTableData(tableName, 50) // Load first 50 raw rows
      ]);
      
      setCurrentTable(tableName);
      setStats(tableStats);
      setTransactions(tableTransactions);
      setRawData(tableRawData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load table data');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const loadDatabaseFromUrl = useCallback(async (url: string, filename: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await databaseService.loadFromUrl(url);
      const tableList = await databaseService.getTables();
      
      setIsConnected(true);
      setFileName(filename);
      setTables(tableList);
      
      // Auto-select first table if available
      if (tableList.length > 0) {
        // We'll use a local function to select the table since selectTable hasn't been defined yet
        try {
          const [tableStats, tableTransactions, tableRawData] = await Promise.all([
            databaseService.getDatabaseStats(tableList[0]),
            databaseService.getTransactions(tableList[0], 50),
            databaseService.getRawTableData(tableList[0], 50)
          ]);
          
          setCurrentTable(tableList[0]);
          setStats(tableStats);
          setTransactions(tableTransactions);
          setRawData(tableRawData);
        } catch (tableErr) {
          setError(tableErr instanceof Error ? tableErr.message : 'Failed to load table data');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load database');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDatabase = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await databaseService.loadFromFile(file);
      const tableList = await databaseService.getTables();
      
      setIsConnected(true);
      setFileName(file.name);
      setTables(tableList);
      
      // Auto-select first table if available
      if (tableList.length > 0) {
        await selectTable(tableList[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load database');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectTable]);

  const getTableInfo = useCallback(async (tableName: string): Promise<TableInfo | null> => {
    if (!isConnected) return null;
    
    try {
      return await databaseService.getTableInfo(tableName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get table info');
      return null;
    }
  }, [isConnected]);

  const disconnect = useCallback(() => {
    databaseService.disconnect();
    setIsConnected(false);
    setFileName(null);
    setTables([]);
    setCurrentTable(null);
    setStats(null);
    setTransactions([]);
    setRawData(null);
    setError(null);
  }, []);

  // Auto-load database on mount
  useEffect(() => {
    const autoLoadDatabase = async () => {
      await loadDatabaseFromUrl('/aronium-db-backup-2025-09-17-21-35-54.db', 'aronium-db-backup-2025-09-17-21-35-54.db');
    };
    
    autoLoadDatabase();
  }, [loadDatabaseFromUrl]);

  return (
    <DatabaseContext.Provider value={{
      isConnected,
      isLoading,
      fileName,
      tables,
      currentTable,
      stats,
      transactions,
      rawData,
      error,
      loadDatabase,
      selectTable,
      disconnect,
      getTableInfo,
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}