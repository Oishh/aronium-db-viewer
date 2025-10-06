import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDatabase } from "@/hooks/useDatabase";
import { DollarSign, Activity, Database, TrendingUp } from "lucide-react";

export function DashboardPage() {
  const { isConnected, stats, fileName, tables } = useDatabase();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your POS database analytics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.totalTransactions.toLocaleString() : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Total transaction count" : "No database loaded"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.totalAmount) : "$0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Total transaction value" : "No database loaded"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categories
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.categories.length : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Unique categories" : "No database loaded"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Database Status
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isConnected ? "Connected" : "Not Connected"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? fileName : "Upload a database file"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Info</CardTitle>
            <CardDescription>
              Information about your loaded database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Tables Found</h4>
                  <div className="space-y-1">
                    {tables.map((table) => (
                      <div key={table} className="text-sm text-muted-foreground">
                        • {table}
                      </div>
                    ))}
                  </div>
                </div>
                
                {stats && (
                  <div>
                    <h4 className="font-medium mb-2">Date Range</h4>
                    <div className="text-sm text-muted-foreground">
                      {stats.dateRange.start && stats.dateRange.end ? (
                        `${stats.dateRange.start} to ${stats.dateRange.end}`
                      ) : (
                        "No date information available"
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No database connected. Upload a SQLite database file to view information.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Transaction categories in your database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected && stats ? (
              <div className="space-y-2">
                {stats.categories.slice(0, 10).map((category) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span>{category}</span>
                  </div>
                ))}
                {stats.categories.length > 10 && (
                  <p className="text-xs text-muted-foreground">
                    ... and {stats.categories.length - 10} more categories
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Category information will appear here once you load a database.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}