import { useGetModelsQuery } from 'librechat-data-provider/react-query';
import { EModelEndpoint, type TConversation } from 'librechat-data-provider';
import type { TSetOption } from '~/common';
import { multiChatOptions } from './options';
import { useRecoilState } from 'recoil';
import store from '~/store';

type TGoogleProps = {
  showExamples: boolean;
  isCodeChat: boolean;
};

type TSelectProps = {
  conversation: TConversation | null;
  setOption: TSetOption;
  extraProps?: TGoogleProps;
  showAbove?: boolean;
  popover?: boolean;
};

export default function ModelSelect({
  conversation,
  setOption,
  popover = false,
  showAbove = true,
}: TSelectProps) {
  const modelsQuery = useGetModelsQuery();
  const [hideSidePanel, setHideSidePanel] = useRecoilState<boolean>(store.hideSidePanel);

  if (!conversation?.endpoint) {
    return null;
  }

  const { endpoint: _endpoint, endpointType } = conversation;
  const models = modelsQuery?.data?.[_endpoint] ?? [];
  const endpoint = endpointType ?? _endpoint;

  const OptionComponent = multiChatOptions[endpoint];

  if (endpoint === EModelEndpoint.assistants && !!hideSidePanel) {
    setHideSidePanel(false);
  }

  if (!OptionComponent) {
    return null;
  }

  return (
    <OptionComponent
      conversation={conversation}
      setOption={setOption}
      models={models}
      showAbove={showAbove}
      popover={popover}
    />
  );
}
