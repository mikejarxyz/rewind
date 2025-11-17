"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Users,
  Receipt,
  Briefcase,
  Settings,
  LayoutDashboard,
  ChevronDown,
  LogOut,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/actions/auth";

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Properties",
        href: "/dashboard/properties",
        icon: Building2,
      },
      {
        title: "People",
        href: "/dashboard/people",
        icon: Users,
      },
      {
        title: "Accounting",
        href: "/dashboard/accounting",
        icon: Receipt,
      },
      {
        title: "Employees",
        href: "/dashboard/employees",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

interface DashboardSidebarProps {
  user: User;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  async function handleLogout() {
    await logout();
  }

  // Get initials from email
  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      ?.slice(0, 2)
      .toUpperCase() ?? "U";
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 shrink-0" />
          {isOpen && (
            <span className="text-lg font-semibold truncate">Rewind</span>
          )}
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem
                    key={item.href}
                    asChild
                    active={isActive}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4 shrink-0" />
                      {isOpen && <span className="truncate">{item.title}</span>}
                      {!isOpen && (
                        <span className="absolute left-full ml-2 hidden whitespace-nowrap rounded-md bg-popover px-2 py-1 text-sm text-popover-foreground shadow-md group-hover:block">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent",
                !isOpen && "justify-center"
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">
                  {getInitials(user.email || "")}
                </AvatarFallback>
              </Avatar>
              {isOpen && (
                <>
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">
                      {user.email?.split("@")[0]}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isOpen ? "end" : "center"}
            side={isOpen ? "top" : "right"}
            className="w-56"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// Re-export cn for use in this file
function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
