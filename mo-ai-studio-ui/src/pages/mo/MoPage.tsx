import React, { useRef, useState, useCallback, useEffect } from "react"
import { Button, Tooltip, Image, Badge, ScrollShadow, Modal, ModalContent } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { cn } from "@/theme/cn"
import ToolBar from "./MoToolBar"
import mo2 from "../../../public/assets/mo-2.png"
import user from "../../../public/assets/user.png"
import PromptInput, { promptValue } from "./PromptInput"
import MessageCard from "./MessageCard"
import { chatRole } from "@/service/chat"
import { localDB } from "@/utils/localDB"
import { message } from "@/components/Message"
import { fetchController } from "@/utils"
import { defaultRoleCards } from "./defaultRoleCards"
import { outputProcessors } from "./outputProcessors"
import SaveChatButton from "./SaveChatButton"
import ScreenShareButton from "./ScreenShareButton"
import { useTranslation } from "react-i18next"
import LoadingPage from "../LoadingPage"
import LoginModal from "@/components/LoginModal"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { modelConfig } from "./DevChatModelConfig"
import CurrentRoleSettingsModal from "./CurrentRoleSettingsModal"

const MIN_MESSAGE_LENGTH = 5 // 设置一个最小消息长度阈值

// 类型定义
type Message = {
  id: string
  role: "user" | "assistant"
  message: string
  status?: "success" | "failed" | "streaming" | "loading"
  images?: string[]
}

const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export default function MoPage() {
  const { t } = useTranslation()
  // 状态管理
  const [clear, setClear] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [ResultComponent, setResultComponent] = useState(() => null)
  const [resultProps, setResultProps] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRoleSettingsOpen, setIsRoleSettingsOpen] = useState(false)
  const [resultPanelSize, setResultPanelSize] = useState(0)

  // Refs
  const messagesRef = useRef<Message[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<string[]>([])
  const messageBuffer = useRef<Message[]>([])
  const promptInputRef = useRef<any>(null)

  useEffect(() => {
    messagesRef.current = []
    const dispose = setupChatChunkOverWatcher()
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 3500)
    return () => {
      dispose()
      clearTimeout(timer)
    }
  }, [])

  // 滚动到底部
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom()
    })
  }, [messages.length])

  // 设置聊天块结束监听器
  const setupChatChunkOverWatcher = () => {
    return localDB.watchKey("chat-chunk-over", async ({ value }) => {
      if (value === "YES") {
        setIsLoading(false)
        const message = messagesRef.current[messagesRef.current.length - 1]?.message
        console.log(message)
        await processOutput(message)
      }
    })
  }

  // 处理输出
  const processOutput = async (message: string) => {
    const selectedRoleCardId = localDB.getItem("selectedRoleCardId")
    const roleCards = localDB.getItem("roleCards") || []
    const target =
      roleCards.find((card) => card.id === selectedRoleCardId) ||
      defaultRoleCards.find((card) => card.id === selectedRoleCardId)

    if (target) {
      const outputProcessor = outputProcessors[target.outputProcessor]
      if (outputProcessor) {
        if (outputProcessor.resultComponent) {
          setResultComponent(() => null)
          setResultComponent(() => outputProcessor.resultComponent)
          setResultPanelSize(50) // 设置结果面板大小为 50
        }
        const onChunk = (chunk) => {
          setResultProps((prevChunk) => {
            if (prevChunk) {
              return (prevChunk += chunk)
            } else {
              return chunk
            }
          })
        }
        const result = await outputProcessor.process(message, onChunk)
        console.log(result)
        if (result) {
          setResultPanelSize(50) // 如果有结果，设置结果面板大小为 50
        }
      }
    }
  }

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const updateMessages = (updater: (prevMessages: Message[]) => Message[]) => {
    const newMessages = updater(messagesRef.current)
    messagesRef.current = newMessages

    // 将新消息添加到缓冲区
    messageBuffer.current = messageBuffer.current.concat(newMessages.slice(messagesRef.current.length - 1))

    // 如果缓冲区长度达到或超过阈值，更新状态并清空缓冲区
    if (messageBuffer.current.length >= MIN_MESSAGE_LENGTH) {
      setMessages([...messagesRef.current])
      messageBuffer.current = []
    }
  }

  // 处理发送消息
  const handleSendMessage = async () => {
    const selectedRoleCardId = localDB.getItem("selectedRoleCardId")
    if (!selectedRoleCardId) {
      message.error(t("please_select_role"))
      return
    }
    // 检查是否有文本输入或图片
    console.log(isLoading)
    if (!promptValue.current.trim() && !isLoading) {
      message.error(t("please_enter_message"))
      return
    }
    const roleCards = localDB.getItem("roleCards") || []
    const selectedRole =
      roleCards.find((card) => card.id === selectedRoleCardId) ||
      defaultRoleCards.find((card) => card.id === selectedRoleCardId)

    if (!selectedRole) {
      message.error(t("selected_role_not_found"))
      return
    }

    const baseModel = selectedRole.baseModel
    const apiKeyName = modelConfig.models[baseModel]?.apiKeyName

    if (!apiKeyName) {
      message.error(t("base_model_not_configured"))
      return
    }

    const apiKeys = localDB.getItem("apiKeys") || {}
    const apiKey = apiKeys[apiKeyName]

    if (!apiKey) {
      message.error(t("api_key_not_configured", { model: baseModel }))
      return
    }

    if (promptValue.current.trim() || imagesRef.current.length > 0) {
      setClear(true)

      const userMessage: Message = {
        id: generateUniqueId(),
        role: "user",
        message: promptValue.current,
        status: "success",
        images: imagesRef.current,
      }
      console.log("userMessage", userMessage)
      updateMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        {
          id: generateUniqueId(),
          role: "assistant",
          message: "",
          status: "loading",
        },
      ])
      forceUpdateMessages()
      setIsLoading(true)
      console.log("messageRef.current", messagesRef.current)
      try {
        await chatRole(
          messagesRef.current,
          promptValue.current,
          localDB.getItem("selectedRoleCardId"),
          handleChunk,
          handleCancel
        )
        finalizeAssistantMessage()
      } catch (error) {
        console.error("Error in chat:", error)
        handleChatError()
      }

      setImages([])
      imagesRef.current = []
      promptInputRef.current?.clearInput()
    }
  }

  // 处理消息块
  const handleChunk = async (chunk: string) => {
    updateMessages((prevMessages) => {
      const newMessages = [...prevMessages]
      const lastMessage = newMessages[newMessages.length - 1]
      if (lastMessage.role === "assistant") {
        lastMessage.message += chunk
        lastMessage.status = "streaming"
      } else {
        newMessages.push({ id: generateUniqueId(), role: "assistant", message: chunk, status: "streaming" })
      }
      return newMessages
    })
  }

  // 处理取消
  const handleCancel = () => {
    finalizeAssistantMessage()
  }
  const forceUpdateMessages = () => {
    if (messageBuffer.current.length > 0) {
      setMessages([...messagesRef.current])
      messageBuffer.current = []
    }
  }
  // 完成助手消息
  const finalizeAssistantMessage = () => {
    updateMessages((prevMessages) => {
      const newMessages = [...prevMessages]
      const lastMessage = newMessages[newMessages.length - 1]
      if (lastMessage.role === "assistant") {
        lastMessage.status = "success"
      }
      return newMessages
    })
    forceUpdateMessages() // 强制更新消息
  }

  // 处理聊天错误
  const handleChatError = () => {
    // updateMessages((prevMessages) => [
    //   ...prevMessages,
    //   {
    //     role: "assistant",
    //     message: t("chat_error_message"),
    //     status: "failed",
    //   },
    // ])
    setIsLoading(false)
  }

  // 处理停止消息
  const handleStopMessage = () => {
    setIsLoading(false)
    fetchController.current.abort()
  }

  // 处理屏幕源选择
  const handleScreenSourceSelect = async (sourceId: string) => {
    try {
      const screenshot = await window.electronAPI.screenShare.captureScreenshot(sourceId)
      if (typeof screenshot === "string") {
        setImages((prev) => {
          const newImages = [...prev, screenshot]
          imagesRef.current = newImages
          return newImages
        })
      } else {
        message.error(t("screenshot_failed_format"))
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error)
      message.error(t("screenshot_failed", { error: error.message || t("unknown_error") }))
    }
  }

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataURL = e.target?.result as string
          setImages((prev) => {
            const newImages = [...prev, dataURL]
            imagesRef.current = newImages
            return newImages
          })
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // 触发文件输入
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // 移除图片
  const onRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index)
      imagesRef.current = newImages
      return newImages
    })
  }

  // 处理粘贴事件
  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile()
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataURL = e.target?.result as string
          setImages((prev) => {
            const newImages = [...prev, dataURL]
            imagesRef.current = newImages
            return newImages
          })
        }
        reader.readAsDataURL(blob)
      }
    }
  }

  // 处理键盘事件
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  // 清空聊天记录
  const clearMessages = () => {
    setMessages([])
    messagesRef.current = []
  }

  // 处理删除消息
  const handleDeleteMessage = (messageId: string) => {
    updateMessages((prevMessages) => {
      const newMessages = prevMessages.filter((msg) => msg.id !== messageId)
      return newMessages
    })
    forceUpdateMessages()
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
  }

  const handleOpenRoleSettings = () => {
    setIsRoleSettingsOpen(true)
  }

  const handleCloseRoleSettings = () => {
    setIsRoleSettingsOpen(false)
  }

  if (!isReady) {
    return <LoadingPage />
  }
  return (
    <div className='flex items-center justify-center w-screen h-screen overflow-hidden'>
      <div className='flex h-screen w-full max-w-full flex-col gap-8 p-3'>
        <div className='flex w-full flex-wrap items-center justify-center gap-2 border-b-small border-divider pb-2 sm:justify-between'>
          <ToolBar onOpenRoleSettings={handleOpenRoleSettings}></ToolBar>
        </div>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel defaultSize={100} className='flex flex-col'>
            <ScrollShadow className='flex flex-grow flex-col'>
              <div className='flex flex-col gap-4 px-1'>
                {messages.map(({ id, role, message, status, images }) => (
                  <MessageCard
                    key={id}
                    attempts={1}
                    avatar={role === "assistant" ? mo2 : user}
                    currentAttempt={1}
                    message={message}
                    messageClassName={role === "user" ? "bg-content3 text-content3-foreground" : ""}
                    showFeedback={role === "assistant" && status === "success"}
                    status={status}
                    images={images}
                    role={role}
                    onDeleteMessage={() => handleDeleteMessage(id)}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollShadow>
            <div className='flex flex-col gap-2'>
              <div className='flex w-full flex-col gap-4'>
                <form className='flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70'>
                  <div className='group flex gap-2 px-4 pt-4 min-h-2'>
                    {images.map((image, index) => (
                      <Badge
                        key={index}
                        isOneChar
                        className='opacity-0 group-hover:opacity-100'
                        content={
                          <Button
                            isIconOnly
                            radius='full'
                            size='sm'
                            variant='light'
                            onPress={() => onRemoveImage(index)}
                          >
                            <Icon className='text-foreground' icon='iconamoon:close-thin' width={16} />
                          </Button>
                        }
                      >
                        <Image
                          alt={t("uploaded_image_cover")}
                          className='h-14 w-14 rounded-small border-small border-default-200/50 object-cover'
                          src={image}
                        />
                      </Badge>
                    ))}
                  </div>
                  <PromptInput
                    ref={promptInputRef}
                    classNames={{
                      inputWrapper: "!bg-transparent shadow-none",
                      innerWrapper: "relative",
                      input: "pt-1 pb-6 !pr-10 text-medium min-h-32",
                    }}
                    endContent={
                      <div className='absolute right-0 flex h-full flex-col items-end justify-between gap-2'>
                        <div className='flex items-end gap-2'>
                          {isLoading ? (
                            <Tooltip showArrow content={t("stop_sending")}>
                              <Button isIconOnly radius='lg' size='sm' variant='solid' onPress={handleStopMessage}>
                                <Icon
                                  className={cn("[&>path]:stroke-[2px] text-gray-300")}
                                  icon='solar:stop-circle-bold'
                                  width={20}
                                />
                              </Button>
                            </Tooltip>
                          ) : (
                            <Tooltip content={t("send_message")}>
                              <Button
                                isIconOnly
                                color={isLoading ? "default" : "primary"}
                                radius='lg'
                                size='sm'
                                variant='solid'
                                onPress={handleSendMessage}
                              >
                                <Icon
                                  className={cn("[&>path]:stroke-[2px] text-primary-foreground")}
                                  icon='solar:arrow-up-linear'
                                  width={20}
                                />
                              </Button>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    }
                    minRows={3}
                    radius='lg'
                    startContent={
                      <Tooltip showArrow content={t("add_image")}>
                        <Button isIconOnly radius='full' size='sm' variant='light' onPress={triggerFileInput}>
                          <Icon className='text-default-500' icon='solar:gallery-minimalistic-linear' width={20} />
                        </Button>
                      </Tooltip>
                    }
                    variant='flat'
                    clear={clear}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                  />
                  <input
                    type='file'
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                    accept='image/*'
                    multiple
                  />
                  <div className='flex w-full items-center justify-between gap-2 overflow-scroll px-4 pb-4'>
                    <div className='flex w-full gap-1 md:gap-3'>
                      <ScreenShareButton isLoading={isLoading} onScreenSourceSelect={handleScreenSourceSelect} />
                      <Tooltip content={t("clear_chat_history")}>
                        <Button
                          isDisabled={isLoading}
                          size='sm'
                          startContent={<Icon className='text-default-500' icon='mdi:delete' width={18} />}
                          variant='flat'
                          onPress={clearMessages}
                        >
                          {t("clear_chat_history")}
                        </Button>
                      </Tooltip>
                      <Button size='sm' onPress={handleOpenRoleSettings} startContent={<Icon icon='mdi:tune' />}>
                        {t("current_role_settings")}
                      </Button>
                      {/* <SaveChatButton isLoading={isLoading} messages={messagesRef.current} /> */}
                    </div>
                  </div>
                </form>
              </div>
              <p className='px-2 text-tiny text-default-400'>{t("mo_disclaimer")}</p>
            </div>
            <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
              <ModalContent>
                <LoginModal onLoginSuccess={handleLoginSuccess} />
              </ModalContent>
            </Modal>
          </ResizablePanel>
          <ResizableHandle withHandle className='mx-2' />
          <ResizablePanel defaultSize={resultPanelSize}>
            <div className='flex h-full items-center justify-center'>
              {ResultComponent && <ResultComponent results={resultProps} />}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <CurrentRoleSettingsModal isOpen={isRoleSettingsOpen} onClose={handleCloseRoleSettings} />
    </div>
  )
}