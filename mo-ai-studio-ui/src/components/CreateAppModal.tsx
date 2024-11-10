import React, { useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react"
import { PlusIcon } from "lucide-react"
import { createApp } from "@/service/api"

interface CreateAppModalProps {
  projectId: string
  onAppCreated: () => void
}

export default function CreateAppModal({ projectId, onAppCreated }: CreateAppModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    appCode: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    appCode: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    // Clear error when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { name: "", description: "", appCode: "" }

    if (!formData.name.trim()) {
      newErrors.name = "应用名称不能为空"
      isValid = false
    }

    if (!formData.appCode.trim()) {
      newErrors.appCode = "应用编码不能为空"
      isValid = false
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.appCode)) {
      newErrors.appCode = "应用编码只能包含字母、数字、下划线和连字符"
      isValid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = "应用描述不能为空"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await createApp({ ...formData, projectId })
        onAppCreated()
        onOpenChange(false)
        setFormData({ name: "", description: "", appCode: "" })
      } catch (error) {
        console.error("Failed to create app:", error)
      }
    }
  }

  return (
    <>
      <Button onPress={onOpen} color='primary' endContent={<PlusIcon size={16} />}>
        新建应用
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>创建新应用</ModalHeader>
              <ModalBody>
                <Input
                  label='应用名称'
                  placeholder='输入应用名称'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                />
                <Input
                  label='应用编码'
                  placeholder='输入应用编码'
                  name='appCode'
                  value={formData.appCode}
                  onChange={handleInputChange}
                  isInvalid={!!errors.appCode}
                  errorMessage={errors.appCode}
                />
                <Textarea
                  label='应用描述'
                  placeholder='输入应用描述'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  取消
                </Button>
                <Button color='primary' onPress={handleSubmit}>
                  创建
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
