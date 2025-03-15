import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../../hooks/utils"; // Jika `cn` adalah helper custom dalam proyek

const Pagination = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  to?: string;
  onClick?: () => void;
} & React.ComponentPropsWithoutRef<"a">;

const PaginationLink = ({
  className,
  isActive,
  disabled,
  to,
  onClick,
  children,
  ...props
}: PaginationLinkProps) => {
  const Component = to ? Link : "a";

  return (
    <Component
      to={to || "#"}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-transparent text-foreground hover:bg-muted hover:text-muted-foreground",
        disabled && "pointer-events-none opacity-50",
        "hover:bg-blue-500 hover:text-white transition ease-in-out duration-200",
        "dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700", // Support dark mode
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  to,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    to={to}
    onClick={onClick}
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  to,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    to={to}
    onClick={onClick}
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 min-w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
