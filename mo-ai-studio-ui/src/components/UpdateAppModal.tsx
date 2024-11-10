import React, { useEffect } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"
import { updateApps } from "@/service/api"

export default function UpdateAppModal({ app, onUpdate, isOpen, onOpenChange }) {
  const [formData, setFormData] = React.useState({})
  useEffect(() => {
    setFormData({
      id: app.id,
      name: app.name,
      description: app.description,
      icon: app.icon,
      developer: app.developer,
      latestVersion: app.latestVersion,
      currentDeployVersion: app.currentDeployVersion,
    })
  }, [app])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      await updateApps(formData)
      onUpdate()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update app:", error)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>更新 {formData.name} 的应用信息</ModalHeader>
            <ModalBody>
              <Input
                label='名称'
                placeholder='输入应用名称'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input
                label='描述'
                placeholder='输入应用描述'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
              />
              <Input
                label='图标'
                placeholder='输入图标URL'
                name='icon'
                value={formData.icon}
                onChange={handleInputChange}
              />
              <Input
                label='开发者'
                placeholder='输入开发者信息'
                name='developer'
                value={formData.developer}
                onChange={handleInputChange}
              />
              <Input
                label='最新版本'
                placeholder='输入最新版本号'
                name='latestVersion'
                value={formData.latestVersion}
                onChange={handleInputChange}
              />
              <Input
                label='当前部署版本'
                placeholder='输入当前部署版本号'
                name='currentDeployVersion'
                value={formData.currentDeployVersion}
                onChange={handleInputChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='flat' onPress={onClose}>
                取消
              </Button>
              <Button color='primary' onPress={handleSubmit}>
                更新
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
