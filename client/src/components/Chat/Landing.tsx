import { useMemo } from 'react';
import { EModelEndpoint, isAssistantsEndpoint, Constants, isPluginsEndpoint } from 'librechat-data-provider';
import { useGetEndpointsQuery, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useChatContext, useAssistantsMapContext } from '~/Providers';
import { useGetAssistantDocsQuery } from '~/data-provider';
import ConvoIcon from '~/components/Endpoints/ConvoIcon';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui';
import { TooltipAnchor } from '~/components/ui';
import { BirthdayIcon } from '~/components/svg';
import { getIconEndpoint, cn } from '~/utils';
import { useAuthContext, useLocalize, usePluginDialogHelpers, useSubmitMessage } from '~/hooks';
import { useAvailablePluginsQuery } from 'librechat-data-provider/react-query';
import { usePluginInstall } from '~/hooks';
import { TPlugin, TPluginAction, TError } from 'librechat-data-provider';
import { useSetIndexOptions } from '~/hooks';
import PluginLandingItem from '../Plugins/Store/PluginLandingItem';
import ConvoStarter from './ConvoStarter';

export default function Landing({ Header }: { Header?: ReactNode }) {
  const { preset, conversation, index, setPreset } = useChatContext();
  const assistantMap = useAssistantsMapContext();
  const { user } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const { data: endpointsConfig } = useGetEndpointsQuery();
  const { data: availablePlugins } = useAvailablePluginsQuery();

  const [userPlugins, setUserPlugins] = useState<string[]>([]);

  const localize = useLocalize();

  let { endpoint = '' } = conversation ?? {};
  const { assistant_id = null } = conversation ?? {};

  const isAssistant = isAssistantsEndpoint(endpoint);
  // const isPlugins = isPluginsEndpoint(endpoint);
  const isPlugins = false;
  const isPreset = !!conversation?.promptPrefix;
  const presetName = conversation?.chatGptLabel || conversation?.modelLabel;
  const presetDesc = conversation?.description;
  const assistant = isAssistant ? assistantMap?.[endpoint][assistant_id ?? ''] : undefined;
  const assistantName = (assistant && assistant?.name) || '';
  const assistantDesc = (assistant && assistant?.description) || '';
  const avatar = (assistant && (assistant?.metadata?.avatar as string)) || '';

  const { setError, setErrorMessage } = usePluginDialogHelpers();

  if (
    endpoint === EModelEndpoint.chatGPTBrowser ||
    endpoint === EModelEndpoint.azureOpenAI ||
    endpoint === EModelEndpoint.gptPlugins
  ) {
    endpoint = EModelEndpoint.openAI;
  }

  const iconURL = conversation?.iconURL;
  endpoint = getIconEndpoint({ endpointsConfig, iconURL, endpoint });
  const { data: documentsMap = new Map() } = useGetAssistantDocsQuery(endpoint, {
    select: (data) => new Map(data.map((dbA) => [dbA.assistant_id, dbA])),
  });


  const conversation_starters = useMemo(() => {
    /* The user made updates, use client-side cache,  */
    if (assistant?.conversation_starters) {
      return assistant.conversation_starters;
    }
    /* If none in cache, we use the latest assistant docs */
    const assistantDocs = documentsMap.get(assistant_id ?? '');
    return assistantDocs?.conversation_starters ?? [];
  }, [documentsMap, assistant_id, assistant?.conversation_starters]);

  const containerClassName =
    'shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black';

  const handleInstallError = useCallback(
    (error: TError) => {
      setError(true);
      if (error.response?.data?.message) {
        setErrorMessage(error.response?.data?.message);
      }
      setTimeout(() => {
        setError(false);
        setErrorMessage('');
      }, 5000);
    },
    [setError, setErrorMessage],
  );

  const { installPlugin, uninstallPlugin } = usePluginInstall({
    onInstallError: handleInstallError,
    onUninstallError: handleInstallError,
    onUninstallSuccess: (_data, variables) => {
      setTools(variables.pluginKey, true);
    },
  });

  const { setTools } = useSetIndexOptions();

  const handleInstall = (pluginAction: TPluginAction, plugin?: TPlugin) => {
    if (!plugin) {
      return;
    }
    installPlugin(pluginAction, plugin);
  };

  const onPluginInstall = (pluginKey: string) => {
    const plugin = availablePlugins?.find((p) => p.pluginKey === pluginKey);
    if (!plugin) {
      return;
    }
    handleInstall({ pluginKey, action: 'install', auth: null }, plugin);
    setTools(pluginKey, true);
  };

  useEffect(() => {
    if (user && user.plugins) {
      setUserPlugins(user.plugins);
    }
  }, [user]);

  const { submitMessage } = useSubmitMessage();
  const sendConversationStarter = (text: string) => submitMessage({ text });

  return (
    <TooltipProvider delayDuration={30}>
      <Tooltip>
        <div className="relative h-full">
          <div className="absolute left-0 right-0">{Header && Header}</div>
          <div className="flex h-full flex-col items-center justify-center">
            {isPlugins ? (
              <div className="mx-8 grid h-1/2 grid-cols-1 gap-1 overflow-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {availablePlugins?.map((plugin, index) => {
                  if (index > 4) {
                    return null;
                  }
                  return (
                    <PluginLandingItem
                      key={index}
                      plugin={plugin}
                      isInstalled={userPlugins.includes(plugin.pluginKey)}
                      onInstall={() => onPluginInstall(plugin.pluginKey)}
                      onUninstall={() => uninstallPlugin(plugin.pluginKey)}
                    />
                  );
                })}
              </div>
            ) : (
              <>
                <div
                  className={cn('relative h-12 w-12', assistantName && avatar ? 'mb-0' : 'mb-3')}
                >
                  <ConvoIcon
                    conversation={conversation}
                    assistantMap={assistantMap}
                    endpointsConfig={endpointsConfig}
                    containerClassName={containerClassName}
                    context="landing"
                    className="h-2/3 w-2/3"
                    size={41}
                  />
                  {!!startupConfig?.showBirthdayIcon && (
                    <div>
                      <TooltipTrigger>
                        <BirthdayIcon className="absolute bottom-8 right-2.5" />
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={110} className="">
                        {localize('com_ui_happy_birthday')}
                      </TooltipContent>
                    </div>
                  )}
                </div>
                {assistantName ? (
                  <div className="flex flex-col items-center gap-0 p-2">
                    <div className="text-center text-2xl font-medium dark:text-white">
                      {assistantName}
                    </div>
                    <div className="text-token-text-secondary max-w-md text-center text-xl font-normal ">
                      {assistantDesc ? assistantDesc : localize('com_nav_welcome_message')}
                    </div>
                  </div>
                ) : isPreset ? (
                  <div className="flex flex-col items-center gap-0 p-2">
                    <div className="text-center text-2xl font-medium dark:text-white">
                      {presetName}
                    </div>
                    <div className="text-token-text-secondary max-w-md text-center text-xl font-normal ">
                      {presetDesc ? presetDesc : localize('com_nav_welcome_message')}
                    </div>
                  </div>
                ) : (
                  <div className="mb-5 max-w-[75vh] px-12 text-center text-lg font-medium dark:text-white md:px-0 md:text-2xl">
                    {conversation?.greeting ?? localize('com_nav_welcome_message')}
                  </div>
                )}
                {/* {assistantName ? (
                  <div className="flex flex-col items-center gap-0 p-2">
                    <div className="text-center text-2xl font-medium dark:text-white">
                      {assistantName}
                    </div>
                    <div className="text-token-text-secondary max-w-md text-center text-xl font-normal ">
                      {assistantDesc ? assistantDesc : localize('com_nav_welcome_message')}
                    </div>
                  </div>
                ) : (
                  <div className="mb-5 max-w-[75vh] px-12 text-center text-lg font-medium dark:text-white md:px-0 md:text-2xl">
                    {isPreset
                      ? null
                      : isAssistant
                      ? conversation?.greeting ?? localize('com_nav_welcome_assistant')
                      : conversation?.greeting ?? localize('com_nav_welcome_message')}
                  </div>
                )} */}
              </>
            )}
          </div>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
}
