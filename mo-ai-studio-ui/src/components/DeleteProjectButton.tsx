import React from "react"
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react"
import { DeleteIcon } from "@/Icons/DeleteIcon"
import { deleteProject } from "@/service/api"

interface DeleteProjectButtonProps {
  project: {
    id: string
    name: string
  }
  onDelete: () => void
}

const DeleteProjectButton: React.FC<DeleteProjectButtonProps> = ({ project, onDelete }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDelete = async () => {
    try {
      await deleteProject(project.id)
      onClose()
      onDelete()
    } catch (error) {
      console.error("删除项目失败", error)
    }
  }

  return (
    <>
      <Tooltip color='danger' content='删除项目'>
        <span className='text-lg text-danger cursor-pointer active:opacity-50' onClick={onOpen}>
          <DeleteIcon />
        </span>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>删除项目</ModalHeader>
          <ModalBody>
            <p>确定要删除项目 "{project.name}" 吗？此操作不可撤销。</p>
          </ModalBody>
          <ModalFooter>
            <Button color='default' variant='light' onPress={onClose}>
              取消
            </Button>
            <Button color='danger' onPress={handleDelete}>
              删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteProjectButton
