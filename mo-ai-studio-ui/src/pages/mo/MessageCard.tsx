import React, { useEffect, useState, useCallback, useRef, useTransition } from "react"
import { Button, Tooltip, Badge, Avatar, Link, Image, Spinner } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { useClipboard } from "@nextui-org/use-clipboard"
import { cn } from "@/theme/cn"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTranslation } from "react-i18next"

type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
  avatar?: string
  showFeedback?: boolean
  message?: string
  currentAttempt?: number
  status?: "success" | "failed" | "streaming" | "loading"
  attempts?: number
  messageClassName?: string
  onAttemptChange?: (attempt: number) => void
  onMessageCopy?: (content: string) => void
  onFeedback?: (feedback: "like" | "dislike") => void
  onAttemptFeedback?: (feedback: "like" | "dislike" | "same") => void
  images?: string[]
  role?: "user" | "assistant"
  onDeleteMessage?: () => void
}

const MessageCard = React.memo(
  React.forwardRef<HTMLDivElement, MessageCardProps>(
    (
      {
        avatar,
        message,
        showFeedback,
        attempts = 1,
        currentAttempt = 1,
        status,
        onMessageCopy,
        onAttemptChange,
        onFeedback,
        onAttemptFeedback,
        className,
        messageClassName,
        images,
        role,
        onDeleteMessage,
        ...props
      },
      ref
    ) => {
      const { t } = useTranslation()
      const [feedback, setFeedback] = useState<"like" | "dislike">()
      const [attemptFeedback, setAttemptFeedback] = useState<"like" | "dislike" | "same">()
      const [displayedMessage, setDisplayedMessage] = useState(message)
      const [isLoading, setIsLoading] = useState(role === "user" ? false : true)
      const [isPending, startTransition] = useTransition()

      const messageRef = useRef<HTMLDivElement>(null)

      const { copied, copy } = useClipboard()

      useEffect(() => {
        setDisplayedMessage(message)
      }, [message?.length])

      const failedMessageClassName =
        status === "failed" ? "bg-danger-100/50 border border-danger-100 text-foreground" : ""
      const failedMessage = (
        <p>
          {t("chat_error_message")}
          <Link href='mailto:info@mobenai.com.cn' size='sm'>
            info@mobenai.com.cn
          </Link>
        </p>
      )

      const hasFailed = status === "failed"

      useEffect(() => {
        if (status === "loading") {
          setIsLoading(true)
        }
        if (status === "streaming") {
          setIsLoading(false)
        }
        if (status === "failed") {
          setIsLoading(false)
        }
      }, [status])

      const handleCopy = useCallback(() => {
        startTransition(() => {
          const valueToCopy = displayedMessage || messageRef.current?.textContent || ""
          copy(valueToCopy)
          onMessageCopy?.(valueToCopy)
        })
      }, [copy, displayedMessage, onMessageCopy])

      const handleAttemptFeedback = useCallback(
        (feedback: "like" | "dislike" | "same") => {
          setAttemptFeedback(feedback)
          onAttemptFeedback?.(feedback)
        },
        [onAttemptFeedback]
      )

      const renderContent = () => {
        if (hasFailed) {
          return failedMessage
        }
        if (isLoading || isPending) {
          return (
            <div className='flex items-center'>
              <Spinner size='sm' className='mr-2' />
              {t("thinking")}
            </div>
          )
        }
        return (
          <div className='markdown-body'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, "")}
                      style={{
                        ...oneDark,
                        fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        padding: "1em",
                        borderRadius: "4px",
                      }}
                      language={match[1]}
                      PreTag='div'
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {displayedMessage || ""}
            </ReactMarkdown>
          </div>
        )
      }

      return (
        <div {...props} ref={ref} className={cn("flex gap-3", className)}>
          <div className='relative flex-none'>
            <Badge
              isOneChar
              color='danger'
              content={<Icon className='text-background' icon='gravity-ui:circle-exclamation-fill' />}
              isInvisible={!hasFailed}
              placement='bottom-right'
              shape='circle'
            >
              <Avatar src={avatar} />
            </Badge>
          </div>
          <div className='flex w-full flex-col gap-4'>
            <div
              className={cn(
                "relative w-full rounded-medium bg-content2 px-4 py-3 text-default-600",
                failedMessageClassName,
                messageClassName
              )}
            >
              {images && images.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-2'>
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={t("uploaded_image_cover")}
                      className='max-w-[100px] max-h-[100px] object-cover rounded'
                    />
                  ))}
                </div>
              )}
              <div ref={messageRef} className={"pr-20 text-small markdown-body"}>
                {renderContent()}
              </div>
              {showFeedback && !hasFailed && !isLoading && (
                <div className='absolute right-2 top-2 flex rounded-full bg-content2 shadow-small'>
                  <Button isIconOnly radius='full' size='sm' variant='light' onPress={handleCopy}>
                    {copied ? (
                      <Icon className='text-lg text-default-600' icon='gravity-ui:check' />
                    ) : (
                      <Icon className='text-lg text-default-600' icon='gravity-ui:copy' />
                    )}
                  </Button>
                  <Button isIconOnly radius='full' size='sm' variant='light' onPress={onDeleteMessage}>
                    <Icon className='text-lg text-default-600' icon='mdi:delete' />
                  </Button>
                </div>
              )}
              {attempts > 1 && !hasFailed && !isLoading && (
                <div className='flex w-full items-center justify-end'>
                  <button onClick={() => onAttemptChange?.(currentAttempt > 1 ? currentAttempt - 1 : 1)}>
                    <Icon
                      className='cursor-pointer text-default-400 hover:text-default-500'
                      icon='gravity-ui:circle-arrow-left'
                    />
                  </button>
                  <button onClick={() => onAttemptChange?.(currentAttempt < attempts ? currentAttempt + 1 : attempts)}>
                    <Icon
                      className='cursor-pointer text-default-400 hover:text-default-500'
                      icon='gravity-ui:circle-arrow-right'
                    />
                  </button>
                  <p className='px-1 text-tiny font-medium text-default-500'>
                    {currentAttempt}/{attempts}
                  </p>
                </div>
              )}
            </div>
            {showFeedback && attempts > 1 && !isLoading && (
              <div className='flex items-center justify-between rounded-medium border-small border-default-100 px-4 py-3 shadow-small'>
                <p className='text-small text-default-600'>{t("is_this_answer_better_or_worse")}</p>
                <div className='flex gap-1'>
                  <Tooltip content={t("better")}>
                    <Button
                      isIconOnly
                      radius='full'
                      size='sm'
                      variant='light'
                      onPress={() => handleAttemptFeedback("like")}
                    >
                      {attemptFeedback === "like" ? (
                        <Icon className='text-lg text-primary' icon='gravity-ui:thumbs-up-fill' />
                      ) : (
                        <Icon className='text-lg text-default-600' icon='gravity-ui:thumbs-up' />
                      )}
                    </Button>
                  </Tooltip>
                  <Tooltip content={t("worse")}>
                    <Button
                      isIconOnly
                      radius='full'
                      size='sm'
                      variant='light'
                      onPress={() => handleAttemptFeedback("dislike")}
                    >
                      {attemptFeedback === "dislike" ? (
                        <Icon className='text-lg text-default-600' icon='gravity-ui:thumbs-down-fill' />
                      ) : (
                        <Icon className='text-lg text-default-600' icon='gravity-ui:thumbs-down' />
                      )}
                    </Button>
                  </Tooltip>
                  <Tooltip content={t("same")}>
                    <Button
                      isIconOnly
                      radius='full'
                      size='sm'
                      variant='light'
                      onPress={() => handleAttemptFeedback("same")}
                    >
                      {attemptFeedback === "same" ? (
                        <Icon className='text-lg text-danger' icon='gravity-ui:face-sad' />
                      ) : (
                        <Icon className='text-lg text-default-600' icon='gravity-ui:face-sad' />
                      )}
                    </Button>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
  )
)

MessageCard.displayName = "MessageCard"

export default MessageCard
