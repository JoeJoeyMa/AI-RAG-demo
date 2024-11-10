import { useState, useEffect, useCallback, useContext } from "react"
import { useSearchParams } from "react-router-dom"
import { useWebSocket } from "@/hooks/use-webSocket"
import { localDB } from "@/utils/localDB"
import { message } from "@/components/Message"
import {
  processFilesContent,
  updateSavedContext,
  convertFileStructure,
  convertArrayToObject,
  blog,
  jsonParse,
  jsonStringify,
} from "@/utils"
import { chatRole } from "@/service/chat"
import system from "@/agents/mo-2/system"
import user from "@/agents/mo-2/user"
import { extractBusinessModelInfo } from "@/utils/getModelInfo"
import { modelConfig } from "../pages/mo/DevChatModelConfig"
import _ from "lodash"
import { useManualMode } from "./useManualMode"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import axios from "axios"
import { UserContext } from "@/context/UserContext"
import { useSelectAgent } from "./useSelectAgent"

interface Message {
  id: number
  content: string
  isUser: boolean
  isLoading?: boolean
  images?: string[]
  status?: "pending" | "success" | "error"
}

interface Agent {
  id: string
  name: string
  system: string
  user: string
}

async function getWeather(city: string = "北京") {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&lang=zh_cn&units=metric`
    )
    return `${response.data.weather[0].description}，温度 ${response.data.main.temp}°C`
  } catch (error) {
    console.error("获取天气信息失败:", error)
    return "天气信息获取失败"
  }
}

async function generateWelcomeMessage(userName: string) {
  const currentTime = format(new Date(), "yyyy年MM月dd日 HH:mm", { locale: zhCN })
  const weather = await getWeather()
  return `你好，${userName}！现在是 ${currentTime}。今天的天气是：${weather}。有什么我可以帮助你的吗？`
}

export function useDevChatLogic(activeTab) {
  const [images, setImages] = useState<File[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [executionSteps, setExecutionSteps] = useState<{ status: "pending" | "success" | "error"; message: string }[]>(
    []
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isManualContext } = useManualMode()
  const [isChatPaused, setIsChatPaused] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [apiKeys, setApiKeys] = useState(
    Object.fromEntries(Object.values(modelConfig.models).map((model) => [model.apiKeyName, ""]))
  )
  const { selectAgent, selectedAgent } = useSelectAgent()

  const [searchParams] = useSearchParams()

  const roleAvatar = "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  const wsUrl = searchParams.get("wsUrl")

  const { lastMessage, readyState, sendMessage } = useWebSocket(wsUrl)
  const userInfo = useContext(UserContext)
  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = localDB.getItem("chatMessages")!
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages)
      } else {
        const welcomeMessage = await generateWelcomeMessage(userInfo?.name || "用户")
        const newMessage: Message = {
          id: Date.now(),
          content: welcomeMessage,
          isUser: false,
          status: "success",
        }
        setMessages([newMessage])
        localDB.setItem("chatMessages", jsonStringify([newMessage]))
      }
    }
    loadMessages()
    const savedApiKeys = jsonParse(localStorage.getItem("mobenai.api-keys") || "{}")
    setApiKeys((prevApiKeys) => ({
      ...prevApiKeys,
      ...savedApiKeys,
    }))

    // Load selected agent
    const savedAgent = localDB.getItem("selectedAgent")
    if (savedAgent) {
      selectAgent(savedAgent)
    }
  }, [])

  useEffect(() => {
    if (lastMessage !== null) {
      const response = jsonParse(lastMessage.data)
      if (response.success) {
        if (response.filePath) {
          setExecutionSteps((prev) => {
            const updatedSteps = prev.filter((step) => step.status !== "pending")
            return [
              ...updatedSteps,
              {
                status: "success",
                message: response.filePath ? `文件 ${response.filePath} 修改成功` : response.message,
              },
            ]
          })
        }
        if (response.directoryStructure) {
          localDB.setItem("directoryStructure", response.directoryStructure)
          updateSavedContext(response.directoryStructure)
        }
      } else {
        setExecutionSteps((prev) => {
          const updatedSteps = prev.filter(
            (step) => !(step.status === "pending" && step.message.includes(response.filePath))
          )
          return [
            ...updatedSteps,
            { status: "error", message: response.filePath ? `文件 ${response.filePath} 修改失败` : response.message },
          ]
        })
      }
    }
  }, [lastMessage])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).filter((file) => file.type.startsWith("image/"))
      setImages((prevImages) => {
        const updatedImages = [...prevImages, ...newImages]
        return updatedImages.slice(0, 10) // 限制最多10张图片
      })
    }
  }

  const onRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSendMessage = async (prompt: string) => {
    if (readyState !== WebSocket.OPEN) {
      message.error("未连接到Mo-2客户端，请检查连接")
      return
    }

    if (prompt.trim() || images.length > 0) {
      setIsLoading(true)
      setIsStreaming(true)
      const base64Images = await Promise.all(images.map(convertToBase64))
      const newUserMessage: Message = {
        id: Date.now(),
        content: prompt,
        isUser: true,
        images: base64Images,
      }
      const loadingMessage: Message = {
        id: Date.now() + 1,
        content: "",
        isUser: false,
        isLoading: true,
      }
      setMessages((prevMessages) => [...prevMessages, newUserMessage, loadingMessage])

      try {
        // 获取最新的文件内容
        sendMessage(jsonStringify({ action: "fetchLatestContent" }))
        const latestContentResponse = await new Promise((resolve) => {
          const listener = (event) => {
            const data = jsonParse(event.data)
            if (data.success && data.directoryStructure) {
              resolve(data.directoryStructure)
            }
          }
          // 添加一次性事件监听器
          const ws = new WebSocket(wsUrl!)
          ws.addEventListener("message", listener, { once: true })
        })

        let context = {}
        if (isManualContext) {
          const savedContext = localDB.getItem("savedContext")
          if (!savedContext) {
            message.error("手动检索模式下，项目中需要手动勾选文件，请先勾选你需要对话的文件")
            setIsLoading(false)
            setIsStreaming(false)
            return
          }
          // 使用 lodash 合并最新内容和 savedContext
          const sourceContext = convertFileStructure(latestContentResponse)
          const sourceContextObject = convertArrayToObject(sourceContext)
          const savedContextObject = convertArrayToObject(savedContext)
          Object.keys(savedContextObject).forEach((key) => {
            if (sourceContextObject[`/${key}`]) {
              context[key] = sourceContextObject[`/${key}`]
            } else {
              console.log(sourceContextObject)
              throw new Error(`获取最新的项目上下文错误，${`/${key}`} 文件不存在`)
            }
          })
          console.log(context)
        } else {
          const sourceContext = convertFileStructure(latestContentResponse)
          context = sourceContext
        }

        let fullContent = ""
        let currentMsgId = 0
        const updater = (content) =>
          requestAnimationFrame(() => {
            setMessages((prevMessages) => {
              const updatedMessages = prevMessages.map((msg, index) => {
                if (msg.id === currentMsgId) {
                  return {
                    ...msg,
                    content,
                  }
                } else {
                  if (msg.isLoading) {
                    currentMsgId = msg.id
                    return {
                      ...msg,
                      content,
                      isLoading: false,
                      status: "success",
                    }
                  }
                }
                return msg
              })

              return updatedMessages
            })
          })
        const onChunk = (content: string) => {
          fullContent += content
          updater(fullContent)
          return fullContent
        }

        const onCancel = (cancelFunction: () => void) => {
          if (isChatPaused) {
            cancelFunction()
          }
        }
        const modelInfo = await extractBusinessModelInfo()
        context["model-info.ts"] = jsonStringify(modelInfo, null, 2)
        const contextJSON = context ? jsonStringify(context, null, 2) : "未知项目，加载项目信息异常"
        const chatHistory = messages.map((message) => ({
          role: message.isUser ? "user" : "assistant",
          content: message.isUser
            ? [
                {
                  type: "text",
                  text: message.content,
                },
                ...(message.images?.map((img) => ({ type: "image_url", image_url: { url: img } })) || []),
              ]
            : message.content,
        }))

        // 使用选定的智能体的 system 和 user 设置
        const _user = selectedAgent?.user
          ? new Function("return " + selectedAgent.user)
          : new Function("return " + user)
        console.log(_user())
        console.log(_user()({ task: prompt, context: contextJSON }))
        const systemContent = selectedAgent ? selectedAgent.system : system
        const userContent = _user()({ task: prompt, context: contextJSON })
        let lastChatHistory = chatHistory.slice(-10)
        if (lastChatHistory[0]?.role === "assistant") {
          lastChatHistory = [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "你好",
                },
              ],
            },
            ...lastChatHistory,
          ]
        }
        await chatRole(
          [
            { role: "system", content: systemContent },
            ...lastChatHistory,
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: userContent,
                },
                ...(base64Images.map((img) => ({ type: "image_url", image_url: { url: img } })) || []),
              ],
            },
          ],
          onChunk,
          onCancel
        )

        // 在这里保存聊天记录
        const nonPendingMessages = messages.filter((msg) => !msg.isLoading && msg.status !== "pending")
        try {
          localDB.setItem("chatMessages", jsonStringify(nonPendingMessages, null, 2))
        } catch (error) {
          console.error(error)
        }

        const filesContent = processFilesContent(fullContent)
        console.log(filesContent)
        if (filesContent && filesContent.length > 0) {
          setIsModalOpen(true)
          for (const file of filesContent) {
            setExecutionSteps((prev) => [...prev, { status: "pending", message: `修改文件 ${file.path}` }])
            if (readyState === WebSocket.OPEN) {
              if (!file.path) {
                console.log(filesContent)
                throw new Error("任务中断: 文件路径为空，请检查")
              }
              sendMessage(jsonStringify({ action: "writeFile", filePath: file.path, content: file.content }))
            } else {
              throw new Error("任务中断: 项目断开连接，请检查")
            }

            await new Promise((resolve) => setTimeout(resolve, 1000))
          }

          if (readyState === WebSocket.OPEN) {
            sendMessage(jsonStringify({ action: "commitChanges", summary: "AI自动修改" }))
          }

          const allStepsCompleted = executionSteps.every((step) => step.status !== "pending")
          if (allStepsCompleted) {
            message.success("执行完成")
          } else {
            message.warning("部分步骤执行失败，请检查详细信息")
          }
        }
      } catch (error) {
        console.error("Error in agent communication:", error)
        message.error(error.message || "发送消息失败，请稍后重试")
        setMessages((prevMessages) => prevMessages.filter((msg) => !msg.isLoading && msg.status !== "pending"))
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now() + 2,
            content: error.message || "系统异常，请重试，如果还是失败，请联系技术支持",
            isUser: false,
            status: "error",
          },
        ])
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
        setImages([]) // 清除图片
        const imageInput = document.getElementById("imageInput") as HTMLInputElement
        if (imageInput) {
          imageInput.value = ""
        }
      }
    }
  }

  const handleClearChat = () => {
    setMessages([])
    localDB.removeItem("chatMessages")
    message.success("聊天记录已清空")
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handlePaste = useCallback(async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        event.preventDefault()
        const blob = items[i].getAsFile()
        if (blob) {
          setImages((prevImages) => {
            const updatedImages = [...prevImages, blob]
            return updatedImages.slice(0, 10) // 限制最多10张图片
          })
        }
      }
    }
  }, [])

  const handleRollback = () => {
    if (readyState === WebSocket.OPEN && activeTab === "browser") {
      sendMessage(jsonStringify({ action: "rollback" }))
      message.info("正在尝试回滚到上一个提交...")
    } else if (activeTab !== "browser") {
      message.warning("撤销功能仅在浏览器标签页可用")
    } else {
      message.error("无法连接到服务器，请检查连接")
    }
  }

  const toggleChatPause = () => {
    setIsChatPaused(!isChatPaused)
    message.info(isChatPaused ? "已恢复对话" : "已暂停对话")
  }

  const handleSaveSettings = () => {
    localStorage.setItem("mobenai.api-keys", jsonStringify(apiKeys))
    setIsSettingsModalOpen(false)
    message.success("设置已保存")
  }

  return {
    images,
    messages,
    isLoading,
    executionSteps,
    isModalOpen,
    isChatPaused,
    isStreaming,
    roleAvatar,
    handleImageUpload,
    onRemoveImage,
    handleSendMessage,
    handleClearChat,
    handleCloseModal,
    handlePaste,
    handleRollback,
    toggleChatPause,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    apiKeys,
    setApiKeys,
    handleSaveSettings,
    selectedAgent,
  }
}
