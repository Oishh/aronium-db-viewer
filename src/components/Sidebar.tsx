import { cn } from "@/utils/cn";
import type { NavigationItem } from "@/types/navigation";
import { Link, useLocation } from "react-router-dom";
import { Home, Database, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview and analytics"
  },
  {
    title: "Database",
    href: "/database",
    icon: Database,
    description: "Manage database files"
  },
  {
    title: "POS Data",
    href: "/pos-data",
    icon: BarChart3,
    description: "View transaction data"
  }
];

export function Sidebar({ isOpen, onToggle, isMobile = false }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn(
      "bg-card border-r transition-all duration-300 flex flex-col",
      // Mobile: fixed positioning with full width when open, hidden when closed
      isMobile && "fixed top-0 left-0 h-full z-40 shadow-xl",
      isMobile && isOpen && "w-64",
      isMobile && !isOpen && "-translate-x-full w-64",
      // Desktop: normal sidebar behavior
      !isMobile && (isOpen ? "w-64" : "w-16")
    )}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {isOpen && (
            <h2 className="text-lg font-semibold">Aronium DB</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              isMobile ? "" : "ml-auto",
              !isOpen && !isMobile && "mx-auto"
            )}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {isOpen && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className={cn(
          "text-xs text-muted-foreground",
          !isOpen && "text-center"
        )}>
          {isOpen ? "Aronium DB Viewer v1.0" : "v1.0"}
        </div>
      </div>
    </div>
  );
}