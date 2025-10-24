import { Spinner } from "@/components/ui/spinner";

export const PageLoadingFallback = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner size="lg" text="Carregando..." />
    </div>
  );
};

