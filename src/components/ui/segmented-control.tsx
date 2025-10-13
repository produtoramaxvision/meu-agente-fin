import * as React from "react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
}

const sizeClasses = {
  sm: "h-8 px-2 text-xs",
  md: "h-10 px-3 text-sm", 
  lg: "h-12 px-4 text-base"
};

const containerSizeClasses = {
  sm: "gap-1 p-0.5",
  md: "gap-1 p-1",
  lg: "gap-1.5 p-1.5"
};

export function SegmentedControl({
  value,
  onValueChange,
  options,
  className,
  size = "md",
  orientation = "horizontal"
}: SegmentedControlProps) {
  const handleOptionClick = (optionValue: string) => {
    if (optionValue !== value) {
      onValueChange(optionValue);
    }
  };

  return (
    <div
      className={cn(
        // Container base - fundo escuro com borda sutil
        "flex items-center rounded-lg border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-bg))]",
        containerSizeClasses[size],
        orientation === "vertical" && "flex-col",
        className
      )}
      role="tablist"
      aria-label="Seleção de opções"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={cn(
              // Base styles
              "group relative overflow-hidden flex items-center justify-center rounded-md font-medium transition-all duration-200 flex-1",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              sizeClasses[size],
              
              // Estado selecionado - fundo preto com borda destacada
              isSelected && [
                "bg-black text-white shadow-lg border border-[hsl(var(--sidebar-border))]",
                "hover:bg-black/90 hover:scale-105"
              ],
              
              // Estado não selecionado - fundo cinza com texto cinza claro
              !isSelected && [
                "bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-text-muted))]",
                "hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))]",
                "hover:scale-105 hover:shadow-lg"
              ]
            )}
            role="tab"
            aria-selected={isSelected}
            aria-label={option.label}
            title={option.label}
          >
            {/* Efeito shimmer - igual ao da agenda */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" 
              aria-hidden="true" 
            />
            
            {/* Conteúdo do botão */}
            <div className="relative z-10 flex items-center gap-2">
              {option.icon && (
                <span className="transition-transform group-hover:scale-110">
                  {option.icon}
                </span>
              )}
              <span>{option.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
