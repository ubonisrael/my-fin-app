import { Transaction, FinancialSummary, TransactionCategory, TransactionType } from './types';

// Format a number as currency
export const formatCurrency = (amount: number, currencyCode = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format a date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

// Calculate total for a specific transaction type
export const calculateTotal = (
  transactions: Transaction[],
  type: TransactionType
): number => {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Calculate financial summary
export const calculateFinancialSummary = (
  transactions: Transaction[]
): FinancialSummary => {
  const totalIncome = calculateTotal(transactions, 'income');
  const totalExpenses = calculateTotal(transactions, 'expense');
  const netCashflow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 
    ? Math.round((netCashflow / totalIncome) * 100) 
    : 0;
    
  return {
    totalIncome,
    totalExpenses,
    netCashflow,
    savingsRate,
    balance: netCashflow, // Simplified for demo
  };
};

// Group transactions by category and calculate totals
export const groupTransactionsByCategory = (
  transactions: Transaction[],
  type: TransactionType
): Record<string, number> => {
  const filtered = transactions.filter(t => t.type === type);

  return filtered.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);
};

// Group transactions by month
export const groupTransactionsByMonth = (
  transactions: Transaction[],
  months = 6
): Record<string, { income: number; expenses: number }> => {
  const result: Record<string, { income: number; expenses: number }> = {};
  const today = new Date();
  
  // Initialize last few months
  for (let i = 0; i < months; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    result[monthKey] = { income: 0, expenses: 0 };
  }
  
  // Fill with actual data
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Only process transactions within our timeframe
    if (result[monthKey]) {
      if (transaction.type === 'income') {
        result[monthKey].income += transaction.amount;
      } else {
        result[monthKey].expenses += transaction.amount;
      }
    }
  });
  
  return result;
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// Filter transactions by type and category
export const filterTransactions = (
  transactions: Transaction[],
  type?: TransactionType,
  category?: TransactionCategory
): Transaction[] => {
  return transactions.filter(t => {
    if (type && t.type !== type) return false;
    if (category && t.category !== category) return false;
    return true;
  });
};

// Get color for a category (for charts)
export const getCategoryColor = (category: string, index: number): string => {
  const baseColors = [
    'hsl(220, 70%, 55%)',
    'hsl(280, 70%, 55%)',
    'hsl(340, 70%, 55%)',
    'hsl(170, 70%, 45%)',
    'hsl(30, 80%, 55%)',
    'hsl(120, 60%, 50%)',
    'hsl(200, 70%, 50%)',
    'hsl(260, 70%, 60%)',
    'hsl(320, 70%, 55%)',
    'hsl(80, 70%, 45%)',
    'hsl(150, 70%, 45%)',
  ];
  
  // If we have a predetermined category, use its index
  const knownCategories: Record<string, number> = {
    'Salary': 0,
    'Freelance': 1,
    'Investments': 2,
    'Housing': 0,
    'Food': 1,
    'Transportation': 2,
    'Utilities': 3,
    'Entertainment': 4,
  };
  
  if (category in knownCategories) {
    return baseColors[knownCategories[category]];
  }
  
  // Otherwise use the provided index
  return baseColors[index % baseColors.length];
};
