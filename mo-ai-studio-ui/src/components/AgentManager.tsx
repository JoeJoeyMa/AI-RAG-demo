import React, { useState, useEffect } from "react"
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ScrollShadow,
} from "@nextui-org/react"
import { EditIcon, DeleteIcon, PlusFilledIcon } from "@nextui-org/shared-icons"
import { localDB } from "@/utils/localDB"
import Editor from "@monaco-editor/react"
import { blog } from "@/utils"
import { useSelectAgent } from "@/hooks/useSelectAgent"

interface Agent {
  id: string
  name: string
  system: string
  user: string
}

const AgentManager: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [newAgent, setNewAgent] = useState<Agent>({ id: "", name: "", system: "", user: "" })
  const { selectAgent, selectedAgent, defaultAgent } = useSelectAgent()
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure()
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = () => {
    const storedAgents = localDB.getItem("agents") || []

    setAgents([defaultAgent, ...storedAgents.filter((agent: Agent) => agent.id !== "mo-2")])
  }

  const saveAgents = (updatedAgents: Agent[]) => {
    const customAgents = updatedAgents.filter((agent) => agent.id !== "mo-2")
    localDB.setItem("agents", customAgents)
    setAgents(updatedAgents)
  }

  const handleAddAgent = () => {
    if (newAgent.name && newAgent.system && newAgent.user) {
      const updatedAgents = [...agents, { ...newAgent, id: Date.now().toString() }]
      saveAgents(updatedAgents)
      setNewAgent({ id: "", name: "", system: "", user: "" })
      onAddModalClose()
    }
  }

  const handleUpdateAgent = (updatedAgent: Agent) => {
    if (updatedAgent.id === "mo-2") return
    const updatedAgents = agents.map((agent) => (agent.id === updatedAgent.id ? updatedAgent : agent))
    saveAgents(updatedAgents)
  }

  const handleDeleteAgent = (id: string) => {
    if (id === "mo-2") return
    const updatedAgents = agents.filter((agent) => agent.id !== id)
    saveAgents(updatedAgents)
  }

  const handleSelectAgent = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId)
    if (agent) {
      selectAgent(agent)
    }
  }

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent)
    onEditModalOpen()
  }

  const handleSaveEdit = () => {
    if (editingAgent) {
      handleUpdateAgent(editingAgent)
      onEditModalClose()
      setEditingAgent(null)
    }
  }

  return (
    <div className='space-y-4 p-4 bg-gray-900 text-white'>
      <Card className='bg-gray-800 mb-4'>
        <CardBody className='flex flex-row justify-between items-center'>
          <Select
            label='选择代理'
            variant='bordered'
            placeholder='选择一个代理'
            selectedKeys={selectedAgent ? [selectedAgent.id] : []}
            className='max-w-xs'
            onSelectionChange={(keys) => handleSelectAgent(Array.from(keys)[0] as string)}
          >
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </Select>
          <Button color='primary' onPress={onAddModalOpen} startContent={<PlusFilledIcon />}>
            添加新代理
          </Button>
        </CardBody>
      </Card>
      <ScrollShadow className='max-h-fit'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {agents.map((agent) => (
            <Card key={agent.id} className='w-full bg-gray-800'>
              <CardHeader className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold text-white'>{agent.name}</h3>
                <Chip color={agent.id === "mo-2" ? "primary" : "default"}>
                  {agent.id === "mo-2" ? "默认" : "自定义"}
                </Chip>
              </CardHeader>
              <CardBody>
                <p className='text-sm text-gray-300 mb-2'>系统提示词: {agent.system.substring(0, 50)}...</p>
                <p className='text-sm text-gray-300 mb-4'>用户提示词: {agent.user.substring(0, 50)}...</p>
                <div className='flex justify-end space-x-2'>
                  <Button isIconOnly color='primary' onClick={() => handleEditAgent(agent)} aria-label='编辑'>
                    <EditIcon />
                  </Button>
                  {agent.id !== "mo-2" && (
                    <Button isIconOnly color='danger' onClick={() => handleDeleteAgent(agent.id)} aria-label='删除'>
                      <DeleteIcon />
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </ScrollShadow>
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size='2xl'>
        <ModalContent>
          <ModalHeader>{editingAgent?.name}</ModalHeader>
          <ModalBody>
            <Input
              label='名称'
              value={editingAgent?.name || ""}
              onChange={(e) => setEditingAgent((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              className='mb-2'
            />
            <Editor
              height='200px'
              language='javascript'
              theme='vs-dark'
              value={editingAgent?.system || ""}
              onChange={(value) => setEditingAgent((prev) => (prev ? { ...prev, system: value || "" } : null))}
              options={{ minimap: { enabled: false } }}
            />
            <Editor
              height='200px'
              language='javascript'
              theme='vs-dark'
              value={editingAgent?.user || ""}
              onChange={(value) => setEditingAgent((prev) => (prev ? { ...prev, user: value || "" } : null))}
              options={{ minimap: { enabled: false } }}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onEditModalClose}>
              取消
            </Button>
            <Button color='primary' onPress={handleSaveEdit}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose} size='2xl'>
        <ModalContent>
          <ModalHeader>添加新代理</ModalHeader>
          <ModalBody>
            <Input
              label='名称'
              placeholder='输入代理名称'
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              className='mb-2'
            />
            <Editor
              height='200px'
              language='javascript'
              theme='vs-dark'
              value={newAgent.system}
              onChange={(value) => setNewAgent({ ...newAgent, system: value || "" })}
              options={{ minimap: { enabled: false } }}
            />
            <Editor
              height='200px'
              language='javascript'
              theme='vs-dark'
              value={newAgent.user}
              onChange={(value) => setNewAgent({ ...newAgent, user: value || "" })}
              options={{ minimap: { enabled: false } }}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onAddModalClose}>
              取消
            </Button>
            <Button color='primary' onPress={handleAddAgent}>
              添加
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default AgentManager
