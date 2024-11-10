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
import { createProject } from "@/service/api"
import { PlusIcon } from "lucide-react"

interface CreateProjectModalProps {
  onCreate: () => void
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onCreate, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newProject, setNewProject] = useState({ name: "", description: "" })

  const handleCreateProject = async () => {
    try {
      await createProject(newProject)
      onClose()
      onCreate()
    } catch (error) {
      console.error("创建项目失败", error)
    }
  }

  return (
    <>
      <Button color='primary' onPress={onOpen} endContent={<PlusIcon />}>
        创建新项目
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>创建新项目</ModalHeader>
          <ModalBody>
            <Input
              label='项目名称'
              placeholder='输入项目名称'
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <Input
              label='项目描述'
              placeholder='输入项目描述'
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onClose}>
              取消
            </Button>
            <Button color='primary' onPress={handleCreateProject}>
              创建
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateProjectModal
