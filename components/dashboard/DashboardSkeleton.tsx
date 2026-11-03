import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
          <Skeleton className="h-9 w-48 rounded-xl" />
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HighlightCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl p-6 border border-slate-200 space-y-5"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4 rounded-xl" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Skeleton className="h-6 w-24 rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-52 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-2xl" />
          <Skeleton className="h-9 w-36 rounded-2xl" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <Skeleton className="h-8 w-20 rounded-full shrink-0" />
          <Skeleton className="h-8 w-20 rounded-full shrink-0" />
          <Skeleton className="h-8 w-20 rounded-full shrink-0" />
          <Skeleton className="h-8 w-20 rounded-full shrink-0" />
        </div>
        <Skeleton className="h-9 w-full sm:w-64 rounded-2xl" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="flex items-center justify-between py-3.5 px-3 border-b border-slate-100 gap-4"
          >
            <Skeleton className="h-6 w-28 rounded-full shrink-0" />
            <div className="flex items-center gap-2.5 flex-1 max-w-xs">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <Skeleton className="h-4 w-20 rounded hidden md:block" />
            <Skeleton className="h-6 w-24 rounded-full hidden sm:block" />
            <Skeleton className="h-5 w-28 rounded" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <StatCardsSkeleton />
      <HighlightCardsSkeleton />
      <TableSkeleton />
    </div>
  );
}
