import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object().shape({
  port: yup.number().required("端口号是必填的").positive("端口号必须是正数").integer("端口号必须是整数"),
})

export default function AddEnvironmentModal({ isOpen, onClose, onAdd }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    onAdd(data.port)
    reset()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>添加新的开发环境</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='port'
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='端口号'
                      placeholder='请输入端口号'
                      type='number'
                      errorMessage={errors.port?.message}
                    />
                  )}
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                取消
              </Button>
              <Button color='primary' onPress={handleSubmit(onSubmit)}>
                添加
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
