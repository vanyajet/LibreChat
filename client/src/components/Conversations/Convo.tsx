import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Check, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Constants } from 'librechat-data-provider';
import { useGetEndpointsQuery, useGetStartupConfig } from 'librechat-data-provider/react-query';
import type { MouseEvent, FocusEvent, KeyboardEvent } from 'react';
import type { TConversation } from 'librechat-data-provider';
import { useConversations, useNavigateToConvo, useMediaQuery } from '~/hooks';
import { useUpdateConversationMutation } from '~/data-provider';
import EndpointIcon from '~/components/Endpoints/EndpointIcon';
import { NotificationSeverity } from '~/common';
import { ArchiveIcon } from '~/components/svg';
import { useToastContext } from '~/Providers';
import { ConvoOptions } from './ConvoOptions';
import DropDownMenu from './DropDownMenu';
import ArchiveButton from './ArchiveButton';
import DeleteButton from './DeleteButton';
import RenameButton from './RenameButton';
import HoverToggle from './HoverToggle';
import ShareButton from './ShareButton';
import { cn } from '~/utils';
import store from '~/store';
import { useLocalize } from '~/hooks'

type KeyEvent = KeyboardEvent<HTMLInputElement>;

type ConversationProps = {
  conversation: TConversation;
  retainView: () => void;
  toggleNav: () => void;
  isLatestConvo: boolean;
};

