import { DialogDescription } from '@radix-ui/react-dialog';
import type { TDialogProps } from '~/common';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui';
import { useMediaQuery, useLocalize } from '~/hooks';
import { cn } from '~/utils';

export default function PrivacyPolicy({ open, onOpenChange }: TDialogProps) {
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
            {localize('com_privacy_policy_title')}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="prose dark:prose-invert light mx-6 mt-2 w-full max-w-fit whitespace-pre-wrap break-words dark:text-gray-20">
          {/* <p>{localize('com_privacy_policy_header')}</p> */}
          <p>{localize('com_privacy_policy_intro')}</p>
          <h3>{localize('com_privacy_policy_h_1')}</h3>
          <p>{localize('com_privacy_policy_p_1')}</p>
          <ul>
            <li>{localize('com_privacy_policy_li_1_1')}</li>
            <li>{localize('com_privacy_policy_li_1_2')}</li>
            <li>{localize('com_privacy_policy_li_1_3')}</li>
          </ul>
          <h3>{localize('com_privacy_policy_h_2')}</h3>
          <p>{localize('com_privacy_policy_p_2')}</p>
          <ul>
            <li>{localize('com_privacy_policy_li_2_1')}</li>
            <li>{localize('com_privacy_policy_li_2_2')}</li>
            <li>{localize('com_privacy_policy_li_2_3')}</li>
            <li>{localize('com_privacy_policy_li_2_4')}</li>
          </ul>
          <h3>{localize('com_privacy_policy_h_3')}</h3>
          <p>{localize('com_privacy_policy_p_3')}</p>
          <ul>
            <li>{localize('com_privacy_policy_li_3_1')}</li>
            <li>{localize('com_privacy_policy_li_3_2')}</li>
            <li>{localize('com_privacy_policy_li_3_3')}</li>
          </ul>
          <h3>{localize('com_privacy_policy_h_4')}</h3>
          <p>{localize('com_privacy_policy_p_4')}</p>
          <h3>{localize('com_privacy_policy_h_5')}</h3>
          <p>{localize('com_privacy_policy_p_5')}</p>
          <h3>{localize('com_privacy_policy_h_6')}</h3>
          <p>{localize('com_privacy_policy_p_6')}</p>
          <h3>{localize('com_privacy_policy_h_7')}</h3>
          <p>{localize('com_privacy_policy_p_7')}</p>
          <h3>{localize('com_privacy_policy_h_8')}</h3>
          <p>{localize('com_privacy_policy_p_8')}</p>
          <ul>
            <li>{localize('com_privacy_policy_li_8_1')}</li>
            {/* <li>{localize('com_privacy_policy_li_8_2')}</li> */}
          </ul>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
