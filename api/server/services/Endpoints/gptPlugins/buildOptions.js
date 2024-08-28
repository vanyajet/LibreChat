const buildOptions = (endpoint, parsedBody) => {
  const {
    chatGptLabel,
    description,
    promptPrefix,
    agentOptions,
    tools,
    iconURL,
    greeting,
    spec,
    maxContextTokens,
    ...modelOptions
  } = parsedBody;
  const endpointOption = {
    endpoint,
    tools:
      tools
        .map((tool) => tool?.pluginKey ?? tool)
        .filter((toolName) => typeof toolName === 'string') ?? [],
    chatGptLabel,
    description,
    promptPrefix,
    agentOptions,
    iconURL,
    greeting,
    spec,
    maxContextTokens,
    modelOptions,
  };

  return endpointOption;
};

module.exports = buildOptions;
