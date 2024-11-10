import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  Button,
  ScrollShadow,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Chip,
  CardHeader,
} from "@nextui-org/react"
import { Copy, Trash2, Edit, Plus, Check, Maximize2, Minimize2 } from "lucide-react"
import { message } from "./Message"
import FileEditor from "./FileEditor"
import { localDB } from "@/utils/localDB"
import { useWebSocket } from "@/hooks/use-webSocket"
import { useSearchParams } from "react-router-dom"
import { savedContextPipeline, SavedContext, ContextGroup } from "@/pipeline/savedContextPipeline"
import FileSelectionModal from "./FileSelectionModal"
import { jsonParse, jsonStringify } from "@/utils"

interface FileNode {
  name: string
  type: "file" | "directory"
  children?: FileNode[]
  content?: string
}

const WorkspaceComponent: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null)
  const [isCopying, setIsCopying] = useState(false)
  const [searchParams] = useSearchParams()
  const [contextGroups, setContextGroups] = useState<ContextGroup[]>([])
  const [activeContextGroups, setActiveContextGroups] = useState<Set<string>>(new Set())
  const [newGroupName, setNewGroupName] = useState("")
  const { isOpen: isSaveModalOpen, onOpen: onSaveModalOpen, onClose: onSaveModalClose } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null)
  const [groupToEdit, setGroupToEdit] = useState<ContextGroup | null>(null)
  const [editedGroupName, setEditedGroupName] = useState("")
  const [editedGroupFiles, setEditedGroupFiles] = useState<Set<string>>(new Set())
  const [savedContext, setSavedContext] = useState<SavedContext[]>([])
  const [isContextManagementFullScreen, setIsContextManagementFullScreen] = useState(false)
  const [isContextGroupFullScreen, setIsContextGroupFullScreen] = useState(false)

  const wsUrl = searchParams.get("wsUrl")
  const { lastMessage, readyState, sendMessage } = useWebSocket(wsUrl)

  useEffect(() => {
    const loadWorkspace = async () => {
      const savedWorkspace = localDB.getItem("directoryStructure")
      if (savedWorkspace) {
        setFileTree(savedWorkspace)
      }

      const savedContextGroups = savedContextPipeline.getContextGroups()
      setContextGroups(savedContextGroups)

      const activeGroups = savedContextPipeline.getActiveContextGroups()
      setActiveContextGroups(activeGroups)
      const context = await savedContextPipeline.updateSavedContextFromGroups(
        savedContextGroups,
        activeGroups,
        savedWorkspace
      )
      setSavedContext(context)
    }
    loadWorkspace()
  }, [])

  useEffect(() => {
    if (lastMessage !== null) {
      const response = jsonParse(lastMessage.data)
      if (response.success && response.directoryStructure) {
        setFileTree(response.directoryStructure)
        localDB.setItem("directoryStructure", response.directoryStructure)
        savedContextPipeline
          .updateSavedContext(response.directoryStructure, new Set(savedContext.map((item) => item.path)))
          .then(setSavedContext)
      }
    }
  }, [lastMessage])

  const copyContext = async () => {
    setIsCopying(true)
    try {
      await savedContextPipeline.copyContext(savedContext)
    } finally {
      setIsCopying(false)
    }
  }

  const saveNewContextGroup = async () => {
    if (newGroupName) {
      if (contextGroups.some((group) => group.name === newGroupName)) {
        message.error("上下文组名称已存在，请使用不同的名称。")
        return
      }

      const newGroup: ContextGroup = {
        name: newGroupName,
        files: [],
      }
      const updatedGroups = [...contextGroups, newGroup]
      setContextGroups(updatedGroups)
      setActiveContextGroups((prev) => new Set(prev).add(newGroupName))
      savedContextPipeline.setContextGroups(updatedGroups)
      savedContextPipeline.setActiveContextGroups(activeContextGroups)
      savedContextPipeline.saveContextGroup(newGroupName, [])
      message.success("新的上下文组已创建")
      setNewGroupName("")
      onSaveModalClose()
    }
  }

  const switchContextGroup = async (groupName: string) => {
    setActiveContextGroups((prev) => {
      const newActiveGroups = new Set(prev)
      if (newActiveGroups.has(groupName)) {
        newActiveGroups.delete(groupName)
      } else {
        newActiveGroups.add(groupName)
      }
      return newActiveGroups
    })

    // 使用回调函数来确保我们使用最新的 activeContextGroups 状态
    setActiveContextGroups((newActiveGroups) => {
      savedContextPipeline
        .updateSavedContextFromGroups(contextGroups, newActiveGroups, fileTree)
        .then((updatedContext) => {
          setSavedContext(updatedContext)
          savedContextPipeline.setActiveContextGroups(newActiveGroups)
        })
      return newActiveGroups
    })
  }

  const deleteContextGroup = async () => {
    if (groupToDelete) {
      const updatedGroups = contextGroups.filter((group) => group.name !== groupToDelete)
      setContextGroups(updatedGroups)
      savedContextPipeline.setContextGroups(updatedGroups)

      setActiveContextGroups((prev) => {
        const newActiveGroups = new Set(prev)
        newActiveGroups.delete(groupToDelete)
        return newActiveGroups
      })

      savedContextPipeline.setActiveContextGroups(activeContextGroups)
      savedContextPipeline.deleteContextGroup(groupToDelete)
      const updatedContext = await savedContextPipeline.updateSavedContextFromGroups(
        updatedGroups,
        activeContextGroups,
        fileTree
      )
      setSavedContext(updatedContext)

      message.success(`上下文组 "${groupToDelete}" 已删除`)
      setGroupToDelete(null)
      onDeleteModalClose()
    }
  }

  const openEditModal = async (group: ContextGroup) => {
    setGroupToEdit(group)
    setEditedGroupName(group.name)
    const groupFiles = localDB.getItem(`contextGroup_${group.name}`)
    setEditedGroupFiles(new Set(groupFiles || []))
    onEditModalOpen()
  }

  const saveEditedContextGroup = async (selectedFiles: Set<string>) => {
    if (groupToEdit && editedGroupName) {
      const updatedGroups = contextGroups.map((group) =>
        group.name === groupToEdit.name ? { name: editedGroupName, files: Array.from(selectedFiles) } : group
      )
      setContextGroups(updatedGroups)
      savedContextPipeline.setContextGroups(updatedGroups)

      if (groupToEdit.name !== editedGroupName) {
        savedContextPipeline.saveContextGroup(editedGroupName, Array.from(selectedFiles))
        savedContextPipeline.deleteContextGroup(groupToEdit.name)

        setActiveContextGroups((prev) => {
          const newActiveGroups = new Set(prev)
          if (newActiveGroups.has(groupToEdit.name)) {
            newActiveGroups.delete(groupToEdit.name)
            newActiveGroups.add(editedGroupName)
          }
          return newActiveGroups
        })
      } else {
        savedContextPipeline.saveContextGroup(editedGroupName, Array.from(selectedFiles))
      }

      savedContextPipeline.setActiveContextGroups(activeContextGroups)
      const updatedContext = await savedContextPipeline.updateSavedContextFromGroups(
        updatedGroups,
        activeContextGroups,
        fileTree
      )
      setSavedContext(updatedContext)

      message.success(`上下文组 "${groupToEdit.name}" 已更新`)
      setGroupToEdit(null)
      onEditModalClose()
    }
  }

  const toggleContextManagementFullScreen = () => {
    setIsContextManagementFullScreen((prev) => !prev)
  }

  const toggleContextGroupFullScreen = () => {
    setIsContextGroupFullScreen((prev) => !prev)
  }

  const getLanguageFromFileName = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    const codeExtensions = {
      js: "javascript",
      ts: "typescript",
      jsx: "jsx",
      tsx: "tsx",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      go: "go",
      rb: "ruby",
      php: "php",
      swift: "swift",
      kt: "kotlin",
      rs: "rust",
      scala: "scala",
      html: "html",
      css: "css",
      scss: "scss",
      json: "json",
      xml: "xml",
      yaml: "yaml",
      md: "markdown",
    }
    return extension && extension in codeExtensions ? codeExtensions[extension as keyof typeof codeExtensions] : "code"
  }

  return (
    <Card className='w-full'>
      <CardBody>
        <div
          className={`${
            isContextManagementFullScreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4 overflow-auto" : ""
          }`}
        >
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-bold'>上下文管理</h3>
            <Button
              size='sm'
              onPress={toggleContextManagementFullScreen}
              className='ml-4'
              isIconOnly
              title={isContextManagementFullScreen ? "退出全屏" : "进入全屏"}
            >
              {isContextManagementFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </Button>
          </div>
          <ScrollShadow
            className={`h-[calc(100vh-450px)] ${isContextManagementFullScreen ? "h-[calc(100vh-100px)]" : ""}`}
          >
            <div className='workspace-tree'>
              {savedContext.map((item, index) => (
                <div key={index} className='mb-4'>
                  <h4 className='text-sm font-semibold'>{item.path}</h4>
                  <pre className='p-2 rounded text-sm overflow-x-auto'>
                    <code>{item.content}</code>
                  </pre>
                </div>
              ))}
            </div>
          </ScrollShadow>
        </div>
        <div
          className={`mt-4 ${
            isContextGroupFullScreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4 overflow-auto" : ""
          }`}
        >
          <div className='flex justify-between items-center mb-2'>
            <h4 className='text-sm font-semibold'>上下文组：</h4>
            <Button
              size='sm'
              onPress={toggleContextGroupFullScreen}
              isIconOnly
              title={isContextGroupFullScreen ? "退出全屏" : "进入全屏"}
            >
              {isContextGroupFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </Button>
          </div>
          <ScrollShadow className='max-h-36'>
            <div className='flex flex-wrap gap-2'>
              {contextGroups.map((group) => (
                <Card key={group.name}>
                  <CardHeader>
                    <Chip
                      startContent={activeContextGroups.has(group.name) ? <Check size={18} /> : null}
                      variant={activeContextGroups.has(group.name) ? "solid" : "flat"}
                      color={activeContextGroups.has(group.name) ? "primary" : "default"}
                      onClose={() => {
                        setGroupToDelete(group.name)
                        onDeleteModalOpen()
                      }}
                      onClick={() => switchContextGroup(group.name)}
                      className='cursor-pointer'
                    >
                      {group.name} ({group.files.length})
                    </Chip>
                  </CardHeader>
                  <CardBody>
                    <Button size='sm' isIconOnly variant='light' onPress={() => openEditModal(group)}>
                      <Edit size={14} />
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </ScrollShadow>
        </div>
        <div className='mt-4 flex justify-between items-center'>
          <Button size='sm' endContent={<Plus width={16} height={16} />} onPress={onSaveModalOpen}>
            创建上下文组
          </Button>
          <Button
            size='sm'
            endContent={isCopying ? <Spinner size='sm' /> : <Copy width={16} height={16} />}
            onPress={copyContext}
          >
            复制上下文
          </Button>
        </div>
      </CardBody>
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{currentFile?.name}</ModalHeader>
              <ModalBody>
                <FileEditor file={currentFile} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isSaveModalOpen} onOpenChange={onSaveModalClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>创建新的上下文组</ModalHeader>
              <ModalBody>
                <Input
                  label='上下文组名称'
                  placeholder='输入新的上下文组名称'
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  取消
                </Button>
                <Button color='primary' onPress={saveNewContextGroup}>
                  创建
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>删除上下文组</ModalHeader>
              <ModalBody>
                <p>确定要删除上下文组 "{groupToDelete}" 吗？</p>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  取消
                </Button>
                <Button color='danger' onPress={deleteContextGroup}>
                  删除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <FileSelectionModal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        onSave={saveEditedContextGroup}
        fileTree={fileTree}
        initialSelectedFiles={editedGroupFiles}
      />
    </Card>
  )
}

export default WorkspaceComponent
