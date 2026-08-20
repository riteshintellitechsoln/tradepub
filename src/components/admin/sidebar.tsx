"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookText,
  FolderTree,
  Building2,
  Users,
  Contact,
  Download,
  Mail,
  BarChart3,
  Settings,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/books", label: "Books", icon: BookText },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Contact },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/email-logs", label: "Email Logs", icon: Mail },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },

];

// Client component only because it needs usePathname() for active-link
// highlighting — everything else about the admin shell (the layout wrapping
// this, the auth check) stays server-side.
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r bg-muted/20 lg:block">
      <div className="flex h-16 items-center border-b px-6 font-display text-lg font-bold">
        TradeHub
      </div>
      <nav className="space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          // Exact match for /admin itself; startsWith for every nested
          // section, so /admin/books/new still highlights "Books".
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
