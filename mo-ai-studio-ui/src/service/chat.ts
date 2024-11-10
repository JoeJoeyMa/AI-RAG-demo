import { modelConfig } from "../pages/mo/DevChatModelConfig"
import { localDB } from "@/utils/localDB"
import chatAzure from "./chat-chunk"
import chatChunkClaude from "./chat-chunk-claude-office"
import chatChunkGoogle from "./chat-chunk-google"
import chatDeepSeek from "./chat-deepseek"
import chatZhipuAI from "./chat-zhipuai"
import chatDev from "./chat-dev"
import chatDevFetch from "./chat-dev-fetch"
import chat4oLatest from "./chat-chunk-openai-office"
import chatChunkGroq from "./chat-chunk-groq"
import { message } from "@/components/Message"
import { defaultRoleCards } from "../pages/mo/defaultRoleCards"
import { replaceVariables } from "@/utils"

const STORAGE_KEYS = {
  API_KEY: "mobenai.api-key",
  API_ENDPOINT: "mobenai.api-endpoint",
}

const chatApis = {
  chatAzure4oLatest: chat4oLatest,
  chatAzure4o: chatAzure,
  chatAzure4oMini: chatAzure,
  chatChunkClaude,
  chatChunkGoogle,
  chatDeepSeek,
  chatDev,
  chatDevFetch,
  chatChunkGroq,
  chatZhipuAI,
}

const handleError = (msg: string) => {
  message.error(msg)
  throw new Error(msg)
}

export const chatRole = async (messages, userInput, selectedRoleCardId, onChunk, onCancel) => {
  const apiKeys = localDB.getItem("apiKeys") || "{}"
  const apiEndPoints = localDB.getItem("apiEndpoints") || "{}"
  const userRoleCards = localDB.getItem("roleCards") || []
  const defaultCardValues = localDB.getItem("defaultRoleCardValues") || {}

  const allRoleCards = [
    ...defaultRoleCards.map((card) => ({
      ...card,
      variables: Object.entries(card.variables).reduce((acc, [key, value]) => {
        acc[key] = {
          ...value,
          value: defaultCardValues[card.id]?.[key]?.value || value.value || "",
        }
        return acc
      }, {}),
    })),
    ...userRoleCards,
  ]

  const selectedCard = allRoleCards.find((card) => card.id === selectedRoleCardId)
  if (!selectedCard) {
    handleError(`未找到选中的智能体卡片：${selectedRoleCardId}`)
  }

  const selectedModel = selectedCard.baseModel
  const model = modelConfig.models[selectedModel]
  if (!model) {
    handleError(`选择的模型无效：${selectedModel}`)
  }

  if (!apiKeys[model.apiKeyName]) {
    handleError(`${model.name} API密钥未设置。请在设置中设置它。${apiKeys}`)
  } else {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKeys[model.apiKeyName])
  }

  if (apiEndPoints[model.apiKeyName]) {
    localStorage.setItem(STORAGE_KEYS.API_ENDPOINT, apiEndPoints[model.apiKeyName])
  }

  const chatApi = chatApis[model.chatFunction]
  if (!chatApi) {
    handleError(`未找到该模型的聊天功能：${selectedModel}`)
  }

  try {
    const processedConstraint = await replaceVariables(selectedCard.constraint, {
      ...selectedCard.variables,
      input: { value: userInput, setter: "textSetter" },
    })

    let { instruction } = selectedCard
    const matchedCustomInstruction =
      Array.isArray(selectedCard.customInstructions) &&
      selectedCard.customInstructions.find((ci) => userInput.startsWith(ci.prefix))

    if (matchedCustomInstruction) {
      instruction = matchedCustomInstruction.instruction
      userInput = userInput.slice(matchedCustomInstruction.prefix.length).trim()
    }

    if (typeof instruction === "function") {
      instruction = await instruction(userInput)
    }

    const processedInstruction = await replaceVariables(instruction, {
      ...selectedCard.variables,
      input: { value: userInput, setter: "textSetter" },
    })

    const systemMessage = { role: "system", content: processedConstraint }

    const processedMessages = [
      systemMessage,
      ...messages
        .filter((msg) => msg.status !== "loading" && msg.role !== "system")
        .map((msg, index, arr) => ({
          role: msg.role,
          content: index === arr.length - 1 && msg.role === "user" ? processedInstruction : msg.message,
          images: msg.images || [],
        })),
    ]

    await chatApi(processedMessages, onChunk, onCancel, true, selectedCard.temperature, "YES")
  } catch (error) {
    if (!error.message.includes("aborted")) {
      const errorMessage = `聊天过程中发生错误: ${error.message}`
      message.error(errorMessage)
      onChunk(errorMessage)
      throw error
    }
  }
}

