import React from "react"
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react"

interface WorkModalProps {
  isOpen: boolean
  onClose: () => void
}

const WorkModal: React.FC<WorkModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeButton aria-labelledby='work-modal'>
      <ModalHeader>
        <div id='work-modal'>Our Work</div>
      </ModalHeader>
      <ModalBody>
        <div>
          Here you can showcase your studio's work. Add images, descriptions, or any other content that highlights your
          projects and achievements.
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant='flat' color='danger' onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default WorkModal
