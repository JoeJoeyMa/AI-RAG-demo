import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, Card, CardBody, useDisclosure } from "@nextui-org/react"
import { jsonStringify } from "@/utils"

interface ViewProjectModalProps {
  project: Record<string, any>
  children: React.ReactNode
}

const ViewProjectModal: React.FC<ViewProjectModalProps> = ({ project, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const columns = [
    { name: "名称", uid: "name" },
    { name: "描述", uid: "description" },
    { name: "企业名称", uid: "organizationName" },
  ]

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalContent>
          <ModalHeader>{project.name} 项目详情</ModalHeader>
          <ModalBody>
            <Card>
              <CardBody>
                {Object.entries(project).map(([key, value]) => {
                  const title = columns.find((c) => c.uid === key)?.name
                  return (
                    value && (
                      <div key={key} className='mb-2'>
                        <span className='font-bold'>{title || key}: </span>
                        <span>{jsonStringify(value)}</span>
                      </div>
                    )
                  )
                })}
              </CardBody>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ViewProjectModal
