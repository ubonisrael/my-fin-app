
import { useMemo } from 'react';
import { Transaction, FinancialSummary } from '@/lib/types';
import { formatCurrency, calculateFinancialSummary } from '@/lib/financeUtils';
import { arrowDownIcon, arrowUpIcon, percentIcon, walletSolidIcon } from "@progress/kendo-svg-icons";
import { SvgIcon } from '@progress/kendo-react-common';

interface FinanceSummaryProps {
  transactions: Transaction[];
  className?: string;
}

export function FinanceSummary({ transactions, className = '' }: FinanceSummaryProps) {
  const summary = useMemo(() => {
    return calculateFinancialSummary(transactions);
  }, [transactions]);
  
  const items = [
    {
      title: 'Income',
      value: formatCurrency(summary.totalIncome),
      icon: <SvgIcon size="xlarge" icon={arrowUpIcon} />,
      color: 'text-income bg-income-light',
    },
    {
      title: 'Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: <SvgIcon size="xlarge" icon={arrowDownIcon} />,
      color: 'text-expense bg-expense-light',
    },
    {
      title: 'Balance',
      value: formatCurrency(summary.balance),
      icon: <SvgIcon size="xlarge" icon={walletSolidIcon} />,
      color: 'text-primary bg-blue-50',
    },
    {
      title: 'Savings Rate',
      value: `${summary.savingsRate}%`,
      icon: <SvgIcon size="xlarge" icon={percentIcon} />,
      color: 'text-savings bg-savings-light',
    },
  ];
  
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {items.map((item) => (
        <div
          key={item.title}
          className="glass-card p-4 rounded-xl animate-fade-up animate-once"
        >
          <div className="flex items-center mb-2">
            <div className={`${item.color} flex items-center justify-center p-2 rounded-full mr-2`}>
              {item.icon}
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {item.title}
            </h3>
          </div>
          <p className="text-2xl font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