export const chatByRoleName = async (userInput: string, selectedRoleCardName: string, onChunk, onCancel) => {
  const apiKeys = localDB.getItem("apiKeys") || "{}"
  const apiEndPoints = localDB.getItem("apiEndpoints") || "{}"
  const userRoleCards = localDB.getItem("roleCards") || []
  const defaultCardValues = localDB.getItem("defaultRoleCardValues") || {}

  const allRoleCards = [
    ...defaultRoleCards.map((card) => ({
      ...card,
      variables: Object.entries(card.variables).reduce((acc, [key, value]) => {
        acc[key] = {
          ...value,
          value: defaultCardValues[card.id]?.[key]?.value || value.value || "",
        }
        return acc
      }, {}),
    })),
    ...userRoleCards,
  ]

  const selectedCard = allRoleCards.find((card) => card.name === selectedRoleCardName)
  if (!selectedCard) {
    handleError(`未找到选中的智能体卡片：${selectedRoleCardName}`)
  }

  const selectedModel = selectedCard.baseModel
  const model = modelConfig.models[selectedModel]
  if (!model) {
    handleError(`选择的模型无效：${selectedModel}`)
  }

  if (!apiKeys[model.apiKeyName]) {
    handleError(`${model.name} API密钥未设置。请在设置中设置它。`)
  } else {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKeys[model.apiKeyName])
  }

  if (!apiEndPoints[model.apiKeyName]) {
    handleError(`${model.name} API未设置。请在设置中设置它。`)
  } else {
    localStorage.setItem(STORAGE_KEYS.API_ENDPOINT, apiEndPoints[model.apiKeyName])
  }

  const chatApi = chatApis[model.chatFunction]
  if (!chatApi) {
    handleError(`未找到该模型的聊天功能：${selectedModel}`)
  }

  try {
    const processedConstraint = await replaceVariables(selectedCard.constraint, {
      ...selectedCard.variables,
      input: { value: userInput, setter: "textSetter" },
    })

    let { instruction } = selectedCard
    const matchedCustomInstruction =
      Array.isArray(selectedCard.customInstructions) &&
      selectedCard.customInstructions.find((ci) => userInput.startsWith(ci.prefix))

    if (matchedCustomInstruction) {
      instruction = matchedCustomInstruction.instruction
      userInput = userInput.slice(matchedCustomInstruction.prefix.length).trim()
    }

    if (typeof instruction === "function") {
      instruction = await instruction(userInput)
    }

    const processedInstruction = await replaceVariables(instruction, {
      ...selectedCard.variables,
      input: { value: userInput, setter: "textSetter" },
    })

    const systemMessage = { role: "system", content: processedConstraint }

    const processedMessages = [systemMessage, { role: "user", content: processedInstruction }]

    await chatApi(processedMessages, onChunk, onCancel, true, selectedCard.temperature, "TASK_OVER")
  } catch (error) {
    if (!error.message.includes("aborted")) {
      const errorMessage = `聊天过程中发生错误: ${error.message}`
      message.error(errorMessage)
      onChunk(errorMessage)
      throw error
    }
  }
}

export const chatForMagicWand = async (userInput: string, field: string, onChunk) => {
  const apiKeys = localDB.getItem("apiKeys") || "{}"
  try {
    const systemMessage = {
      role: "system",
      content: `你是一个智能助手，专门帮助用户生成智能体的${
        field === "constraint" ? "约束" : "指令"
      }。请根据用户的输入，生成适当的内容。`,
    }

    const userMessage = {
      role: "user",
      content: `请为我生成一个智能体的${field === "constraint" ? "约束" : "指令"}，内容如下：${userInput}`,
    }

    const processedMessages = [systemMessage, userMessage]
    if (!apiKeys["deepseek"]) {
      handleError(`deepseek API密钥未设置。请在设置中设置它。`)
    } else {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKeys["deepseek"])
    }
    await chatDeepSeek(processedMessages, onChunk, () => {}, true, 1, "TASK_OVER")
  } catch (error) {
    if (!error.message.includes("aborted")) {
      const errorMessage = `生成${field === "constraint" ? "约束" : "指令"}时发生错误: ${error.message}`
      message.error(errorMessage)
      onChunk(errorMessage)
      throw error
    }
  }
}
