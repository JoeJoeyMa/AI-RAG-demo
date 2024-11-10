import React, { useState } from "react"
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { spawn } from "child_process"

const DefaultValueViewer = ({ value }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <>
      {value ? (
        <>
          <Button variant='flat' size='sm' isIconOnly onPress={handleOpen}>
            <Icon icon='mdi:eye' />
          </Button>
          <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalContent>
              <ModalHeader>默认值</ModalHeader>
              <ModalBody>
                <SyntaxHighlighter language='sql' style={vscDarkPlus}>
                  {value || "无默认值"}
                </SyntaxHighlighter>
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onPress={handleClose}>
                  关闭
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Button variant='flat' isDisabled size='sm' isIconOnly onPress={handleOpen}>
          <Icon icon='mdi:eye' />
        </Button>
      )}
    </>
  )
}

export default DefaultValueViewer
