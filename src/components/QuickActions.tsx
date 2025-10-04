import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FinanceRecordForm } from '@/components/FinanceRecordForm';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  collapsed?: boolean;
}

export function QuickActions({ collapsed = false }: QuickActionsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { cliente } = useAuth();

  const actions = [
    {
      id: 'add-transaction',
      label: 'Nova Transação',
      icon: Plus,
      onClick: () => setShowAddDialog(true),
    },
  ];

  return (
    <>
      <div className={cn("space-y-2", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <h3 className="text-xs font-semibold text-[hsl(var(--sidebar-text-muted))] uppercase tracking-wider mb-3">
            Ações Rápidas
          </h3>
        )}
        
        <div className="grid grid-cols-1 gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className={cn(
                'group relative overflow-hidden flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'text-[hsl(var(--sidebar-text-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] hover:scale-105 hover:shadow-lg',
                collapsed && 'justify-center'
              )}
              title={collapsed ? action.label : undefined}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <action.icon className={cn(
                "h-5 w-5 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110"
              )} />
              {!collapsed && (
                <span className="relative z-10">
                  {action.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
          </DialogHeader>
          {cliente && (
            <FinanceRecordForm 
              userPhone={cliente.phone}
              onSuccess={() => setShowAddDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}