
import { useMemo, useState } from 'react';
import { Transaction } from '@/lib/types';
import { formatCurrency, formatDate, getRelativeTime } from '@/lib/financeUtils';
import { Grid, GridColumn as Column, GridItemChangeEvent, GridRowProps, GridCustomCellProps } from '@progress/kendo-react-grid';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  limit?: number;
  showSearch?: boolean;
  showDateFilter?: boolean;
  className?: string;
}

export function TransactionList({
  transactions,
  isLoading,
  limit,
  showSearch = false,
  showDateFilter = false,
  className = '',
}: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // const filteredTransactions = useMemo(() => {
  //   let result = transactions;
    
  //   if (searchQuery) {
  //     result = result.filter(
  //       (t) => 
  //         t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         t.category.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }
    
  //   return limit ? result.slice(0, limit) : result;
  // }, [transactions, searchQuery, limit]);

  // function to format date and amount value
  const formattedTransactions = useMemo(() => 
    transactions.map((t) => ({
      ...t,
      date: getRelativeTime(t.date),
      amount: formatCurrency(t.amount),
    })), 
    [transactions]
  );
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions to display.</p>
      </div>
    );
  }
  
  return (
    <Grid
            // style={{ height: '400px' }}
            data={formattedTransactions}
            showLoader={isLoading}
            dataItemKey="id"
            autoProcessData={true}
            sortable={true}
            pageable={{ pageSizes: true }}
            // filterable={true}
            // editable={{ mode: 'incell' }}
            defaultSkip={0}
            defaultTake={limit}
            scrollable="none"
            // onItemChange={handleItemChange}
        >
            <Column field="id" title="ID" editable={false} filterable={false} width="10%" />
            <Column field="type" title="Type" editable={false} filterable={false} width="10%" />
            <Column field="amount" title="Amount" editable={false} filterable={false} width="10%" />
            <Column field="category" title="Category" editable={false} filterable={false} width="15%" />
            <Column field="description" title="Description" editable={false} filterable={false} width="40%" />
            <Column field="date" title="Occurred" editable={false} filterable={false} />
        </Grid>
  );
}
