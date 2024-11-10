import React, { useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react"
import { releaseApp } from "@/service/api"
import { message } from "./Message"

interface ReleaseAppModalProps {
  app: {
    id: string
    name: string
  }
  onRelease: () => void
}

const ReleaseAppModal: React.FC<ReleaseAppModalProps> = ({ isOpen, onOpenChange, app, onRelease }) => {
  const [versionNumber, setVersionNumber] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRelease = async () => {
    if (!versionNumber || !description) {
      // 可以添加错误提示
      message.error("请填写版本号和描述")
      return
    }

    setIsLoading(true)
    try {
      await releaseApp({
        appId: app.id,
        versionNumber,
        description,
      })
      onRelease()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to release app:", error)
      // 可以添加错误提示
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>发布应用: {app.name}</ModalHeader>
              <ModalBody>
                <Input
                  label='版本号'
                  placeholder='请输入版本号'
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                />
                <Input
                  label='描述'
                  placeholder='请输入版本描述'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  取消
                </Button>
                <Button color='primary' onPress={handleRelease} isLoading={isLoading}>
                  发布
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ReleaseAppModal
