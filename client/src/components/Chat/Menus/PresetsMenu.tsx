import type { FC } from 'react';
import { BookCopy } from 'lucide-react';
import { Content, Portal, Root, Trigger } from '@radix-ui/react-popover';
import { EditPresetDialog, PresetItems } from './Presets';
import { useLocalize, usePresets } from '~/hooks';
import { useChatContext } from '~/Providers';
import { TooltipAnchor } from '~/components';
import { cn } from '~/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui';

const PresetsMenu: FC = () => {
  const localize = useLocalize();
  const {
    presetsQuery,
    onSetDefaultPreset,
    onFileSelected,
    onSelectPreset,
    onChangePreset,
    onDuplicatePreset,
    clearAllPresets,
    onDeletePreset,
    submitPreset,
    exportPreset,
  } = usePresets();
  const { preset } = useChatContext();

  const presets = presetsQuery.data || [];
  return (
    <Root>
      <TooltipProvider delayDuration={20}>
        <Tooltip>
          <TooltipTrigger>
            <Trigger asChild>
              <button
                className={cn(
                  'pointer-cursor relative flex flex-col rounded-md border border-gray-100 bg-white text-left focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-gray-700 dark:bg-gray-800 sm:text-sm',
                  'hover:bg-gray-50 radix-state-open:bg-gray-50 dark:hover:bg-gray-700 dark:radix-state-open:bg-gray-700',
                  'z-50 flex h-[40px] min-w-4 flex-none items-center justify-center px-3 focus:ring-0 focus:ring-offset-0',
                )}
                id="presets-button"
                data-testid="presets-button"
                title={localize('com_endpoint_examples')}
              >
                <BookCopy className="icon-sm" id="presets-button" />
                <TooltipContent side="bottom">
                  {localize('com_sidepanel_select_preset')}
                </TooltipContent>
              </button>
            </Trigger>
          </TooltipTrigger>
          <Portal>
            <div
              style={{
                position: 'fixed',
                left: '0px',
                top: '0px',
                transform: 'translate3d(268px, 50px, 0px)',
                minWidth: 'max-content',
                zIndex: 'auto',
              }}
            >
              <Content
                side="bottom"
                align="center"
                className="mt-2 max-h-[495px] overflow-x-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white md:min-w-[400px]"
              >
                <PresetItems
                  presets={presets}
                  onSetDefaultPreset={onSetDefaultPreset}
                  onSelectPreset={onSelectPreset}
                  onChangePreset={onChangePreset}
                  onDuplicatePreset={onDuplicatePreset}
                  onDeletePreset={onDeletePreset}
                  clearAllPresets={clearAllPresets}
                  onFileSelected={onFileSelected}
                />
              </Content>
            </div>
          </Portal>
          {preset && <EditPresetDialog submitPreset={submitPreset} exportPreset={exportPreset} />}
        </Tooltip>
      </TooltipProvider>
    </Root>
  );
};

export default PresetsMenu;
