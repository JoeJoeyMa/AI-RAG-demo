import React, { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spacer } from "@nextui-org/react"
import { changePassword } from "@/service/api"

const PasswordForm = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")

  const validatePassword = (value) => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$/.test(value)) {
      return "密码必须包含大小写英文和数字"
    }
    return true
  }

  const handleSubmit = () => {
    if (oldPassword === newPassword) {
      setError("新旧密码不能相同")
      return
    }
    if (validatePassword(newPassword) !== true) {
      setError(validatePassword(newPassword))
      return
    }
    changePassword(oldPassword, newPassword)
      .then(() => {
        onClose()
        setOldPassword("")
        setNewPassword("")
        setError("")
      })
      .catch((err) => {
        setError(err.message || "修改密码失败")
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>修改密码</ModalHeader>
        <ModalBody>
          <Input label='旧密码' type='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <Spacer y={2} />
          <Input label='新密码' type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          {error && <p className='text-danger'>{error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant='light' onPress={onClose}>
            取消
          </Button>
          <Button color='primary' onPress={handleSubmit}>
            修改
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PasswordForm
