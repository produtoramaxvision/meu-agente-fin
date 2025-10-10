import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface AgendaSkeletonProps {
  view: 'day' | 'week' | 'month' | 'agenda' | 'timeline' | 'year';
}

function AgendaSkeleton({ view }: AgendaSkeletonProps) {
  const renderSkeletonByView = () => {
    switch (view) {
      case 'day':
        return (
          <div className="space-y-4">
            {/* Header do dia */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            {/* Timeline do dia */}
            <div className="space-y-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'week':
        return (
          <div className="space-y-4">
            {/* Header da semana */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            {/* Grid da semana */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-12 w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      case 'month':
        return (
          <div className="space-y-4">
            {/* Header do mês */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            {/* Grid do mês */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        );

      case 'agenda':
        return (
          <div className="space-y-4">
            {/* Header da agenda */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            {/* Lista da agenda */}
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            {/* Header da timeline */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            {/* Timeline */}
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-4 w-16 mt-1" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'year':
        return (
          <div className="space-y-4">
            {/* Header do ano */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            {/* Heatmap do ano */}
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  {Array.from({ length: 31 }).map((_, j) => (
                    <Skeleton key={j} className="h-3 w-3" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <Skeleton className="h-64 w-full" />;
    }
  };

  return (
    <div className="p-6">
      {renderSkeletonByView()}
    </div>
  );
}

export { AgendaSkeleton };
