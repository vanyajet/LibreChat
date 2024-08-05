import type { FC } from 'react';
import { Close } from '@radix-ui/react-popover';
import { EModelEndpoint, alternateName } from 'librechat-data-provider';
import { useGetEndpointsQuery } from 'librechat-data-provider/react-query';
import MenuSeparator from '../UI/MenuSeparator';
import { getEndpointField } from '~/utils';
import MenuItem from './MenuItem';
import { useLocalize } from '~/hooks';

const EndpointItems: FC<{
  endpoints: EModelEndpoint[];
  selected: EModelEndpoint | '';
}> = ({ endpoints, selected }) => {
  const { data: endpointsConfig } = useGetEndpointsQuery();
  const localize = useLocalize();
  console.log('endpointsWW', endpoints);
  return (
    <>
      {endpoints &&
        endpoints.map((endpoint, i) => {
          if (!endpoint) {
            return null;
          } else if (!endpointsConfig?.[endpoint]) {
            return null;
          } else if (endpoint === 'groq' || endpoint === 'OpenRouter') {
            // временное решение для OpenRouter и groq
            return null;
          }
          const userProvidesKey: boolean | null | undefined = getEndpointField(
            endpointsConfig,
            endpoint,
            'userProvide',
          );
          return (
            <Close asChild key={`endpoint-${endpoint}`}>
              <div key={`endpoint-${endpoint}`}>
                <MenuItem
                  key={`endpoint-item-${endpoint}`}
                  title={
                    endpoint === 'gptPlugins'
                      ? localize('com_nav_plugins')
                      : alternateName[endpoint] || endpoint
                  }
                  value={endpoint}
                  selected={selected === endpoint}
                  data-testid={`endpoint-item-${endpoint}`}
                  userProvidesKey={!!userProvidesKey}
                  // description="With DALL·E, browsing and analysis"
                />
                {i !== endpoints.length - 1 && <MenuSeparator />}
              </div>
            </Close>
          );
        })}
    </>
  );
};

export default EndpointItems;
