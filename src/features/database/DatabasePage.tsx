import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Database, FileText, Loader2 } from "lucide-react";
import { useDatabase } from "@/hooks/useDatabase";

export function DatabasePage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const { 
    isConnected, 
    isLoading, 
    fileName, 
    tables, 
    stats, 
    error, 
    loadDatabase, 
    disconnect,
    selectTable,
    currentTable
  } = useDatabase();

  const handleFileUpload = async (file: File) => {
    console.log("File uploaded:", file.name);
    await loadDatabase(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const dbFile = files.find(file => file.name.endsWith('.db') || file.name.endsWith('.sqlite'));
    
    if (dbFile) {
      handleFileUpload(dbFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Database Management</h1>
        <p className="text-muted-foreground">
          Upload and manage your SQLite database files
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Database
            </CardTitle>
            <CardDescription>
              Upload a SQLite database file (.db, .sqlite) to start analyzing your POS data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Drop your database file here
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Or click to browse and select a file
              </p>
              <Input
                type="file"
                accept=".db,.sqlite"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Current Database
            </CardTitle>
            <CardDescription>
              Information about the currently loaded database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </span>
                  ) : isConnected ? (
                    "Connected"
                  ) : (
                    "No database loaded"
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">File Name</label>
                <p className="text-sm text-muted-foreground">{fileName || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Tables</label>
                <p className="text-sm text-muted-foreground">
                  {tables.length > 0 ? tables.join(", ") : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Total Records</label>
                <p className="text-sm text-muted-foreground">
                  {stats ? stats.totalTransactions.toLocaleString() : "-"}
                </p>
              </div>
              <Button 
                variant="outline" 
                disabled={!isConnected || isLoading}
                onClick={disconnect}
              >
                Disconnect Database
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
          <CardDescription>
            Tables found in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center py-8">
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No database loaded. Upload a database file to view available tables.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tables.map((table) => (
                <div 
                  key={table}
                  className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors ${
                    currentTable === table ? 'bg-accent border-primary' : ''
                  }`}
                >
                  <div>
                    <h4 className="font-medium">{table}</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentTable === table ? 'Currently selected' : 'Database table'}
                    </p>
                  </div>
                  <Button 
                    variant={currentTable === table ? "default" : "outline"} 
                    size="sm"
                    onClick={() => selectTable(table)}
                    disabled={isLoading}
                  >
                    {currentTable === table ? 'Selected' : 'Select Table'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}