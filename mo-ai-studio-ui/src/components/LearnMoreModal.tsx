import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image } from "@nextui-org/react"
import wechatimg from "../../public/assets/wechat.jpg"
import { useTranslation } from "react-i18next"

interface LearnMoreModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onOpenChange }) => {
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>{t("learn_more_header")}</ModalHeader>
            <ModalBody>
              <Image src={wechatimg} alt={t("wechat_qr_code")} className='max-w-full h-auto' />
            </ModalBody>
            <ModalFooter>
              <Button color='primary' onPress={onClose}>
                {t("close")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default LearnMoreModal
