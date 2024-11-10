import React, { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react"
import { localDB } from "@/utils/localDB"
import { defaultRoleCards } from "./defaultRoleCards"
import { getVariableSetter } from "./setter/variableSetters"
import { useTranslation } from "react-i18next"
import { message } from "@/components/Message"

const CurrentRoleSettingsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const [currentRole, setCurrentRole] = useState(null)

  useEffect(() => {
    if (isOpen) {
      loadCurrentRole()
    }
  }, [isOpen])

  const loadCurrentRole = () => {
    const selectedRoleCardId = localDB.getItem("selectedRoleCardId")
    const roleCards = localDB.getItem("roleCards") || []
    const selectedRole =
      roleCards.find((card) => card.id === selectedRoleCardId) ||
      defaultRoleCards.find((card) => card.id === selectedRoleCardId)
    setCurrentRole(selectedRole)
  }

  const handleSave = () => {
    const roleCards = localDB.getItem("roleCards") || []
    const updatedRoleCards = roleCards.map((card) => (card.id === currentRole.id ? currentRole : card))
    localDB.setItem("roleCards", updatedRoleCards)

    // 处理 defaultRoleCardValues
    if (currentRole.isDefault) {
      const defaultCardValues = localDB.getItem("defaultRoleCardValues") || {}
      defaultCardValues[currentRole.id] = defaultCardValues[currentRole.id] || {}
      Object.entries(currentRole.variables).forEach(([variableName, varConfig]) => {
        defaultCardValues[currentRole.id][variableName] = { value: varConfig.value }
      })
      localDB.setItem("defaultRoleCardValues", defaultCardValues)
    }

    message.success(t("role_settings_saved"))
    onClose()
  }

  const handleVariableChange = (variableName, value) => {
    setCurrentRole((prev) => {
      const updatedRole = {
        ...prev,
        variables: {
          ...prev.variables,
          [variableName]: {
            ...prev.variables[variableName],
            value: value,
          },
        },
      }

      // 如果是默认角色卡片，立即更新 defaultRoleCardValues
      if (updatedRole.isDefault) {
        const defaultCardValues = localDB.getItem("defaultRoleCardValues") || {}
        defaultCardValues[updatedRole.id] = defaultCardValues[updatedRole.id] || {}
        defaultCardValues[updatedRole.id][variableName] = { value: value }
        localDB.setItem("defaultRoleCardValues", defaultCardValues)
      }

      return updatedRole
    })
  }

  if (!currentRole) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
      <ModalContent>
        <ModalHeader>
          {t("current_role_settings")}: {currentRole.name}
        </ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            {Object.entries(currentRole.variables || {}).map(([variableName, varConfig]) => {
              const Setter = getVariableSetter(varConfig.setter).component
              return (
                <Setter
                  cardId={currentRole.id}
                  variableName={variableName}
                  key={variableName}
                  label={varConfig.name}
                  value={varConfig.value}
                  onValueChange={(value) => handleVariableChange(variableName, value)}
                  className='mb-4'
                />
              )
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant='light' onPress={onClose}>
            {t("cancel")}
          </Button>
          <Button color='primary' onPress={handleSave}>
            {t("save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CurrentRoleSettingsModal