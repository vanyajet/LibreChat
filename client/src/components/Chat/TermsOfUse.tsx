import { DialogDescription } from '@radix-ui/react-dialog';
import type { TDialogProps } from '~/common';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui';
import { useMediaQuery, useLocalize } from '~/hooks';
import { cn } from '~/utils';

export default function TermsOfUse({ open, onOpenChange }: TDialogProps) {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const localize = useLocalize();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        disableScroll={isSmallScreen}
        className={cn(
          'max-h-[90vh] overflow-auto shadow-2xl md:min-h-[500px] md:w-[680px]',
          isSmallScreen ? 'min-h-[200px]' : '',
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-200">
            {localize('com_terms_of_use_1')}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="prose dark:prose-invert light mx-6 mt-2 w-full max-w-fit whitespace-pre-wrap break-words dark:text-gray-20">
          <h2>{localize('com_terms_of_use_1')}</h2>
          <p>{localize('com_terms_of_use_2')}</p>

          {/* <p>{localize('com_terms_of_use_6')}</p> */}

          <p>{localize('com_terms_of_use_7')}</p>
          <h3>{localize('com_terms_of_use_8')}</h3>
          <p>{localize('com_terms_of_use_9')}</p>
          <h3>{localize('com_terms_of_use_10')}</h3>
          <p>{localize('com_terms_of_use_11')}</p>
          {/* <ol>
            <li>{localize('com_terms_of_use_11_1')}</li>

            <li>{localize('com_terms_of_use_11_2')}</li>
          </ol> */}

          <p>{localize('com_terms_of_use_12')}</p>

          <p>{localize('com_terms_of_use_13')}</p>

          <p>{localize('com_terms_of_use_14')}</p>
          <ol>
            <li>{localize('com_terms_of_use_15')}</li>

            <li>{localize('com_terms_of_use_16')}</li>

            <li>{localize('com_terms_of_use_17')}</li>

            <li>{localize('com_terms_of_use_18')}</li>
          </ol>

          <p>{localize('com_terms_of_use_19')}</p>

          {/* <p>{localize('com_terms_of_use_19_1')}</p> */}

          {/* <p>{localize('com_terms_of_use_19_2')}</p> */}

          <h3>{localize('com_terms_of_use_20')}</h3>
          <p>{localize('com_terms_of_use_21')}</p>
          <h3>{localize('com_terms_of_use_3')}</h3>
          <p>{localize('com_terms_of_use_4')}</p>
          <ol>
            <li>{localize('com_terms_of_use_4_1')}</li>
            <li>{localize('com_terms_of_use_4_2')}</li>
          </ol>

          <p>{localize('com_terms_of_use_5')}</p>
          <h3>{localize('com_terms_of_use_22')}</h3>
          <p>{localize('com_terms_of_use_23')}</p>
          <h3>{localize('com_terms_of_use_24')}</h3>
          <p>{localize('com_terms_of_use_25')}</p>

          <p>{localize('com_terms_of_use_25_1')}</p>
          <h3>{localize('com_terms_of_use_26')}</h3>
          <p>{localize('com_terms_of_use_27')}</p>

          <h3>{localize('com_terms_of_use_27_1')}</h3>

          <p>{localize('com_terms_of_use_27_2')}</p>
          <ol>
            <li>{localize('com_terms_of_use_28')}</li>

            <li>{localize('com_terms_of_use_29')}</li>

            <li>{localize('com_terms_of_use_30')}</li>

            <li>{localize('com_terms_of_use_31')}</li>
          </ol>

          <h3>{localize('com_terms_of_use_32')}</h3>

          <p>{localize('com_terms_of_use_33')}</p>
          <ol>
            <li>{localize('com_terms_of_use_34')}</li>

            <li>{localize('com_terms_of_use_35')}</li>

            <li>{localize('com_terms_of_use_36')}</li>

            <li>{localize('com_terms_of_use_37')}</li>
          </ol>

          <p>{localize('com_terms_of_use_38')}</p>

          <h3>{localize('com_terms_of_use_39')}</h3>
          <p>{localize('com_terms_of_use_40')}</p>

          <p>{localize('com_terms_of_use_41')}</p>

          <p>{localize('com_terms_of_use_42')}</p>
          <h3>{localize('com_terms_of_use_43')}</h3>
          <p>{localize('com_terms_of_use_44')}</p>

          <p>{localize('com_terms_of_use_45')}</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
