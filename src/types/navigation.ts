import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}