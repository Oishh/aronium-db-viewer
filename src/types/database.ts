export interface DatabaseConnection {
  db: unknown;
  isConnected: boolean;
}

export interface PosTransaction {
  id: number;
  timestamp: string;
  amount: number;
  description: string;
  category: string;
  paymentMethod: string;
}

export interface DatabaseStats {
  totalTransactions: number;
  totalAmount: number;
  dateRange: {
    start: string;
    end: string;
  };
  categories: string[];
}

export interface TableColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isNotNull: boolean;
}

export interface TableInfo {
  name: string;
  columns: TableColumn[];
  rowCount: number;
}