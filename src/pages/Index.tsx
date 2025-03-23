
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { DashboardCard } from '@/components/DashboardCard';
import { FinanceSummary } from '@/components/FinanceSummary';
import { TransactionList } from '@/components/TransactionList';
import { Chart } from '@/components/Chart';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { ClearTransactionsDialog } from '@/components/ClearTransactionsDialog';
import { Transaction, TransactionType } from '@/lib/types';
import { mockTransactions } from '@/lib/mockData';
import { Link } from 'react-router-dom';
import useLocalStorage from "use-local-storage";
import { DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";

const Index = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", []);
  const [transactionType, setTransactionType] = useState<TransactionType>("income")
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      // setTransactions(mockTransactions);
      setIsLoading(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substring(2, 10),
    };
    
    setTransactions((prev) => [transaction, ...prev]);
  };
  
  const handleClearTransactions = () => {
    setTransactions([]);
  };

  const handleTransactionTypeToggle = (event: DropDownListChangeEvent) => {
    setTransactionType(event.target.value);
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Your financial overview and recent activity.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AddTransactionDialog onAddTransaction={handleAddTransaction} />
            <ClearTransactionsDialog handleClearTransactions={handleClearTransactions} />
          </div>
        </div>
        
        <FinanceSummary 
          transactions={transactions} 
          className="pt-2"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="Monthly Overview"
            description="Income vs. Expenses"
            isLoading={isLoading}
            animationDelay={100}
          >
            <Chart 
              transactions={transactions} 
              type="bar" 
              dataKey="both" 
              height={300}
            />
          </DashboardCard>
          
          <DashboardCard
            title={`${transactionType === 'income' ? "Income" : "Expense"} Breakdown`}
            description="By category"
            isLoading={isLoading}
            animationDelay={200}
            transactionType={transactionType}
            transactionTypes={['income', 'expense']}
            handleTransactionTypeToggle={handleTransactionTypeToggle}
          >
            <Chart 
              transactions={transactions} 
              type="pie" 
              dataKey={transactionType}
              height={300}
            />
          </DashboardCard>
        </div>
        
        <DashboardCard
          title="Transactions Log"
          isLoading={false}
          animationDelay={300}
        >
          <TransactionList transactions={transactions} limit={5} isLoading={isLoading} />
        </DashboardCard>
      </div>
    </MainLayout>
  );
};

export default Index;
