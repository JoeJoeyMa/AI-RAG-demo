import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"
import { Icon } from "@iconify/react"

interface ApiKeySettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKeys: {
    openai: string
    google: string
    anthropic: string
  }
  setApiKeys: React.Dispatch<
    React.SetStateAction<{
      openai: string
      google: string
      anthropic: string
    }>
  >
  handleSaveSettings: () => void
}

const ApiKeySettingsModal: React.FC<ApiKeySettingsModalProps> = ({
  isOpen,
  onClose,
  apiKeys,
  setApiKeys,
  handleSaveSettings,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>API 设置</ModalHeader>
            <ModalBody>
              <Input
                label='OpenAI API Key'
                placeholder='输入你的 OpenAI API Key'
                value={apiKeys.openai}
                onChange={(e) => setApiKeys((prev) => ({ ...prev, openai: e.target.value }))}
                startContent={<Icon icon='simple-icons:openai' width={24} height={24} />}
              />
              <Input
                label='Google API Key'
                placeholder='输入你的 Google API Key'
                value={apiKeys.google}
                onChange={(e) => setApiKeys((prev) => ({ ...prev, google: e.target.value }))}
                startContent={<Icon icon='flat-color-icons:google' width={24} height={24} />}
              />
              <Input
                label='Anthropic API Key'
                placeholder='输入你的 Anthropic API Key'
                value={apiKeys.anthropic}
                onChange={(e) => setApiKeys((prev) => ({ ...prev, anthropic: e.target.value }))}
                startContent={<Icon icon='simple-icons:anthropic' width={24} height={24} />}
              />
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                取消
              </Button>
              <Button color='primary' onPress={handleSaveSettings}>
                保存
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ApiKeySettingsModal
