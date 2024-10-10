import type { TDialogProps } from '~/common';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui';
import { useMediaQuery, useLocalize } from '~/hooks';
import { cn } from '~/utils';
import { useGetTransactionsQuery } from '~/data-provider';
import { useMemo } from 'react';
import { Spinner } from '../svg';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui';

const statusColors = {
  pending: 'bg-yellow-500',
  initialized: 'bg-blue-500',
  confirmed: 'bg-green-500',
  canceled: 'bg-gray-500',
  rejected: 'bg-red-500',
  expired: 'bg-orange-500',
};

export default function TransactionsModal({ open, onOpenChange }: TDialogProps) {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const localize = useLocalize();
  const { data: transactions, isLoading } = useGetTransactionsQuery();

  const columns = useMemo(
    () => [
      { id: 'orderId', header: localize('com_nav_transactions_orderId') },
      { id: 'amount', header: localize('com_nav_transactions_amount') },
      { id: 'status', header: localize('com_nav_transactions_status') },
      { id: 'createdAt', header: localize('com_nav_transactions_createdAt') },
      { id: 'description', header: localize('com_nav_transactions_description') },
    ],
    [localize],
  );

  const getStatusText = (status) => {
    return localize(`com_nav_transactions_status_${status.toLowerCase()}`);
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent
        disableScroll={isSmallScreen}
        className={cn(
          'md:min-h-auto block max-h-[90vh] overflow-auto pb-0 shadow-2xl md:w-[680px]',
          isSmallScreen ? 'min-h-[200px]' : '',
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-200">
            {localize('com_nav_transactions')}
          </DialogTitle>
        </DialogHeader>
        <div className="">
          {isLoading && (
            <div className="flex justify-center">
              <Spinner className="h-6 w-6" />
            </div>
          )}
          {!isLoading && (!transactions || transactions.length === 0) ? (
            <div className="flex flex-col items-center">
              <p className="text-center text-lg text-gray-800 dark:text-gray-200">
                {localize('com_nav_transactions_empty')}
              </p>
            </div>
          ) : (
            !isLoading && (
              <div className="relative h-full max-h-[25rem] min-h-0 overflow-y-auto border border-black/10 pb-4 dark:border-white/10 sm:min-h-[28rem]">
                <Table className="w-full min-w-[600px] border-separate border-spacing-0">
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead
                          key={column.id}
                          className="sticky top-0 rounded-t border-b border-black/10 bg-white px-2 py-1 text-center font-medium text-gray-700 dark:border-white/10 dark:bg-gray-700 dark:text-gray-100 sm:px-4 sm:py-2"
                        >
                          {column.header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow
                        key={transaction._id}
                        className="border-b border-black/10 text-center text-gray-600 dark:border-white/10 dark:text-gray-300 [tr:last-child_&]:border-b-0"
                      >
                        <TableCell>{transaction.orderId}</TableCell>
                        <TableCell>{transaction.amount / 100} ₽</TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full ${
                              statusColors[transaction.status.toLowerCase()]
                            } px-2 py-1 text-white`}
                          >
                            {getStatusText(transaction.status)}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
