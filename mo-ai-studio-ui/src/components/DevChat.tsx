import {
  Button,
  Badge,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Divider,
  Image,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import PromptInput from "@/components/PromptInput"
import ChatList from "@/components/ChatList"
import { useDevChatLogic } from "@/hooks/useDevChatLogic"
import ToolBar from "./DevChatToolBar"

export default function DevChat({ activeTab }) {
  const {
    images,
    messages,
    isLoading,
    executionSteps,
    isModalOpen,
    isChatPaused,
    isStreaming,
    handleImageUpload,
    onRemoveImage,
    handleSendMessage,
    handleClearChat,
    handleCloseModal,
    handlePaste,
    handleRollback,
    toggleChatPause,
  } = useDevChatLogic(activeTab)

  const filteredExecutionSteps = executionSteps.filter((step) => step?.message?.trim() !== "")

  return (
    <div className='flex w-full flex-col gap-4'>
      <ToolBar />
      <ChatList messages={messages} />
      <form className='flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70'>
        <div className='group flex gap-2 px-4 pt-4 overflow-x-auto min-h-20'>
          {images.map((image, index) => (
            <Badge
              key={index}
              isOneChar
              content={
                <Button isIconOnly radius='full' size='sm' variant='light' onPress={() => onRemoveImage(index)}>
                  <Icon className='text-foreground' icon='iconamoon:close-thin' width={16} />
                </Button>
              }
            >
              <Image
                alt={image.name}
                className='h-14 w-14 rounded-small border-small border-default-200/50 object-cover -top'
                src={URL.createObjectURL(image)}
              />
            </Badge>
          ))}
        </div>
        <PromptInput
          isLoading={isLoading}
          classNames={{
            inputWrapper: "!bg-transparent shadow-none min-h-48",
            innerWrapper: "relative -top-12 w-full",
            input: "pt-1 pl-2 pb-6 !pr-10 text-medium",
          }}
          minRows={3}
          radius='lg'
          variant='flat'
          onSubmit={handleSendMessage}
          onPaste={handlePaste}
          isChatPaused={isChatPaused}
          isStreaming={isStreaming}
          toggleChatPause={toggleChatPause}
        />
        <div className='flex w-full items-center justify-between gap-2 overflow-scroll px-4 pb-4'>
          <div className='flex w-full gap-1 md:gap-3'>
            <Button
              size='sm'
              className='bg-[#27272a]'
              startContent={<Icon className='text-default-500' icon='solar:gallery-add-linear' width={18} />}
              onPress={() => document.getElementById("imageInput")?.click()}
              isDisabled={images.length >= 10}
            >
              {images.length}/10
            </Button>
            <Button
              size='sm'
              className='bg-[#27272a]'
              startContent={<Icon className='text-default-500' icon='mdi:trash-can-outline' width={18} />}
              onPress={handleClearChat}
            >
              清空消息
            </Button>
            <Button
              size='sm'
              className='bg-[#27272a]'
              startContent={<Icon className='text-default-500' icon='mdi:undo' width={18} />}
              onPress={handleRollback}
            >
              Git撤销
            </Button>
            <input
              id='imageInput'
              type='file'
              accept='image/*'
              multiple
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </form>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size='2xl' scrollBehavior='inside'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>执行任务</ModalHeader>
              <ModalBody>
                <Card>
                  <CardBody>
                    <div className='flex flex-col space-y-4'>
                      {filteredExecutionSteps.map((step, index) => (
                        <>
                          {step.message ? (
                            <div key={index} className='flex items-start space-x-4'>
                              <div className='flex-shrink-0'>
                                {step.status === "pending" && <Spinner size='sm' />}
                                {step.status === "success" && (
                                  <Icon icon='mdi:check-circle' color='green' width='20' height='20' />
                                )}
                                {step.status === "error" && (
                                  <Icon icon='mdi:close-circle' color='red' width='20' height='20' />
                                )}
                              </div>
                              <div className='flex-grow'>
                                <p className='text-sm'>{step.message}</p>
                              </div>
                            </div>
                          ) : (
                            <Divider />
                          )}
                        </>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  关闭
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
