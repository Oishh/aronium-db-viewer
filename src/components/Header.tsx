import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export function Header({ onSidebarToggle }: HeaderProps) {
  return (
    <header className="bg-card border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Hardware DB Viewer</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            SQLite Database Viewer
          </div>
        </div>
      </div>
    </header>
  );
}