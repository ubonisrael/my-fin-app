
import { Transaction, SavingsGoal, TransactionCategory } from './types';

// Generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Generate a random date in the past few months
const generateDate = (daysBack = 90): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Income categories
const incomeCategories: TransactionCategory[] = [
  'Salary', 
  'Freelance', 
  'Investments', 
  'Gifts', 
  'Other Income'
];

// Expense categories
const expenseCategories: TransactionCategory[] = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities', 
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Personal',
  'Debt',
  'Other Expenses'
];

// Generate mock transactions
export const generateMockTransactions = (count = 30): Transaction[] => {
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.7
    
    const transaction: Transaction = {
      id: generateId(),
      amount: isIncome 
        ? Math.floor(Math.random() * 2000) + 1000 
        : Math.floor(Math.random() * 500) + 20,
      description: isIncome 
        ? `${isIncome ? 'Income' : 'Payment'} #${i + 1}` 
        : `Purchase #${i + 1}`,
      category: isIncome 
        ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
        : expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
      date: generateDate(),
      type: isIncome ? 'income' : 'expense',
    };
    
    transactions.push(transaction);
  }
  
  // Sort by date, most recent first
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock savings goals
export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: generateId(),
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    color: 'hsl(220, 70%, 55%)',
  },
  {
    id: generateId(),
    name: 'Vacation',
    targetAmount: 3000,
    currentAmount: 1200,
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
    color: 'hsl(280, 70%, 55%)',
  },
  {
    id: generateId(),
    name: 'New Laptop',
    targetAmount: 2000,
    currentAmount: 1800,
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
    color: 'hsl(340, 70%, 55%)',
  },
  {
    id: generateId(),
    name: 'Home Down Payment',
    targetAmount: 50000,
    currentAmount: 15000,
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
    color: 'hsl(170, 70%, 45%)',
  },
];

// Initialize with mock data
export const mockTransactions = generateMockTransactions(10);
