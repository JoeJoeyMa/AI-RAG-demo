import React, { useState, useEffect } from "react"
import {
  Button,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Tooltip,
  Card,
  ButtonGroup,
  Chip,
  Select,
  SelectItem,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import mo2 from "../../../public/assets/mo-2.png"
import { localDB } from "@/utils/localDB"
import { modelConfig, toolConfig } from "./DevChatModelConfig"
import { message } from "@/components/Message"
import RoleCardList from "./RoleCardList"
import { defaultRoleCards } from "./defaultRoleCards"
import { useTranslation } from "react-i18next"
import { getOutputProcessorOptions } from "./outputProcessors"

const ToolBar = ({ onOpenRoleSettings }) => {
  const [apiKeys, setApiKeys] = useState(
    Object.fromEntries(Object.values(modelConfig.models).map((model) => [model.apiKeyName, ""]))
  )
  const [apiEndpoints, setApiEndpoints] = useState(
    Object.fromEntries(
      Object.values(modelConfig.models).map((model) => [model.apiKeyName, model.defaultEndpoint || ""])
    )
  )
  const [toolApiKeys, setToolApiKeys] = useState(
    Object.fromEntries(Object.values(toolConfig.tools).map((tool) => [tool.apiKeyName, ""]))
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("未选择")
  const [roleCards, setRoleCards] = useState(localDB.getItem("roleCards") || [])
  const [currentRole, setCurrentRole] = useState<string>("")
  const [currentBaseModel, setCurrentBaseModel] = useState<string>("")
  const { t, i18n } = useTranslation()
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    const setRole = (value) => {
      const roleCards = localDB.getItem("roleCards") || []
      const target = roleCards.find((card) => card.id === value)
      if (target) {
        setSelectedRole(target.name)
        setCurrentBaseModel(target.baseModel)
      } else {
        const target = defaultRoleCards.find((card) => card.id === value)
        if (target) {
          setSelectedRole(target.name)
          setCurrentBaseModel(target.baseModel)
        }
      }
    }
    const selectedRoleCardId = localDB.getItem("selectedRoleCardId")
    if (selectedRoleCardId) {
      setRole(selectedRoleCardId)
      setCurrentRole(selectedRoleCardId)
    }
    const dispose = localDB.watchKey("selectedRoleCardId", ({ key, value }) => {
      setRole(value)
      setCurrentRole(value)
      setRoleCards(localDB.getItem("roleCards"))
    })

    // 添加事件监听器来更新roleCards
    const handleRoleCardsUpdate = () => {
      setRoleCards(localDB.getItem("roleCards") || [])
    }
    window.addEventListener("roleCardsUpdated", handleRoleCardsUpdate)

    return () => {
      dispose()
      window.removeEventListener("roleCardsUpdated", handleRoleCardsUpdate)
    }
  }, [])

  useEffect(() => {
    const storedApiKeys = localDB.getItem("apiKeys")
    if (storedApiKeys) {
      setApiKeys(storedApiKeys)
    }
    const storedApiEndpoints = localDB.getItem("apiEndpoints")
    if (storedApiEndpoints) {
      setApiEndpoints((prev) => ({
        ...prev,
        ...storedApiEndpoints,
      }))
    }
    const storedToolApiKeys = localDB.getItem("toolApiKeys")
    if (storedToolApiKeys) {
      setToolApiKeys(storedToolApiKeys)
    }
  }, [])

  const handleSaveSettings = () => {
    localDB.setItem("apiKeys", apiKeys)
    localDB.setItem("apiEndpoints", apiEndpoints)
    localDB.setItem("toolApiKeys", toolApiKeys)
    message.success(t("settings_saved"))
    onClose()
  }

  const handleOpenRoleModal = () => {
    setIsRoleModalOpen(true)
  }

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false)
  }

  const handleSwitchRole = (roleId: string) => {
    const roleCards = localDB.getItem("roleCards") || []
    const defaultCards = defaultRoleCards
    const allRoles = [...roleCards, ...defaultCards]
    const nextRole = allRoles.find((role) => role.id === roleId)
    if (nextRole) {
      setCurrentRole(nextRole.id)
      setCurrentBaseModel(nextRole.baseModel)
      localDB.setItem("selectedRoleCardId", nextRole.id)

      // 存储自定义指令
      if (nextRole.customInstructions) {
        const commands = nextRole.customInstructions.map((instruction) => ({
          key: instruction.prefix,
          name: instruction.prefix,
        }))
        localDB.setItem("currentRoleCommands", commands)
      } else {
        localDB.setItem("currentRoleCommands", [])
      }

      message.success(t("role_switched", { name: nextRole.name }))
    }
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localDB.setItem("language", lng)
  }

  // 新增：打开子窗口的函数
  const openChildWindow = () => {
    window.electronAPI.window.openChildWindow()
  }

  // 新增：删除智能体数据的函数
  const handleDeleteAgentData = () => {
    localDB.removeItem("defaultRoleCardValues")
    localDB.removeItem("roleCards")
    localDB.removeItem("savedFileSelections")
    setRoleCards([])
    setCurrentRole("")
    setSelectedRole("未选择")
    setCurrentBaseModel("")
    localDB.removeItem("selectedRoleCardId")
    localDB.removeItem("currentRoleCommands")
    message.success(t("agent_data_deleted"))
    setIsConfirmDeleteOpen(false)
  }

  return (
    <div className='flex justify-between items-center mb-4 w-full'>
      <div className='flex items-center space-x-2 '>
        <Image src={mo2} className='max-w-[36px] max-h-[36px] object-cover rounded' alt='Mo Logo' />
        <span className='font-semibold'>Mo</span>
      </div>
      <div className='flex items-center space-x-2'>
        <Select
          className='min-w-48'
          size='sm'
          placeholder={t("select_role")}
          onChange={(e) => handleSwitchRole(e.target.value)}
          selectedKeys={[currentRole]}
        >
          {(roleCards ? [...defaultRoleCards, ...roleCards] : [...defaultRoleCards]).map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </Select>
        <ButtonGroup variant='flat'>
          <Button
            size='sm'
            startContent={<Icon icon='mdi:account-multiple' />}
            onPress={handleOpenRoleModal}
            aria-label={t("open_role_settings")}
          >
            {t("roles")}
          </Button>
          <Button size='sm' startContent={<Icon icon='mdi:cog' />} onPress={onOpen} aria-label={t("open_settings")}>
            {t("settings")}
          </Button>
          <Button size='sm' onPress={openChildWindow} startContent={<Icon icon='mdi:open-in-new' />}>
            {t("open_child_window")}
          </Button>
        </ButtonGroup>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
        <ModalContent>
          <ModalHeader>{t("settings")}</ModalHeader>
          <ModalBody className='max-h-[70vh] overflow-y-auto'>
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='font-medium'>{t("configure_base_model")}</span>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Object.entries(modelConfig.models)
                  .filter(([, model]) => !model.isFree)
                  .map(([key, model]) => (
                    <Card key={key} className='p-4 space-y-4'>
                      <div className='flex items-center space-x-2'>
                        {model.iconType === "image" ? (
                          <img
                            src={model.icon}
                            className='max-w-[24px] max-h-[24px] object-cover rounded'
                            alt={model.name}
                          />
                        ) : (
                          <Icon icon={model.icon} width={24} />
                        )}
                        <span className='font-semibold'>{model.name}</span>
                      </div>
                      <Input
                        label='API Key'
                        placeholder={t("enter_api_key", { model: model.name })}
                        value={apiKeys[model.apiKeyName]}
                        onChange={(e) =>
                          setApiKeys((prev) => ({
                            ...prev,
                            [model.apiKeyName]: e.target.value,
                          }))
                        }
                      />
                      {model.requiresApiEndpoint && (
                        <Input
                          label='API Endpoint'
                          placeholder={t("enter_api_endpoint", { model: model.name })}
                          value={apiEndpoints[model.apiKeyName]}
                          onChange={(e) =>
                            setApiEndpoints((prev) => ({
                              ...prev,
                              [model.apiKeyName]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </Card>
                  ))}
              </div>
              <div className='flex items-center justify-between'>
                <span className='font-medium'>{t("configure_tools")}</span>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Object.entries(toolConfig.tools).map(([key, tool]) => (
                  <Card key={key} className='p-4 space-y-4'>
                    <div className='flex items-center space-x-2'>
                      {tool.iconType === "image" ? (
                        <img
                          src={tool.icon}
                          className='max-w-[24px] max-h-[24px] object-cover rounded'
                          alt={tool.name}
                        />
                      ) : (
                        <Icon icon={tool.icon} width={24} />
                      )}
                      <span className='font-semibold'>{tool.name}</span>
                    </div>
                    <Input
                      label='API Key'
                      placeholder={t("enter_api_key", { model: tool.name })}
                      value={toolApiKeys[tool.apiKeyName]}
                      onChange={(e) =>
                        setToolApiKeys((prev) => ({
                          ...prev,
                          [tool.apiKeyName]: e.target.value,
                        }))
                      }
                    />
                  </Card>
                ))}
              </div>
              <div className='flex flex-col space-y-2'>
                <span className='font-medium'>{t("language_settings")}</span>
                <Select
                  label={t("select_language")}
                  placeholder={t("select_language")}
                  onChange={(e) => changeLanguage(e.target.value)}
                  defaultSelectedKeys={[i18n.language]}
                >
                  <SelectItem key='en' value='en'>
                    English
                  </SelectItem>
                  <SelectItem key='zh' value='zh'>
                    中文
                  </SelectItem>
                </Select>
              </div>
              <div className='flex flex-col space-y-2'>
                <span className='font-medium'>{t("agent_data_management")}</span>
                <Button color='danger' onPress={() => setIsConfirmDeleteOpen(true)}>
                  {t("delete_agent_data")}
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onClose}>
              {t("cancel")}
            </Button>
            <Button color='primary' onPress={handleSaveSettings}>
              {t("save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isRoleModalOpen} onClose={handleCloseRoleModal} size='5xl'>
        <ModalContent className='h-[80vh]'>
          <ModalHeader>{t("role_settings")}</ModalHeader>
          <ModalBody className='overflow-y-auto'>
            <RoleCardList />
          </ModalBody>
          <ModalFooter>
            <Button size='sm' className='bg-black text-white' onPress={handleCloseRoleModal}>
              {t("confirm_selection")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)}>
        <ModalContent>
          <ModalHeader>{t("confirm_delete")}</ModalHeader>
          <ModalBody>
            <p>{t("confirm_delete_message")}</p>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={() => setIsConfirmDeleteOpen(false)}>
              {t("cancel")}
            </Button>
            <Button color='danger' onPress={handleDeleteAgentData}>
              {t("confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default React.memo(ToolBar)
