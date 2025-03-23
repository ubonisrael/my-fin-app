
export type TransactionCategory = 
  // Income categories
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Gifts'
  | 'Other Income'
  // Expense categories
  | 'Housing'
  | 'Transportation'
  | 'Food'
  | 'Utilities'
  | 'Entertainment'
  | 'Shopping'
  | 'Healthcare'
  | 'Education'
  | 'Personal'
  | 'Debt'
  | 'Other Expenses';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  date: string;
  type: TransactionType;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string; 
  color?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  netCashflow: number;
  balance: number;
}
