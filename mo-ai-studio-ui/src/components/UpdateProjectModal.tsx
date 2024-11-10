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
import { updateProject } from "@/service/api"

interface UpdateProjectModalProps {
  project: {
    id: string
    name: string
    description: string
  }
  onUpdate: () => void
  children: React.ReactNode
}

const UpdateProjectModal: React.FC<UpdateProjectModalProps> = ({ project, onUpdate, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [updateProjectData, setUpdateProjectData] = useState({ name: project.name, description: project.description })

  const handleUpdateProject = async () => {
    try {
      await updateProject({ id: project.id, ...updateProjectData })
      onClose()
      onUpdate()
    } catch (error) {
      console.error("更新项目失败", error)
    }
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>更新信息</ModalHeader>
          <ModalBody>
            <Input
              label='项目名称'
              placeholder='输入项目名称'
              value={updateProjectData.name}
              onChange={(e) => setUpdateProjectData({ ...updateProjectData, name: e.target.value })}
            />
            <Input
              label='项目描述'
              placeholder='输入项目描述'
              value={updateProjectData.description}
              onChange={(e) => setUpdateProjectData({ ...updateProjectData, description: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onClose}>
              取消
            </Button>
            <Button color='primary' onPress={handleUpdateProject}>
              更新
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateProjectModal
