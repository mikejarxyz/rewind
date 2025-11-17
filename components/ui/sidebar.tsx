"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const SIDEBAR_WIDTH = "16rem"; // 256px
const SIDEBAR_WIDTH_COLLAPSED = "4rem"; // 64px

const SidebarContext = React.createContext<{
  isOpen: boolean;
  toggle: () => void;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: true,
  toggle: () => {},
  setIsOpen: () => {},
});

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
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
    <SidebarContext.Provider value={{ isOpen, toggle, setIsOpen }}>
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
        "relative flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        className
      )}
      style={{
        width: isOpen ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED,
      }}
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
      className={cn(
        "flex h-16 items-center justify-between border-b px-4",
        className
      )}
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
    <div className={cn("flex-1 overflow-auto py-2", className)} {...props}>
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
    <div className={cn("mt-auto border-t p-4", className)} {...props}>
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
    <div className={cn("px-3 py-2", className)} {...props}>
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

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70",
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

interface SidebarMenuItemProps {
  icon?: React.ReactNode;
  active?: boolean;
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function SidebarMenuItem({
  className,
  children,
  icon,
  active,
  asChild = false,
}: SidebarMenuItemProps) {
  const { isOpen } = useSidebar();
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
        !isOpen && "justify-center px-2",
        className
      )}
    >
      {asChild ? (
        children
      ) : (
        <>
          {icon && (
            <span className={cn("shrink-0", !isOpen && "h-5 w-5")}>
              {icon}
            </span>
          )}
          {isOpen && <span className="truncate">{children}</span>}
          {!isOpen && (
            <span className="absolute left-full ml-2 hidden whitespace-nowrap rounded-md bg-popover px-2 py-1 text-sm text-popover-foreground shadow-md group-hover:block">
              {children}
            </span>
          )}
        </>
      )}
    </Comp>
  );
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isOpen, toggle } = useSidebar();

  return (
    <Button
      onClick={toggle}
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 shrink-0 transition-transform duration-300",
        isOpen ? "rotate-0" : "rotate-180",
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
