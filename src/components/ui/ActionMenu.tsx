import { ReactNode } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ActionMenuItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

interface ActionMenuProps {
  children: ReactNode;
  items: ActionMenuItem[];
  className?: string;
}

export function ActionMenu({ children, items, className }: ActionMenuProps) {
  const contextMenuItems = (
    <>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isDestructive = item.className?.includes('text-red') || item.className?.includes('text-destructive');
        
        return (
          <div key={index}>
            <ContextMenuItem 
              onClick={item.onClick} 
              className={`cursor-pointer ${item.className || ''}`}
              disabled={item.disabled}
            >
              {item.icon}
              <span>{item.label}</span>
            </ContextMenuItem>
            {!isLast && isDestructive && <ContextMenuSeparator />}
          </div>
        );
      })}
    </>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {contextMenuItems}
      </ContextMenuContent>
    </ContextMenu>
  );
}
