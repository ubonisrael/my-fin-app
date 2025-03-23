
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@progress/kendo-react-indicators';
import { Label } from "@progress/kendo-react-labels";
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";


interface DashboardCardProps {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
  transactionType?: TransactionType; 
  transactionTypes?: string[];
  handleTransactionTypeToggle?: (event: DropDownListChangeEvent) => void;
  footer?: ReactNode;
  isLoading?: boolean;
  animate?: boolean;
  animationDelay?: number;
}

export function DashboardCard({
  title,
  description,
  className,
  children,
  footer,
  transactionType, 
  transactionTypes,
  handleTransactionTypeToggle,
  isLoading = false,
  animate = true,
  animationDelay = 0,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-xl overflow-hidden',
        animate ? 'animate-fade-up animate-once' : '',
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {(title || description) && (
        <div className="flex justify-between items-center p-5 pb-0 border-b border-border/40">
          <div>
            {title && <h3 className="text-lg font-medium text-foreground">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {transactionTypes && <div className="flex flex-col gap-2">
            <DropDownList
              data={transactionTypes}
              onChange={handleTransactionTypeToggle}
              value={transactionType}
            />
          </div>}
        </div>
      )}
      
      <div className={cn(
        'p-5',
        isLoading ? 'animate-pulse' : ''
      )}>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton shape="text" style={{ width: "100%" }} />
            <Skeleton shape="text" style={{ width: "100%" }} />
            <Skeleton shape="text" style={{ width: "100%" }} />
            <Skeleton shape="text" style={{ width: "100%" }} />
          </div>
        ) : (
          children
        )}
      </div>
      
      {footer && (
        <div className="p-4 bg-muted/20 border-t border-border/40">
          {footer}
        </div>
      )}
    </div>
  );
}
