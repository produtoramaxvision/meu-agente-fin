import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonNotification() {
  return (
    <div className="flex items-start gap-3 p-4 border-b last:border-0">
      {/* Avatar/Icon skeleton */}
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      
      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        {/* Title skeleton */}
        <Skeleton className="h-4 w-[70%]" />
        
        {/* Description skeleton */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[90%]" />
        
        {/* Timestamp skeleton */}
        <Skeleton className="h-3 w-24 mt-1" />
      </div>
    </div>
  );
}

