import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableIcon, Search, Download, ChevronDown, Database, ArrowUpDown, ArrowUp, ArrowDown, Filter, MoreHorizontal } from "lucide-react";
import { useDatabase } from "@/hooks/useDatabase";
import { useState, useRef, useEffect, useMemo } from "react";

type SortDirection = 'asc' | 'desc' | null;

export function PosDataPage() {
  const { isConnected, transactions, currentTable, isLoading, rawData, tables, selectTable } = useDatabase();
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsTableSelectorOpen(false);
      }
    }

    if (isTableSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isTableSelectorOpen]);

  const handleTableSelectorClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        width: rect.width
      });
    }
    setIsTableSelectorOpen(!isTableSelectorOpen);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(current => 
        current === 'asc' ? 'desc' : current === 'desc' ? null : 'asc'
      );
      if (sortDirection === 'desc') {
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    if (!rawData) return { columns: [], rows: [] };
    
    let filteredRows = rawData.rows;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredRows = filteredRows.filter(row =>
        row.some(cell => 
          cell !== null && String(cell).toLowerCase().includes(searchLower)
        )
      );
    }
    
    // Sort data
    if (sortColumn && sortDirection) {
      const columnIndex = rawData.columns.indexOf(sortColumn);
      if (columnIndex !== -1) {
        filteredRows = [...filteredRows].sort((a, b) => {
          const aVal = a[columnIndex];
          const bVal = b[columnIndex];
          
          if (aVal === null && bVal === null) return 0;
          if (aVal === null) return sortDirection === 'asc' ? 1 : -1;
          if (bVal === null) return sortDirection === 'asc' ? -1 : 1;
          
          const aStr = String(aVal);
          const bStr = String(bVal);
          
          // Try numeric comparison first
          const aNum = parseFloat(aStr);
          const bNum = parseFloat(bStr);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
          }
          
          // String comparison
          return sortDirection === 'asc' 
            ? aStr.localeCompare(bStr)
            : bStr.localeCompare(aStr);
        });
      }
    }
    
    return { columns: rawData.columns, rows: filteredRows };
  }, [rawData, searchTerm, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return {
      ...filteredAndSortedData,
      rows: filteredAndSortedData.rows.slice(startIndex, endIndex)
    };
  }, [filteredAndSortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.rows.length / rowsPerPage);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Aronium Header */}
      <header className="aronium-header flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">DB Viewer</h1>
              <div className="text-xs text-cyan-400 font-medium">Aronium Database</div>
            </div>
          </div>
          {currentTable && (
            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md">
              <TableIcon className="h-4 w-4 text-cyan-400" />
              <span className="font-medium text-cyan-300">{currentTable}</span>
              <span className="text-xs text-cyan-400">({filteredAndSortedData.rows.length} rows)</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
            <Input 
              placeholder="Search products by name, code or barcode..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!isConnected}
              className="pl-10 w-80 bg-card border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-foreground placeholder:text-cyan-400/60"
            />
          </div>
          
          {/* Controls */}
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-cyan-500/30 rounded-md px-3 py-2 text-sm bg-card text-foreground focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
            disabled={!isConnected}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          
          {/* Table Selector */}
          {isConnected && tables.length > 0 && (
            <button
              ref={buttonRef}
              onClick={handleTableSelectorClick}
              className="flex items-center gap-2 min-w-[140px] justify-between px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-md text-sm text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              disabled={isLoading}
            >
              <Database className="h-4 w-4" />
              <span className="truncate">{currentTable || "Select Table"}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isTableSelectorOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
          
          <button 
            className="aronium-button flex items-center gap-2"
            disabled={!isConnected}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {!isConnected ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-xl flex items-center justify-center animate-pulse">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-cyan-300">Loading Aronium Database...</h3>
              <p className="text-cyan-400/80">Connecting to hardware database system</p>
              <div className="flex items-center justify-center gap-1 mt-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        ) : (
          <section>
            <div className="table-scroll">
              <table className="sophisticated-table">
                <thead>
                  <tr>
                    {paginatedData.columns.map((column) => (
                      <th 
                        key={column}
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{column}</span>
                          {sortColumn === column ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={paginatedData.columns.length} className="text-center py-12 text-muted-foreground">
                        Loading data...
                      </td>
                    </tr>
                  ) : paginatedData.rows.length > 0 ? (
                    paginatedData.rows.map((row, index) => (
                      <tr key={index}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>
                            {cell !== null ? String(cell) : (
                              <span className="text-muted-foreground italic text-xs">null</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={paginatedData.columns.length} className="text-center py-12 text-muted-foreground">
                        {searchTerm ? 'No matching results found' : 'No data in this table'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* Aronium Footer with Pagination */}
      {isConnected && totalPages > 1 && (
        <footer className="border-t border-cyan-500/30 px-8 py-4 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-cyan-400">
              Page <span className="font-semibold text-cyan-300">{currentPage}</span> of <span className="font-semibold text-cyan-300">{totalPages}</span> • 
              <span className="font-semibold text-cyan-300 ml-1">{filteredAndSortedData.rows.length}</span> rows
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ««
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                »»
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Fixed positioned dropdown to avoid z-index issues */}
      {isTableSelectorOpen && isConnected && tables.length > 0 && (
        <div 
          ref={dropdownRef}
          className="fixed bg-card border border-cyan-500/30 rounded-md shadow-xl max-h-64 overflow-y-auto"
          style={{
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            width: dropdownPosition.width,
            zIndex: 10000
          }}
        >
          {tables.map((table) => (
            <button
              key={table}
              className={`w-full px-3 py-2 text-left hover:bg-cyan-500/20 transition-colors text-sm ${
                currentTable === table ? 'bg-cyan-500/20 text-cyan-300' : 'text-muted-foreground'
              }`}
              onClick={() => {
                selectTable(table);
                setIsTableSelectorOpen(false);
              }}
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                <span className="truncate">{table}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}