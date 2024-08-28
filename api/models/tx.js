const { matchModelName } = require('../utils');
const defaultRate = 0.005;

/**
 * Mapping of model token sizes to their respective multipliers for prompt and completion.
 * The rates are 1 USD per 1M tokens.
 * @type {Object.<string, {prompt: number, completion: number}>}
 */
const tokenValues = {
  '8k': { prompt: 0.0015, completion: 0.003 },
  '32k': { prompt: 0.003, completion: 0.006 },
  '4k': { prompt: 0.0008, completion: 0.001 },
  '16k': { prompt: 0.0015, completion: 0.002 },
  'gpt-3.5-turbo-1106': { prompt: 0.0005, completion: 0.001 },
  'gpt-4o': { prompt: 0.0015, completion: 0.0027 }, // 1.5 / 2.7 rub per 1000 tokens
  'gpt-4-1106': { prompt: 0.005, completion: 0.015 },
  'gpt-3.5-turbo-0125': { prompt: 0.00025, completion: 0.0008 },
  'claude-3-opus': { prompt: 0.0008, completion: 0.004 },
  'claude-3-sonnet': { prompt: 0.0015, completion: 0.0008 },
  'claude-3-5-sonnet': { prompt: 0.0015, completion: 0.0008 },
  'claude-3-haiku': { prompt: 0.00015, completion: 0.00025 },
  'claude-2.1': { prompt: 0.008, completion: 0.004 },
  'claude-2': { prompt: 0.008, completion: 0.0024 },
  'claude-': { prompt: 0.0008, completion: 0.00024 },
  mistral: { prompt: 0.005, completion: 0.015 },
  'open-mistral-7b': { prompt: 0.005, completion: 0.015 },
  'mistral-tiny': { prompt: 0.003, completion: 0.008 },
  'command-r-plus': { prompt: 0.003, completion: 0.0015 },
  'command-r': { prompt: 0.0005, completion: 0.00015 },
  /* cohere doesn't have rates for the older command models,
  so this was from https://artificialanalysis.ai/models/command-light/providers */
  command: { prompt: 0.38, completion: 0.38 },
  // 'gemini-1.5': { prompt: 7, completion: 21 }, // May 2nd, 2024 pricing
  // 'gemini': { prompt: 0.5, completion: 1.5 }, // May 2nd, 2024 pricing
  'gemini-1.5': { prompt: 0.0012, completion: 0.0026 }, // currently free
  gemini: { prompt: 0.001, completion: 0.0023 }, // currently free
};

/**
 * Retrieves the key associated with a given model name.
 *
 * @param {string} model - The model name to match.
 * @param {string} endpoint - The endpoint name to match.
 * @returns {string|undefined} The key corresponding to the model name, or undefined if no match is found.
 */
const getValueKey = (model, endpoint) => {
  const modelName = matchModelName(model, endpoint);
  if (!modelName) {
    return undefined;
  }

  if (modelName.includes('gpt-3.5-turbo-16k')) {
    return '16k';
  } else if (modelName.includes('gpt-3.5-turbo-0125')) {
    return 'gpt-3.5-turbo-0125';
  } else if (modelName.includes('gpt-3.5-turbo-1106')) {
    return 'gpt-3.5-turbo-1106';
  } else if (modelName.includes('gpt-3.5')) {
    return '4k';
  } else if (modelName.includes('gpt-4o')) {
    return 'gpt-4o';
  } else if (modelName.includes('gpt-4-vision')) {
    return 'gpt-4-1106';
  } else if (modelName.includes('gpt-4-1106')) {
    return 'gpt-4-1106';
  } else if (modelName.includes('gpt-4-0125')) {
    return 'gpt-4-1106';
  } else if (modelName.includes('gpt-4-turbo')) {
    return 'gpt-4-1106';
  } else if (modelName.includes('gpt-4-32k')) {
    return '32k';
  } else if (modelName.includes('gpt-4')) {
    return '8k';
  } else if (tokenValues[modelName]) {
    return modelName;
  }

  return undefined;
};

/**
 * Retrieves the multiplier for a given value key and token type. If no value key is provided,
 * it attempts to derive it from the model name.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} [params.valueKey] - The key corresponding to the model name.
 * @param {string} [params.tokenType] - The type of token (e.g., 'prompt' or 'completion').
 * @param {string} [params.model] - The model name to derive the value key from if not provided.
 * @param {string} [params.endpoint] - The endpoint name to derive the value key from if not provided.
 * @param {EndpointTokenConfig} [params.endpointTokenConfig] - The token configuration for the endpoint.
 * @returns {number} The multiplier for the given parameters, or a default value if not found.
 */
const getMultiplier = ({ valueKey, tokenType, model, endpoint, endpointTokenConfig }) => {
  if (endpointTokenConfig) {
    return endpointTokenConfig?.[model]?.[tokenType] ?? defaultRate;
  }

  if (valueKey && tokenType) {
    return tokenValues[valueKey][tokenType] ?? defaultRate;
  }

  if (!tokenType || !model) {
    return 1;
  }

  valueKey = getValueKey(model, endpoint);
  if (!valueKey) {
    return defaultRate;
  }

  // If we got this far, and values[tokenType] is undefined somehow, return a rough average of default multipliers
  return tokenValues[valueKey][tokenType] ?? defaultRate;
};

module.exports = { tokenValues, getValueKey, getMultiplier, defaultRate };
