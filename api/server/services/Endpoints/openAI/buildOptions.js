const buildOptions = (endpoint, parsedBody) => {
  const {
    chatGptLabel,
    description,
    promptPrefix,
    maxContextTokens,
    resendFiles,
    imageDetail,
    iconURL,
    greeting,
    spec,
    ...rest
  } = parsedBody;
  const endpointOption = {
    endpoint,
    chatGptLabel,
    description,
    promptPrefix,
    resendFiles,
    imageDetail,
    iconURL,
    greeting,
    spec,
    maxContextTokens,
    modelOptions: {
      ...rest,
    },
  };

  return endpointOption;
};

module.exports = buildOptions;
