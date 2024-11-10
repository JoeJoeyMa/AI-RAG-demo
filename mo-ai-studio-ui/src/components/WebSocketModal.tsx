import React, { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"
import { message } from "@/components/Message"

export default function WebSocketModal({ isOpen, onClose, sendMessage }) {
  const [selectedDirectory, setSelectedDirectory] = useState("")

  const handleDirectorySelect = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker()
      const directoryPath = directoryHandle.name
      setSelectedDirectory(directoryPath)
      message.success(`已选择目录: ${directoryPath}`)
    } catch (error) {
      console.error("选择目录失败:", error)
    }
  }

  const handleConfirmDirectory = () => {
    if (!selectedDirectory) {
      message.error("请先选择一个目录")
      return
    }

    // 发送选择的目录到 wsServer
    sendMessage(
      JSON.stringify({
        action: "setProjectDirectory",
        directory: selectedDirectory,
      })
    )

    message.success(`已确认选择目录: ${selectedDirectory}`)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='md'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>选择应用目录</ModalHeader>
            <ModalBody>
              <Input label='选择的目录' placeholder='点击下方按钮选择目录' value={selectedDirectory} readOnly />
              <Button onClick={handleDirectorySelect} color='primary'>
                选择目录
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                取消
              </Button>
              <Button color='primary' onPress={handleConfirmDirectory} disabled={!selectedDirectory}>
                确认
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
