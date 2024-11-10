import React, { KeyboardEvent, useCallback, useState } from "react"
import { Textarea, Button, Tooltip, Spinner, Kbd } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { cn } from "@/theme/cn"
import { blog, fetchController } from "@/utils"

interface PromptInputProps {
  classNames?: {
    label?: string
    input?: string
    inputWrapper?: string
  }
  onSubmit?: (value: string) => void
  isLoading?: boolean
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void
  [key: string]: any
}

const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({ classNames = {}, onSubmit, isLoading, onPaste, ...props }, ref) => {
    const [prompt, setPrompt] = useState("")

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (!isLoading && (event.metaKey || event.ctrlKey) && event.key === "Enter") {
          event.preventDefault()
          handleSubmit()
        }
      },
      [isLoading, onSubmit, prompt]
    )

    const handleValueChange = useCallback((value: string) => {
      setPrompt(value)
    }, [])

    const handleSubmit = useCallback(() => {
      if (prompt.trim() && onSubmit) {
        onSubmit(prompt)
        setPrompt("")
      }
      if (isLoading) {
        console.log("loading")
        fetchController.current.abort()
      }
    }, [prompt, onSubmit])

    return (
      <div className='relative w-full'>
        <Textarea
          ref={ref}
          aria-label='Prompt'
          className='max-h-[120px] pt-2'
          classNames={{
            ...classNames,
            label: cn("hidden", classNames?.label),
            input: cn("py-0", classNames?.input),
            inputWrapper: cn("min-h-[80px]", classNames?.inputWrapper),
          }}
          minRows={2}
          maxRows={4}
          placeholder='您好，我是 Mo-2，需要我做什么？'
          radius='lg'
          variant='bordered'
          onKeyDown={handleKeyDown}
          onValueChange={handleValueChange}
          isDisabled={isLoading}
          value={prompt}
          onPaste={onPaste}
          {...props}
        />
        <div className='absolute bottom-3 right-3'>
          <Tooltip showArrow content={isLoading ? "停止生成" : "发送消息"}>
            <Button radius='full' size='sm' variant='light' onPress={handleSubmit}>
              {isLoading ? (
                <Icon icon='solar:stop-circle-bold-duotone' className='animate-pulse' width='24' height='24' />
              ) : (
                <>
                  <Kbd keys={["command", "enter"]}></Kbd>
                </>
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
    )
  }
)

export default React.memo(PromptInput)
