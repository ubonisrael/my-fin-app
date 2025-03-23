import useLocalStorage from "use-local-storage";
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { DashboardCard } from '@/components/DashboardCard';
import { TransactionList } from '@/components/TransactionList';
import { Chart } from '@/components/Chart';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { Transaction } from '@/lib/types';
import { mockTransactions } from '@/lib/mockData';
import { filterTransactions } from '@/lib/financeUtils';

const Income = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", []);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // setTransactions(mockTransactions);
      setIsLoading(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    setFilteredTransactions(filterTransactions(transactions, 'income'));
  }, [transactions]);
  
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substring(2, 10),
    };
    
    setTransactions((prev) => [transaction, ...prev]);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Income</h1>
            <p className="text-muted-foreground">
              Track and manage your income sources.
            </p>
          </div>
          <AddTransactionDialog 
            onAddTransaction={handleAddTransaction} 
            type="income" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="Income Trends"
            description="Last 6 months"
            isLoading={isLoading}
            animationDelay={100}
          >
            <Chart 
              transactions={transactions} 
              type="line" 
              dataKey="income" 
              height={300}
            />
          </DashboardCard>
          
          <DashboardCard
            title="Income Sources"
            description="By category"
            isLoading={isLoading}
            animationDelay={200}
          >
            <Chart 
              transactions={transactions} 
              type="pie" 
              dataKey="income" 
              height={300}
            />
          </DashboardCard>
        </div>
        
        <DashboardCard
          title="Income History"
          description="All income transactions"
          isLoading={false}
          animationDelay={300}
        >
          <TransactionList 
            transactions={filteredTransactions} 
            isLoading={isLoading}
            showSearch={true}
            showDateFilter={true}
          />
        </DashboardCard>
      </div>
    </MainLayout>
  );
};

export default Income;
