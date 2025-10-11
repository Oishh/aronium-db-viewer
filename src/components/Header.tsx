import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export function Header({ onSidebarToggle }: HeaderProps) {
  return (
    <header className="bg-card border-b px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="flex-shrink-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-base md:text-xl font-semibold truncate">Aronium DB Viewer</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs md:text-sm text-muted-foreground hidden sm:block">
            SQLite Database Viewer
          </div>
        </div>
      </div>
    </header>
  );
}