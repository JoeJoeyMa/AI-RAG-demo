import { jsonParse, jsonStringify } from "@/utils"
import { runTools, tools } from "./tools"

const apiKey = localStorage.getItem("mobenai.api-key")

/**
 * 与AI助手进行对话
 * @param {Array} initialMessages - 初始消息列表
 * @param {string} idFlag - 标识符
 * @param {Array} tools - 可用的工具列表
 * @returns {Promise<Object>} 对话结果
 */
export default async (
  initialMessages,
  onChunk,
  idFlag = "an",
  operationContent = "Mo-2 chat for development"
) => {
  const requestAgent = async (messages) => {
    const response = await fetch(
      // `https://ai-mobenai225360927894.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`,
      // "https://api.deepseek.com/chat/completions",
      `/dev/api/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("model-base-user-token"),
          // "api-key": apiKey,
          // Authorization: "Bearer sk-eea581bba2a44cda9970903b1ec8a310",
        },
        body: jsonStringify({
          // model: "deepseek-coder",
          // messages,
          // temperature: 1,
          // top_p: 0.95,
          // max_tokens: 4096,
          // tools,
          // tool_choice: "auto",
          // stream: true,
          id: `mobenai-an`,
          // id: `mobenai-a`,
          operationContent,
          chatCompletionsOptions: {
            max_tokens: 4096,
            temperature: 0,
            messages,
            // tools: tools.length > 0 ? tools : undefined,
            // tool_choice: tools.length > 0 ? "auto" : undefined,
            stream: true,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. ${errorText}`)
    }
    const res = {}
    res.data = await response.json()

    if (res.data.choices[0].finish_reason === "stop" || res.data.choices[0].finish_reason === "tool_calls") {
      return res.data.choices[0]
    } else if (res.data.choices[0].finish_reason === "length") {
      const newMessages = [
        ...messages,
        {
          role: "assistant",
          content: res.data.choices[0].message.content,
        },
      ]
      const continuedResult = await requestAgent(newMessages)
      return {
        ...continuedResult,
        message: {
          ...continuedResult.message,
          content: res.data.choices[0].message.content + continuedResult.message.content,
        },
      }
    }
  }

  const finalResult = await requestAgent(initialMessages)

  // 处理 tool_calls
  if (finalResult.message.tool_calls) {
    for (const toolCall of finalResult.message.tool_calls) {
      const {
        function: { name, arguments: args },
        id,
      } = toolCall
      const tool = runTools.find((t) => t.function.name === name)
      if (tool) {
        initialMessages.push({
          role: "assistant",
          content: null,
          tool_calls: [toolCall],
        })
        try {
          const result = await tool.function.implementation(jsonParse(args))
          initialMessages.push({
            role: "tool",
            tool_call_id: id,
            name: name,
            content: jsonStringify(result),
          })
        } catch (error) {
          console.error(`Error executing tool ${name}:`, error)
          initialMessages.push({
            role: "tool",
            name: name,
            content: jsonStringify({ error: error.message }),
          })
        }
      }
    }
    // 继续对话，包含工具调用的结果
    return chatMoV2(initialMessages, onChunk, idFlag, operationContent)
  }

  onChunk(finalResult.message.content)
}
