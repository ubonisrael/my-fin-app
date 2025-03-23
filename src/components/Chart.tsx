
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart as RechartsLineChart,
  Line,
} from 'recharts';
import { Transaction } from '@/lib/types';
import {
  groupTransactionsByCategory,
  groupTransactionsByMonth,
  getCategoryColor,
  formatCurrency,
} from '@/lib/financeUtils';

interface ChartProps {
  transactions: Transaction[];
  type: 'pie' | 'bar' | 'line';
  dataKey: 'income' | 'expense' | 'both';
  height?: number;
  className?: string;
}

export function Chart({
  transactions,
  type,
  dataKey,
  height = 300,
  className = '',
}: ChartProps) {
  const data = useMemo(() => {
    if (type === 'pie') {
      const categoryTotals = groupTransactionsByCategory(
        transactions,
        dataKey === 'both' ? 'expense' : dataKey
      );
      
      return Object.entries(categoryTotals).map(([name, value], index) => ({
        name,
        value,
        color: getCategoryColor(name, index),
      }));
    }
    
    if (type === 'bar' || type === 'line') {
      const monthlyData = groupTransactionsByMonth(transactions);
      
      return Object.entries(monthlyData)
        .map(([month, data]) => {
          const [year, monthNum] = month.split('-');
          const date = new Date(parseInt(year), parseInt(monthNum) - 1);
          const monthName = date.toLocaleString('default', { month: 'short' });
          
          return {
            name: `${monthName}`,
            income: data.income,
            expenses: data.expenses,
            net: data.income - data.expenses,
          };
        })
        .reverse();
    }
    
    return [];
  }, [transactions, type, dataKey]);
  
  const getChart = () => {
    if (type === 'pie') {
      return (
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatCurrency(value)]}
          />
          <Legend />
        </RechartsPieChart>
      );
    }
    
    if (type === 'bar') {
      return (
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value)]}
          />
          <Legend />
          {dataKey === 'income' || dataKey === 'both' ? (
            <Bar
              dataKey="income"
              name="Income"
              fill="hsl(144, 70%, 50%)"
              radius={[4, 4, 0, 0]}
            />
          ) : null}
          {dataKey === 'expense' || dataKey === 'both' ? (
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="hsl(350, 70%, 50%)"
              radius={[4, 4, 0, 0]}
            />
          ) : null}
        </RechartsBarChart>
      );
    }
    
    if (type === 'line') {
      return (
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value)]}
          />
          <Legend />
          {dataKey === 'income' || dataKey === 'both' ? (
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="hsl(144, 70%, 50%)"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ) : null}
          {dataKey === 'expense' || dataKey === 'both' ? (
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="hsl(350, 70%, 50%)"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ) : null}
          {dataKey === 'both' ? (
            <Line
              type="monotone"
              dataKey="net"
              name="Net"
              stroke="hsl(220, 70%, 55%)"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ) : null}
        </RechartsLineChart>
      );
    }
    
    return null;
  };
  
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        {getChart()}
      </ResponsiveContainer>
    </div>
  );
}
