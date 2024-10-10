import { useState } from 'react';
import { DialogDescription } from '@radix-ui/react-dialog';
import type { TDialogProps } from '~/common';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label } from '~/components/ui';
import { useMediaQuery, useLocalize } from '~/hooks';
import { cn } from '~/utils';
import { TPayment } from 'librechat-data-provider';
import { useBalanceTopUpMutation } from '../../data-provider';
import { useToastContext } from '../../Providers';

export default function PaymentModal({ open, onOpenChange }: TDialogProps) {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const localize = useLocalize();
  const { showToast } = useToastContext();

  const [amount, setAmount] = useState(250);

  const [paymentResponse, setPaymentResponse] = useState<TPayment | null>(null);

  const balanceTopUpMutation = useBalanceTopUpMutation({
    onSuccess(data) {
      setPaymentResponse(data);
      showToast({
        message: localize('com_payment_success'),
        status: 'success',
        duration: 3000,
      });
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
      }
    },
    onError(error) {
      showToast({
        message: (error as Error)?.message ?? localize('com_payment_error'),
        status: 'error',
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    balanceTopUpMutation.mutate({
      amount,
    });
  };

  const handleDecrement = () => {
    setAmount((prevAmount) => (prevAmount ? Math.max(0, prevAmount - 50) : 0));
  };

  const handleIncrement = () => {
    setAmount((prevAmount) => (prevAmount ? Math.max(0, prevAmount + 50) : 50));
  };

  const onCloseModal = () => {
    if (!confirm(localize('com_payment_close_confirm'))) {
      return;
    }
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (paymentResponse) {
          onCloseModal();
        } else {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent
        disableScroll={isSmallScreen}
        className={cn(
          'md:min-h-auto block max-h-[90vh] overflow-auto shadow-2xl md:w-[680px]',
          isSmallScreen ? 'min-h-[200px]' : '',
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-200">
            {localize('com_payment_title')}
          </DialogTitle>
        </DialogHeader>
        {paymentResponse ? (
          <DialogDescription className="prose dark:prose-invert light mx-6 mt-2 w-full max-w-fit whitespace-pre-wrap break-words dark:text-gray-20">
            <div className="mt-2 flex flex-col items-center">
              <p className="text-center text-lg text-gray-800 dark:text-gray-200">
                {localize('com_payment_description')}
              </p>
              <a
                href={paymentResponse.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-lg text-gray-800 dark:text-gray-200"
              >
                {paymentResponse.paymentUrl}
              </a>
            </div>
          </DialogDescription>
        ) : (
          <DialogDescription className="prose dark:prose-invert light mt-2 w-full max-w-fit whitespace-pre-wrap break-words dark:text-gray-20">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
              <div className="mt-2 flex flex-col items-center">
                <Label
                  htmlFor="amount"
                  className="text-center text-lg text-gray-800 dark:text-gray-200"
                >
                  {localize('com_payment_amount')}
                </Label>
                <div className="mt-2 flex items-center">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="rounded-2xl bg-blue-600 px-5 py-1 text-xl font-semibold text-white shadow-sm hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    -
                  </button>
                  <Input
                    name="amount"
                    type="number"
                    prefix="₽"
                    placeholder={'0'}
                    id="amount"
                    className="mx-2 block w-40 appearance-none rounded-md border-0 px-3 py-1.5 text-center text-2xl text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 hover:appearance-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-indigo-500 sm:leading-6"
                    value={amount}
                    min={50}
                    max={50000}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="rounded-2xl bg-blue-600 px-5 py-1 text-xl font-semibold text-white shadow-sm hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    +
                  </button>
                </div>
                <Label
                  htmlFor="amount"
                  className="text-center text-sm font-thin text-gray-800 dark:text-gray-400"
                >
                  {localize('com_payment_min_amount')}
                </Label>
              </div>
              <button
                type="submit"
                disabled={amount < 50}
                className="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-900 disabled:text-gray-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-900 dark:disabled:text-gray-400"
              >
                {localize('com_payment_pay')}
              </button>
            </form>
          </DialogDescription>
        )}
      </DialogContent>
    </Dialog>
  );
}
