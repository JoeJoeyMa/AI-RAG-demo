import React, { useState, useEffect } from "react"
import {
  Card,
  Button,
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"

interface FileContent {
  path: string
  content: string
  status: string
  message?: string
}

interface DevProcessorResultProps {
  results: FileContent[]
}

const DevProcessorResult: React.FC<DevProcessorResultProps> = ({ results }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    console.log(results)
    if (results && results.length > 0) {
      setIsModalOpen(true)
    }
  }, [results])

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (!results || results.length === 0) {
    return null
  }

  return (
    <Modal isOpen={isModalOpen} onClose={handleCloseModal} size='4xl'>
      <ModalContent>
        <ModalHeader>{t("processing_results")}</ModalHeader>
        <ModalBody>
          <div className='mb-4'>{t("processed_files", { count: results.length })}</div>
          <Accordion>
            {results.map((file, index) => (
              <AccordionItem
                key={index}
                aria-label={file.path}
                title={
                  <div className='flex items-center'>
                    <Icon icon='mdi:file-document-outline' className='mr-2' />
                    <div>{file.path}</div>
                    {file.status === "success" ? (
                      <Icon icon='mdi:check-circle' className='ml-2 text-success' />
                    ) : (
                      <Icon icon='mdi:alert-circle' className='ml-2 text-danger' />
                    )}
                  </div>
                }
              >
                <div className={`p-2 rounded ${file.status === "success" ? "bg-success-100" : "bg-danger-100"}`}>
                  {file.status === "success" ? <p>{t("file_processed_successfully")}</p> : <p>{t("processing_failed", { message: file.message })}</p>}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onPress={handleCloseModal}>
            {t("close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DevProcessorResult