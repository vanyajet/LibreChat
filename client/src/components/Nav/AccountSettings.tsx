import { useRecoilState } from 'recoil';
import * as Select from '@ariakit/react/select';
import { Fragment, useState, memo } from 'react';
import { FileText, LogOut, Plus, TablePropertiesIcon } from 'lucide-react';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { LinkIcon, GearIcon, DropdownMenuSeparator } from '~/components';
import FilesView from '~/components/Chat/Input/Files/FilesView';
import { useAuthContext } from '~/hooks/AuthContext';
import useAvatar from '~/hooks/Messages/useAvatar';
import { UserIcon } from '~/components/svg';
import { useLocalize } from '~/hooks';
import Settings from './Settings';
import store from '~/store';
import NavLink from './NavLink';
import PaymentModal from '../Transactions/PaymentModal';
import TransactionsModal from '../Transactions/TransactionsModal';
import { ListBulletIcon } from '@radix-ui/react-icons';

function AccountSettings() {
  const localize = useLocalize();
  const { user, isAuthenticated, logout } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFiles, setShowFiles] = useRecoilState(store.showFiles);

  const avatarSrc = useAvatar(user);
  const name = user?.avatar ?? user?.username ?? '';

  return (
    <Select.SelectProvider>
      <Select.Select
        aria-label={localize('com_nav_account_settings')}
        data-testid="nav-user"
        className="duration-350 mt-text-sm flex h-auto w-full items-center gap-2 rounded-xl p-2 text-sm transition-all duration-200 ease-in-out hover:bg-accent"
      >
        <div className="-ml-0.9 -mt-0.8 h-8 w-8 flex-shrink-0">
          <div className="relative flex">
            {name.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'rgb(121, 137, 255)',
                  width: '32px',
                  height: '32px',
                  boxShadow: 'rgba(240, 246, 252, 0.1) 0px 0px 0px 1px',
                }}
                className="relative flex items-center justify-center rounded-full p-1 text-text-primary"
                aria-hidden="true"
              >
                <UserIcon />
              </div>
            ) : (
              <img
                className="rounded-full"
                src={user?.avatar ?? avatarSrc}
                alt={`${name}'s avatar`}
              />
            )}
          </div>
        </div>
        <div
          className="mt-2 grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-text-primary"
          style={{ marginTop: '0', marginLeft: '0' }}
        >
          {user?.name ?? user?.username ?? localize('com_nav_user')}
        </div>
      </Select.Select>
      <Select.SelectPopover
        className="popover-ui w-[235px]"
        style={{
          transformOrigin: 'bottom',
          marginRight: '0px',
          translate: '0px',
          maxHeight: 'fit-content',
        }}
      >
        <div className="text-token-text-secondary ml-3 mr-2 py-2 text-sm" role="note">
          {user?.email ?? localize('com_nav_user')}
        </div>
        <DropdownMenuSeparator />
        {startupConfig?.checkBalance === true &&
          balanceQuery.data != null &&
          !isNaN(parseFloat(balanceQuery.data)) && (
            <>
              <div className="text-token-text-secondary ml-3 mr-2 py-2 text-sm" role="note">
                {`${localize('com_nav_balance')}: ${parseFloat(balanceQuery.data).toFixed(2)}`}
              </div>
            </>
          )}

        <NavLink
          svg={() => <Plus className="icon-md" />}
          text={localize('com_nav_top_up') ? localize('com_nav_top_up') : 'Top Up'}
          className="my-1 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition duration-500 duration-500 ease-in-out ease-in-out hover:bg-gradient-to-br hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 hover:transition"
          clickHandler={() => setShowPaymentModal(true)}
        />
        <Select.SelectItem
          value=""
          onClick={() => setShowTransactionsModal(true)}
          className="select-item text-sm"
        >
          <TablePropertiesIcon className="icon-md" aria-hidden="true" />
          {localize('com_nav_transactions')}
        </Select.SelectItem>
        <DropdownMenuSeparator />
        <Select.SelectItem
          value=""
          onClick={() => setShowFiles(true)}
          className="select-item text-sm"
        >
          <FileText className="icon-md" aria-hidden="true" />
          {localize('com_nav_my_files')}
        </Select.SelectItem>
        {startupConfig?.helpAndFaqURL !== '/' && (
          <Select.SelectItem
            value=""
            onClick={() => window.open(startupConfig?.helpAndFaqURL, '_blank')}
            className="select-item text-sm"
          >
            <LinkIcon aria-hidden="true" />
            {localize('com_nav_help_faq')}
          </Select.SelectItem>
        )}
        <Select.SelectItem
          value=""
          onClick={() => setShowSettings(true)}
          className="select-item text-sm"
        >
          <GearIcon className="icon-md" aria-hidden="true" />
          {localize('com_nav_settings')}
        </Select.SelectItem>
        <DropdownMenuSeparator />
        <Select.SelectItem
          aria-selected={true}
          onClick={() => logout()}
          value="logout"
          className="select-item text-sm"
        >
          <LogOut className="icon-md" />
          {localize('com_nav_log_out')}
        </Select.SelectItem>
      </Select.SelectPopover>
      {showFiles && <FilesView open={showFiles} onOpenChange={setShowFiles} />}
      {showSettings && <Settings open={showSettings} onOpenChange={setShowSettings} />}
      {showPaymentModal && (
        <PaymentModal open={showPaymentModal} onOpenChange={setShowPaymentModal} />
      )}
      {showTransactionsModal && (
        <TransactionsModal open={showTransactionsModal} onOpenChange={setShowTransactionsModal} />
      )}
    </Select.SelectProvider>
  );
}

export default memo(AccountSettings);
