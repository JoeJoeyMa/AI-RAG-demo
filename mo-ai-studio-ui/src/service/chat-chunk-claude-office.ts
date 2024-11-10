import { message } from "@/components/Message"
import { blog, fetchController, jsonParse, jsonStringify } from "@/utils"
import { localDB } from "@/utils/localDB"

let systemMsg

function mergeAdjacentRoles(arr) {
  if (arr.length === 0) return []

  const result = []
  let current = { ...arr[0] }

  for (let i = 1; i < arr.length; i++) {
    if (arr[i].role === current.role) {
      current.content += arr[i].content
    } else {
      result.push(current)
      current = { ...arr[i] }
    }
  }

  result.push(current)
  return result
}

export default async function chatMoV2(messages, onChunk, onCancel, isFirst = true, temperature = 0, overFlag = "YES") {
  // 为最后两条 role 为 user 的消息添加 cache_control

  const apiKey = localStorage.getItem("mobenai.api-key")
  const apiEndPoint = "https://service-fpf07h2s-1259692580.usw.apigw.tencentcs.com/release/chat-claude-office"
  // const apiEndPoint = "https://api.anthropic.com/v1/messages"
  let _messages
  if (isFirst) {
    _messages = messages.map((msg, index) => {
      if (msg.role === "system") {
        return msg
      } else {
        return {
          role: msg.role,
          content: [
            {
              type: "text",
              text: msg.content,
            },
            ...msg.images.map((image) => {
              return {
                type: "image",
                source: {
                  type: "base64",
                  media_type: image.split(";base64,")[0].split(":")[1],
                  data: image.split(";base64,")[1],
                },
              }
            }),
          ],
        }
      }
    })
    console.log("xxxxx", _messages, messages)
    systemMsg = _messages.shift()
    const userMessages = _messages.filter((msg) => msg.role === "user")
    // if (userMessages.length >= 2) {
    //   const lastTwoUserMessages = userMessages.slice(-2)
    //   lastTwoUserMessages.forEach((msg) => {
    //     msg.content[0].cache_control = { type: "ephemeral" }
    //   })
    // }
  } else {
    _messages = mergeAdjacentRoles(messages)
  }
  const payload = {
    model: "claude-3-5-sonnet-20240620",
    system: [
      {
        type: "text",
        text: systemMsg.content,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: _messages,
    temperature,
    max_tokens: 8192,
    stream: true,
    apiKey,
  }

  let controller = new AbortController()
  fetchController.current = controller

  try {
    const response = await fetch(apiEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "prompt-caching-2024-07-31",
        // Accept: "text/event-stream",
      },
      body: jsonStringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. ${errorText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    let fullContent = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop()

      for (const line of lines) {
        if (line.trim() === "") continue
        if (!line.startsWith("data:")) continue

        const data = line.slice(5).trim()

        try {
          const parsed = jsonParse(data)
          if (parsed.type === "content_block_delta" && parsed.delta.type === "text_delta") {
            const content = parsed.delta.text
            fullContent += content
            onChunk(content)
          } else if (parsed.type === "message_delta" && parsed.delta.stop_reason === "end_turn") {
            // 消息结束
            localDB.setItem("chat-chunk-over", overFlag)
            return
          } else if (parsed.type === "message_delta" && parsed.delta.stop_reason === "max_tokens") {
            // 如果停止原因是 max_tokens，则继续调用
            const lastTenChars = fullContent.slice(-10)
            // fullContent = fullContent.slice(0, -10)
            await chatMoV2(
              _messages.concat([
                { role: "assistant", content: fullContent },
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: `继续生成，以"""${lastTenChars}"""开头，但是不包含"""${lastTenChars}"""，开头和结尾都不要解释和说明`,
                      // text: "继续生成,开头和结尾都不要解释和说明",
                    },
                  ],
                },
                // {
                //   role: "assistant",
                //   content: `${lastTenChars}`.trim(),
                // },
              ]),
              onChunk,
              onCancel,
              false
            )
            return // 结束当前调用
          }
        } catch (error) {
          console.error("Error parsing JSON:", error)
        }
      }
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Fetch aborted")
    } else {
      console.error("Error:", error)
      message.error(`An error occurred while fetching data: ${error.message}`)
      if (error.message.includes("context_length_exceeded")) {
        onChunk(`项目大小超过了最大上下文，无法使用自动检索模式，请切换到手动检索模式，手动勾选需要修改的文件`)
      }
    }
    throw error
  }
}