export default function Conversation({
  conversation,
  retainView,
  toggleNav,
  isLatestConvo,
}: ConversationProps) {
  const params = useParams();
  const localize = useLocalize();
  const currentConvoId = useMemo(() => params.conversationId, [params.conversationId]);
  const updateConvoMutation = useUpdateConversationMutation(currentConvoId ?? '');
  const activeConvos = useRecoilValue(store.allConversationsSelector);
  const { data: endpointsConfig } = useGetEndpointsQuery();
  const { navigateWithLastTools } = useNavigateToConvo();
  const { data: startupConfig } = useGetStartupConfig();
  const { refreshConversations } = useConversations();
  const { showToast } = useToastContext();
  const { conversationId, title } = conversation;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [titleInput, setTitleInput] = useState(title);
  const [renaming, setRenaming] = useState(false);
  const [isPopoverActive, setIsPopoverActive] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const clickHandler = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button === 0 && (event.ctrlKey || event.metaKey)) {
      toggleNav();
      return;
    }

    event.preventDefault();
    if (currentConvoId === conversationId || isPopoverActive) {
      return;
    }

    toggleNav();

    // set document title
    if (typeof title === 'string' && title.length > 0) {
      document.title = title;
    }
    /* Note: Latest Message should not be reset if existing convo */
    navigateWithLastTools(
      conversation,
      !(conversationId ?? '') || conversationId === Constants.NEW_CONVO,
    );
  };

  const renameHandler: (e: MouseEvent<HTMLButtonElement>) => void = () => {
    setIsPopoverActive(false);
    setTitleInput(title);
    setRenaming(true);
  };

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [renaming]);

  const onRename = (e: MouseEvent<HTMLButtonElement> | FocusEvent<HTMLInputElement> | KeyEvent) => {
    e.preventDefault();
    setRenaming(false);
    if (titleInput === title) {
      return;
    }
    if (typeof conversationId !== 'string' || conversationId === '') {
      return;
    }

    updateConvoMutation.mutate(
      { conversationId, title: titleInput ?? '' },
      {
        onSuccess: () => refreshConversations(),
        onError: () => {
          setTitleInput(title);
          showToast({
            message: 'Failed to rename conversation',
            severity: NotificationSeverity.ERROR,
            showIcon: true,
          });
        },
      },
    );
  };

  const handleKeyDown = (e: KeyEvent) => {
    if (e.key === 'Escape') {
      setTitleInput(title);
      setRenaming(false);
    } else if (e.key === 'Enter') {
      onRename(e);
    }
  };

  const cancelRename = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTitleInput(title);
    setRenaming(false);
  };

  const isActiveConvo: boolean =
    currentConvoId === conversationId ||
    (isLatestConvo &&
      currentConvoId === 'new' &&
      activeConvos[0] != null &&
      activeConvos[0] !== 'new');

  return (
    <div
      className={cn(
        'group relative mt-2 flex h-9 w-full items-center rounded-lg',
        isActiveConvo ? 'bg-gray-200 dark:bg-gray-700' : '',
        isSmallScreen ? 'h-12' : '',
      )}
    >
      {/* Chat button */}
      {renaming ? (
        <div className="absolute inset-0 z-20 flex w-full items-center rounded-lg bg-gray-200 p-1.5 dark:bg-gray-700">
          <input
            ref={inputRef}
            type="text"
            className="w-full rounded bg-transparent p-0.5 text-sm leading-tight outline-none"
            value={titleInput ?? ''}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={`${localize('com_ui_rename')} ${localize('com_ui_chat')}`}
          />
          <div className="flex gap-1">
            <button onClick={cancelRename} aria-label={`${localize('com_ui_cancel')} ${localize('com_ui_rename')}`}>
              <X aria-hidden={true} className="transition-colors h-4 w-4 duration-200 ease-in-out hover:opacity-70" />
            </button>
            <button onClick={onRename} aria-label={`${localize('com_ui_submit')} ${localize('com_ui_rename')}`}>
              <Check aria-hidden={true} className="transition-colors h-4 w-4 duration-200 ease-in-out hover:opacity-70" />
            </button>
          </div>
        </div>
      ) : (
        <HoverToggle
          isActiveConvo={isActiveConvo}
          isPopoverActive={isPopoverActive}
          setIsPopoverActive={setIsPopoverActive}
        >
          {/* more dropdown button */}
          <DropDownMenu tooltip={localize('com_ui_more_options')}>
            {startupConfig && startupConfig.sharedLinksEnabled && (
              <ShareButton
                conversationId={conversationId}
                title={title}
                appendLabel={true}
                className="mb-[3.5px]"
                setPopoverActive={setIsPopoverActive}
              />
            )}

            <RenameButton
              renaming={renaming}
              onRename={onRename}
              renameHandler={renameHandler}
              appendLabel={true}
              className="mb-[3.5px]"
            />
            <DeleteButton
              conversationId={conversationId}
              retainView={retainView}
              renaming={renaming}
              title={title}
              appendLabel={true}
              className="group m-1.5 mt-[3.5px] flex w-full cursor-pointer items-center gap-2 rounded p-2.5 text-sm hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:outline-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600"
            />
          </DropDownMenu>
          <ArchiveButton
            className="z-50 hover:text-black dark:hover:text-white"
            conversationId={conversationId}
            retainView={retainView}
            shouldArchive={true}
            icon={<ArchiveIcon className="hover:text-gray-400" />}
          />
        </HoverToggle>
      )}
      <a
        href={`/c/${conversationId}`}
        data-testid="convo-item"
        onClick={clickHandler}
        className={cn(
          isActiveConvo || isPopoverActive
            ? 'group relative mt-2 flex cursor-pointer items-center gap-2 break-all rounded-lg bg-blue-400 px-2 py-2 active:opacity-50 dark:bg-gray-700'
            : 'group relative mt-2 flex grow cursor-pointer items-center gap-2 overflow-hidden whitespace-nowrap break-all rounded-lg px-2 py-2 hover:bg-blue-200 active:opacity-50 dark:hover:bg-gray-700',
          !isActiveConvo && !renaming ? 'peer-hover:bg-blue-200 dark:peer-hover:bg-gray-800' : '',
        )}
        title={title}
      >
        <EndpointIcon
          conversation={conversation}
          endpointsConfig={endpointsConfig}
          size={20}
          context="menu-item"
        />
        {!renaming && (
          <div className="relative line-clamp-1 max-h-5 flex-1 grow overflow-hidden">{title}</div>
        )}
        {isActiveConvo ? (
          <div
            className={cn(
              'absolute bottom-0 right-0 top-0 w-20 rounded-r-lg bg-gradient-to-l',
              !renaming ? 'from-blue-400 from-60% to-transparent dark:from-gray-700' : '',
            )}
          />
        ) : (
          <div className="absolute bottom-0 right-0 top-0 w-20 rounded-r-lg bg-gradient-to-l from-gray-50 from-0% to-transparent group-hover:from-blue-200 group-hover:from-60% dark:from-gray-850 dark:group-hover:from-gray-700" />
        )}
      </a>
    </div>
  );
}
