import deepseeksvg from "../../../public/assets/deepseek.svg"
import gropPng from "../../../public/assets/groq.png"
import zhipuaiPng from "../../../public/assets/zhipuai.png"

export const modelConfig = {
  defaultModel: "openai/4o-latest",
  models: {
    "openai/4o-latest": {
      name: "OpenAI GPT-4o Latest",
      icon: "simple-icons:openai",
      apiKeyName: "openai/4o-latest",
      chatFunction: "chatAzure4oLatest",
      requiresApiEndpoint: false,
    },
    "openai/4o": {
      name: "OpenAI GPT-4o",
      icon: "simple-icons:microsoftazure",
      apiKeyName: "openai/4o",
      chatFunction: "chatAzure4o",
      defaultEndpoint: "https://api.openai.com/v1",
      requiresApiEndpoint: true,
    },
    "openai/4o-mini": {
      name: "OpenAI GPT-4o Mini",
      icon: "simple-icons:microsoftazure",
      apiKeyName: "openai/4o-mini",
      chatFunction: "chatAzure4oMini",
      defaultEndpoint: "https://api.openai.com/v1",
      requiresApiEndpoint: true,
    },
    anthropic: {
      name: "Anthropic",
      icon: "simple-icons:anthropic",
      apiKeyName: "anthropic",
      chatFunction: "chatChunkClaude",
      requiresApiEndpoint: false,
    },
    deepseek: {
      name: "DeepSeek",
      icon: deepseeksvg,
      apiKeyName: "deepseek",
      chatFunction: "chatDeepSeek",
      iconType: "image",
      requiresApiEndpoint: false,
    },
    groq: {
      name: "Groq",
      icon: gropPng,
      apiKeyName: "groq",
      chatFunction: "chatChunkGroq",
      iconType: "image",
      requiresApiEndpoint: false,
    },
    zhipuai: {
      name: "智谱 AI （glm-4-flash）",
      icon: zhipuaiPng,
      apiKeyName: "zhipuai",
      chatFunction: "chatZhipuAI",
      defaultEndpoint: "不用填写",
      iconType: "image",
      requiresApiEndpoint: false,
    },
  },
}

export const toolConfig = {
  tools: {
    firecrawl: {
      name: "Firecrawl",
      icon: "simple-icons:anthropic",
      apiKeyName: "firecrawl",
      requiresApiEndpoint: false,
    },
  },
}
