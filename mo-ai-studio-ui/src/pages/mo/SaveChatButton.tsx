import React from "react"
import { Button, Tooltip } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { localDB } from "@/utils/localDB"
import { message } from "@/components/Message"
import { defaultRoleCards } from "./defaultRoleCards"
import { RoleCard } from "./types"
import { useTranslation } from "react-i18next"

interface SaveChatButtonProps {
  messages: any[]
}

const SaveChatButton: React.FC<SaveChatButtonProps> = ({ isLoading, messages }) => {
  const { t } = useTranslation()

  const handleSaveChat = () => {
    try {
      if (messages && messages.length > 0) {
        console.log(messages)
        const chatHistories = localDB.getItem("chatHistories") || []

        // 获取当前选择的智能体卡片 ID
        const selectedRoleCardId = localDB.getItem("selectedRoleCardId")

        // 获取所有智能体卡片
        const userRoleCards: RoleCard[] = localDB.getItem("roleCards") || []
        const allRoleCards = [...defaultRoleCards, ...userRoleCards]

        // 查找当前选择的智能体卡片
        const selectedRoleCard = allRoleCards.find((card) => card.id === selectedRoleCardId)

        const newChatHistory = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          messages: messages,
          roleCard: selectedRoleCard
            ? {
                id: selectedRoleCard.id,
                name: selectedRoleCard.name,
                isDefault: selectedRoleCard.isDefault,
              }
            : null,
        }
        chatHistories.push(newChatHistory)
        localDB.setItem("chatHistories", chatHistories)
        message.success(t("chat_history_saved"))
      } else {
        message.info(t("no_chat_history"))
      }
    } catch (error) {
      console.error(t("save_chat_failed"), error)
      message.error(t("save_chat_failed"))
    }
  }

  return (
    <Tooltip content={t("save_chat_history")}>
      <Button
        size='sm'
        isDisabled={isLoading}
        color='success'
        variant='flat'
        onPress={handleSaveChat}
        aria-label={t("save_chat_history")}
        startContent={<Icon icon='mdi:content-save' width={20} />}
      >
        保存聊天记录
      </Button>
    </Tooltip>
  )
}

export default SaveChatButton
