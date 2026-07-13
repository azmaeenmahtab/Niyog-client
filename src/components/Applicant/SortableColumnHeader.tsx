"use client";

import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

export function SortableColumnHeader({
  children,
  sortDirection,
}: {
  children: React.ReactNode;
  sortDirection?: string | null;
}) {
  return (
    <span className="flex items-center justify-between">
      {children}
      {!!sortDirection && (
        <Icon
          icon="gravity-ui:chevron-up"
          className={cn(
            "size-3 transform transition-transform duration-100 ease-out",
            sortDirection === "descending" ? "rotate-180" : "",
          )}
        />
      )}
    </span>
  );
}