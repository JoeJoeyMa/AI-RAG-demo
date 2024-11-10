import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Textarea, Listbox, ListboxItem } from "@nextui-org/react"
import { cn } from "@/theme/cn"
import { useTranslation } from "react-i18next"
import { localDB } from "@/utils/localDB"

export const promptValue = {
  current: "",
}

const PromptInput = forwardRef<{ clearInput: () => void }, React.ComponentProps<typeof Textarea>>(
  ({ classNames = {}, ...props }, ref) => {
    const { t } = useTranslation()
    const [value, setValue] = useState("")
    const [showCommands, setShowCommands] = useState(false)
    const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 })
    const [commands, setCommands] = useState([])
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const listboxRef = useRef<HTMLUListElement>(null)

    useImperativeHandle(ref, () => ({
      clearInput: () => {
        setValue("")
        promptValue.current = ""
      },
    }))

    useEffect(() => {
      const loadCommands = () => {
        const currentRoleCommands = localDB.getItem("currentRoleCommands") || []
        setCommands(currentRoleCommands)
      }

      loadCommands()

      const dispose = localDB.watchKey("currentRoleCommands", ({ value }) => {
        setCommands(value || [])
      })

      return () => {
        dispose()
      }
    }, [])

    const valueHandle = (newValue) => {
      promptValue.current = newValue
      setValue(newValue)

      const lastChar = newValue.slice(-1)
      if (lastChar === "@") {
        const textarea = textareaRef.current
        if (textarea) {
          const { selectionStart, selectionEnd } = textarea
          const textBeforeCursor = newValue.slice(0, selectionStart)
          const lines = textBeforeCursor.split("\n")
          const currentLineNumber = lines.length - 1
          const currentLineStart = textBeforeCursor.lastIndexOf("\n") + 1
          const left = (selectionStart - currentLineStart) * 8 // 假设每个字符宽度为 8px
          const top = currentLineNumber * 20 // 假设每行高度为 20px

          setCursorPosition({ top, left })
          setShowCommands(true)
        }
      } else {
        setShowCommands(false)
      }
    }

    useEffect(() => {
      if (props.clear) {
        setValue("")
      }
    }, [props.clear])

    useEffect(() => {
      if (showCommands && listboxRef.current) {
        console.log(listboxRef.current.focus)
        listboxRef.current.focus()
      }
    }, [showCommands])

    const handleCommandSelect = (commandKey: string) => {
      const selectedCommand = commands.find((cmd) => cmd.key === commandKey)
      if (selectedCommand) {
        const commandText = `${selectedCommand.name} `
        const newValue = value.slice(0, -1) + commandText
        valueHandle(newValue)
      }
      setShowCommands(false)
    }

    return (
      <div className='relative w-full'>
        <Textarea
          value={value}
          ref={(el) => {
            if (typeof ref === "function") {
              ref(el)
            } else if (ref) {
              ref.current = el
            }
            textareaRef.current = el
          }}
          aria-label={t("prompt")}
          className='min-h-[40px]'
          classNames={{
            ...classNames,
            label: cn("hidden", classNames?.label),
            input: cn("py-0", classNames?.input),
          }}
          minRows={2}
          placeholder={t("enter_prompt")}
          radius='lg'
          variant='bordered'
          onValueChange={valueHandle}
          {...props}
        />
        {showCommands && commands.length > 0 && (
          <Listbox
            autoFocus
            aria-label='Command suggestions'
            className='absolute max-w-28 rounded-lg bg-slate-900 shadow-lg z-10'
            style={{ top: `${cursorPosition.top + 40}px`, left: `${cursorPosition.left + 40}px` }}
            onAction={(key) => handleCommandSelect(key as string)}
          >
            {commands.map((command) => (
              <ListboxItem key={command.key} className='px-4 py-2 cursor-pointer'>
                {command.name}
              </ListboxItem>
            ))}
          </Listbox>
        )}
      </div>
    )
  }
)

PromptInput.displayName = "PromptInput"

export default PromptInput