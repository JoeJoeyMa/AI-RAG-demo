import React, { useState, useEffect } from "react"
import {
  Button,
  Switch,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Tooltip,
  Card,
  Textarea,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import mo2 from "../../public/assets/mo-2.png"
import { localDB } from "@/utils/localDB"
import { modelConfig } from "../pages/mo/DevChatModelConfig"
import { blog, jsonParse, jsonStringify } from "@/utils"
import { useManualMode } from "@/hooks/useManualMode"
import { useSelectAgent } from "@/hooks/useSelectAgent"
import { useWebSocket } from "@/hooks/use-webSocket"
import { message } from "./Message"

const ToolBar = () => {
  const [selectedMode, setSelectedMode] = useState("交流模式")
  const { selectAgent, selectedAgent } = useSelectAgent()
  const [selectedModel, setSelectedModel] = useState(modelConfig.defaultModel)
  const { isManualContext, toggleMode } = useManualMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [apiKeys, setApiKeys] = useState(
    Object.fromEntries(Object.values(modelConfig.models).map((model) => [model.apiKeyName, ""]))
  )
  const [apiEndpoints, setApiEndpoints] = useState(
    Object.fromEntries(
      Object.values(modelConfig.models).map((model) => [model.apiKeyName, model.defaultEndpoint || ""])
    )
  )
  const [includeList, setIncludeList] = useState("")
  const { sendMessage } = useWebSocket(null)

  const toggleContextMode = () => {
    localDB.setItem("_isManualContextMode", !isManualContext)
  }

  useEffect(() => {
    const storedMode = localDB.getItem("Mo2Mode")
    if (storedMode) {
      setSelectedMode(storedMode)
    }
    const storedModel = localDB.getItem("selectedModel")
    if (storedModel && modelConfig.models[storedModel]) {
      setSelectedModel(storedModel)
    }
    const storedApiKeys = localDB.getItem("apiKeys")
    if (storedApiKeys) {
      setApiKeys(jsonParse(storedApiKeys))
    }
    const storedApiEndpoints = localDB.getItem("apiEndpoints")
    if (storedApiEndpoints) {
      setApiEndpoints((prev) => ({
        ...prev,
        ...jsonParse(storedApiEndpoints),
      }))
    }
    // 获取当前的 includeList
    const currentConfig = localDB.getItem("moConfig")
    if (currentConfig && currentConfig.includeList) {
      setIncludeList(currentConfig.includeList.join("\n"))
    }
  }, [])

  const handleModeChange = (mode) => {
    setSelectedMode(mode)
    localDB.setItem("Mo2Mode", mode)
  }

  const handleModelChange = (model) => {
    setSelectedModel(model)
    localDB.setItem("selectedModel", model)
  }

  const handleSaveSettings = () => {
    localDB.setItem("apiKeys", apiKeys)
    localDB.setItem("apiEndpoints", apiEndpoints)
    // 更新 mo.config.json
    const newIncludeList = includeList.split("\n").filter((item) => item.trim() !== "")
    const updatedConfig = {
      includeList: newIncludeList,
    }
    if (sendMessage) {
      sendMessage(
        jsonStringify({
          action: "updateMoConfig",
          content: jsonStringify(updatedConfig),
        })
      )
    }
    message.success("设置已保存，服务器正在重启...")
    onClose()
  }

  return (
    <div className='flex justify-between items-center mb-4 w-full'>
      <div className='flex items-center space-x-2 '>
        <Image src={mo2} className='max-w-[36px] max-h-[36px] object-cover rounded' alt='Mo-2 Logo' />
        <span className='font-semibold'>{selectedAgent ? selectedAgent.name : "Mo-2"}</span>
      </div>
      <div className='flex items-center space-x-4'>
        <Button
          variant='light'
          startContent={<Icon icon='mdi:cog' width={20} />}
          onPress={onOpen}
          aria-label='打开设置'
        >
          设置
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
        <ModalContent>
          <ModalHeader>设置</ModalHeader>
          <ModalBody className='max-h-[70vh] overflow-y-auto'>
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold'>检索模式</h3>
                  <p className='text-sm text-gray-500'>
                    手动检索模式允许您选择特定文件进行对话，而自动检索模式会自动选择相关文件。
                  </p>
                </div>
                <Switch
                  defaultSelected={isManualContext}
                  onChange={toggleContextMode}
                  size='sm'
                  aria-label='切换检索模式'
                >
                  {isManualContext ? "手动检索" : "自动检索"}
                </Switch>
              </div>
              <div className='flex items-center justify-between'>
                <span className='font-medium'>当前基座模型</span>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant='bordered'>{selectedModel}</Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label='Model Selection' onAction={(key) => handleModelChange(key)}>
                    {Object.entries(modelConfig.models).map(([key, model]) => (
                      <DropdownItem
                        key={key}
                        startContent={
                          model.icon.includes("svg") ? (
                            <img
                              src={model.icon}
                              className='max-w-[20px] max-h-[20px] object-cover rounded'
                              alt={model.name}
                            />
                          ) : (
                            <Icon icon={model.icon} width={20} />
                          )
                        }
                      >
                        {model.name}
                        {model.isFree && " (限时免费)"}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Object.entries(modelConfig.models)
                  .filter(([, model]) => !model.isFree)
                  .map(([key, model]) => (
                    <Card key={key} className='p-4 space-y-4'>
                      <div className='flex items-center space-x-2'>
                        {model.icon.includes("svg") ? (
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
                        placeholder={`输入你的 ${model.name} API Key`}
                        value={apiKeys[model.apiKeyName]}
                        onChange={(e) =>
                          setApiKeys((prev) => ({
                            ...prev,
                            [model.apiKeyName]: e.target.value,
                          }))
                        }
                      />
                      <Input
                        label='API Endpoint'
                        placeholder={`输入你的 ${model.name} API Endpoint`}
                        value={apiEndpoints[model.apiKeyName]}
                        onChange={(e) =>
                          setApiEndpoints((prev) => ({
                            ...prev,
                            [model.apiKeyName]: e.target.value,
                          }))
                        }
                      />
                    </Card>
                  ))}
              </div>
              <div className='flex flex-col space-y-2'>
                <h3 className='text-lg font-semibold'>项目设置</h3>
                <Textarea
                  label='包含文件列表 (每行一个)'
                  placeholder='src/**/*.js\nsrc/**/*.ts'
                  value={includeList}
                  onChange={(e) => setIncludeList(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onClose}>
              取消
            </Button>
            <Button color='primary' onPress={handleSaveSettings}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ToolBar
