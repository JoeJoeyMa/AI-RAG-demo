import React from "react"
import { Card, ScrollShadow } from "@nextui-org/react"
import { useTranslation } from "react-i18next"

interface CommandSuggestionsProps {
  commands: string[]
  onSelectCommand: (command: string) => void
}

const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({ commands, onSelectCommand }) => {
  const { t } = useTranslation()

  return (
    <Card className="absolute z-10 mt-1 w-full max-h-40">
      <ScrollShadow className="max-h-40">
        <ul className="py-1">
          {commands.map((command, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectCommand(command)}
            >
              {t(command)}
            </li>
          ))}
        </ul>
      </ScrollShadow>
    </Card>
  )
}

export default CommandSuggestions