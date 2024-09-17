import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import TagManager from 'react-gtm-module';
import { Constants } from 'librechat-data-provider';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useLocalize } from '~/hooks';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';

export default function Footer({ className }: { className?: string }) {
  const { data: config } = useGetStartupConfig();
  const localize = useLocalize();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);

  const privacyPolicy = config?.interface?.privacyPolicy;
  const termsOfService = config?.interface?.termsOfService;

  const privacyPolicyRender = privacyPolicy?.externalUrl && (
    <a
      className=" text-gray-600 underline dark:text-gray-300"
      onClick={() => setShowPrivacyPolicy(true)}
      // href={privacyPolicy.externalUrl}
      target={privacyPolicy.openNewTab ? '_blank' : undefined}
      rel="noreferrer"
    >
      {localize('com_ui_privacy_policy')}
    </a>
  );
  // const privacyPolicyRender = privacyPolicy?.externalUrl && (
  //   <a
  //     className=" text-gray-600 underline dark:text-gray-300"

  //     href={privacyPolicy.externalUrl}
  //     target={privacyPolicy.openNewTab ? '_blank' : undefined}
  //     rel="noreferrer"
  //   >
  //     {localize('com_ui_privacy_policy')}
  //   </a>
  // );

  const termsOfServiceRender = termsOfService?.externalUrl && (
    <a
      className=" text-gray-600 underline dark:text-gray-300"
      onClick={() => setShowTermsOfUse(true)}
      // href={termsOfService.externalUrl}
      target={termsOfService.openNewTab ? '_blank' : undefined}
      rel="noreferrer"
    >
      {localize('com_ui_terms_of_service')}
    </a>
  );

  if (config?.analyticsGtmId) {
    const tagManagerArgs = {
      gtmId: config?.analyticsGtmId,
    };
    TagManager.initialize(tagManagerArgs);
  }

  const mainContentParts = (
    '[BrainTech' +
    '](https://braintech.chat) - ' +
    localize('com_ui_latest_footer')
  ).split('|');

  const mainContentRender = mainContentParts.map((text, index) => (
    <React.Fragment key={`main-content-part-${index}`}>
      <ReactMarkdown
        components={{
          a: (props) => {
            const { ['node']: _, href, ...otherProps } = props;
            return (
              <a
                className=" text-gray-600 underline dark:text-gray-300"
                href={href}
                target="_blank"
                rel="noreferrer"
                {...otherProps}
              />
            );
          },
          p: ({ node, ...props }) => <span {...props} />,
        }}
      >
        {text.trim()}
      </ReactMarkdown>
      {showPrivacyPolicy && (
        <PrivacyPolicy open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy} />
      )}
      {showTermsOfUse && <TermsOfUse open={showTermsOfUse} onOpenChange={setShowTermsOfUse} />}
    </React.Fragment>
  ));

  const footerElements = [
    window.innerWidth >= 768 ? mainContentRender : null,
    privacyPolicyRender,
    termsOfServiceRender,
  ].filter(Boolean);

  return (
    <div
      className={
        className ||
        'relative flex items-center justify-center gap-2 px-2 py-2 text-center text-xs text-gray-600 dark:text-gray-300 md:px-[60px]'
      }
    >
      {footerElements.map((contentRender, index) => {
        const isLastElement = index === footerElements.length - 1;
        return (
          <React.Fragment key={`footer-element-${index}`}>
            {contentRender}
            {!isLastElement && (
              <div key={`separator-${index}`} className="h-2 border-r-[1px] border-gray-300" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
