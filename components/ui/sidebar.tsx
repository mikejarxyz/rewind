"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext<{
  isOpen: boolean;
  toggle: () => void;
}>({
  isOpen: true,
  toggle: () => {},
});

export function useSidebar() {
  return React.useContext(SidebarContext);
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        isOpen ? "w-64" : "w-16",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-2 border-b p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto p-2", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1 py-2", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "px-3 py-2 text-xs font-semibold text-sidebar-foreground/70",
        !isOpen && "sr-only",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarGroupContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  href?: string;
  active?: boolean;
}

export function SidebarMenuItem({
  className,
  children,
  icon,
  active,
  ...props
}: SidebarMenuItemProps) {
  const { isOpen } = useSidebar();

  return (
    <a
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        !isOpen && "justify-center",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {isOpen && <span>{children}</span>}
    </a>
  );
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
