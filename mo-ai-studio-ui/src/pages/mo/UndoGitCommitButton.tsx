import React from "react"
import { Button, Tooltip } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { message } from "@/components/Message"
import { useTranslation } from "react-i18next"

const UndoGitCommitButton: React.FC = ({ isLoading }) => {
  const { t } = useTranslation()

  const handleUndoCommit = async () => {
    try {
      const result = await window.electronAPI.file.undoGitCommit()
      if (result.success) {
        message.success(t("git_commit_undone"))
      } else {
        message.error(t("git_commit_undo_failed", { error: result.error }))
      }
    } catch (error) {
      console.error("Error undoing git commit:", error)
      message.error(t("git_commit_undo_error", { error: error.message }))
    }
  }

  return (
    <Tooltip content={t("undo_git_commit")}>
      <Button
        isDisabled={isLoading}
        isIconOnly
        size='sm'
        color='warning'
        variant='flat'
        onPress={handleUndoCommit}
        aria-label={t("undo_git_commit")}
      >
        <Icon icon='mdi:undo-variant' width={20} />
      </Button>
    </Tooltip>
  )
}

export default UndoGitCommitButton
