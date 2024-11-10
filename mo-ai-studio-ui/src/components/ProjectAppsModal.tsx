import React, { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Spinner,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react"
import { ChevronDownIcon, SearchIcon } from "lucide-react"
import { deleteApp, queryApps, updateApps, queryAppVersions, pubAppTemplate } from "@/service/api"
import { useNavigate } from "react-router-dom"
import CreateAppModal from "@/components/CreateAppModal"
import DeleteConfirmModal from "@/components/DeleteConfirmModal"
import UpdateAppModal from "@/components/UpdateAppModal"
import ReleaseAppModal from "@/components/ReleaseAppModal"
import WebSocketModal from "@/components/WebSocketModal"
import { localDB } from "@/utils/localDB"
import { blog } from "@/utils"
import { useWebSocket } from "@/hooks/use-webSocket"

export default function ProjectAppsModal({ projectId, projectName }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: updateModalOpen, onOpen: onUpdateModalOpen, onOpenChange: onUpdateModalOpenChange } = useDisclosure()
  const {
    isOpen: releaseModalOpen,
    onOpen: onReleaseModalOpen,
    onOpenChange: onReleaseModalOpenChange,
  } = useDisclosure()
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentRecord, setCurrentRecord] = useState({})
  const [versionData, setVersionData] = useState([])
  const [versionModalOpen, setVersionModalOpen] = useState(false)
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [wsModalOpen, setWsModalOpen] = useState(false)
  const [environments, setEnvironments] = useState([])
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const { lastMessage, readyState, sendMessage } = useWebSocket()

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "名称" },
    { key: "description", label: "描述" },
    { key: "appCode", label: "应用编码" },
    { key: "initState", label: "初始化状态" },
    { key: "actions", label: "操作" },
  ]

  useEffect(() => {
    if (isOpen) {
      fetchData()
      loadEnvironments()
    }
  }, [isOpen])

  useEffect(() => {
    if (lastMessage) {
      localDB.setItem("wsData", lastMessage.data)
    }
  }, [lastMessage])

  const loadEnvironments = async () => {
    const savedEnvironments = localDB.getItem("environments") || []
    setEnvironments(savedEnvironments)
  }

  async function fetchData() {
    setLoading(true)
    try {
      const res = await queryApps({ projectId })
      setDataSource(res.data)
    } catch (error) {
      console.error("Failed to fetch apps:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartDev = (record) => {
    setCurrentRecord(record)
    setWsModalOpen(true)
  }

  const handleDelete = async () => {
    try {
      await deleteApp(currentRecord.id)
      await fetchData()
      setDeleteModalOpen(false)
    } catch (error) {
      console.error("Failed to delete app:", error)
    }
  }

  const handleViewVersions = async (record) => {
    try {
      const res = await queryAppVersions(record.id)
      setVersionData(res.data)
      setVersionModalOpen(true)
    } catch (error) {
      console.error("Failed to fetch app versions:", error)
    }
  }

  const handlePubTemplate = async (values) => {
    try {
      await pubAppTemplate({
        ...currentRecord,
        sourceAppId: currentRecord.id,
        computePower: values.computePower,
      })
      setTemplateModalOpen(false)
    } catch (error) {
      console.error("Failed to publish app template:", error)
    }
  }

  const handleMenuAction = (key, item) => {
    setCurrentRecord(item)
    switch (key) {
      case "develop":
        handleStartDev(item)
        break
      case "delete":
        setDeleteModalOpen(true)
        break
      case "update":
        onUpdateModalOpen()
        break
      case "release":
        onReleaseModalOpen()
        break
    }
  }

  const handleAddEnvironment = async (port) => {
    const newEnvironment = { port, url: `ws://localhost:${port}` }
    const updatedEnvironments = [...environments, newEnvironment]
    setEnvironments(updatedEnvironments)
    localDB.setItem("environments", updatedEnvironments)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const filteredDataSource = dataSource.filter((item) =>
    Object.values(item).some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey]

    switch (columnKey) {
      case "initState":
        return cellValue === "SUCCESS" ? "已完成" : <Spinner size='sm' />
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isDisabled={item.initState !== "SUCCESS"} endContent={<ChevronDownIcon className='text-small' />}>
                操作
              </Button>
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => handleMenuAction(key, item)} aria-label='Actions'>
              {/* <DropdownItem key='develop'>开始开发</DropdownItem> */}
              <DropdownItem key='delete' className='text-danger' color='danger'>
                删除应用
              </DropdownItem>
              <DropdownItem key='update'>更新应用</DropdownItem>
              <DropdownItem key='release'>发布应用</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )
      default:
        return cellValue
    }
  }

  return (
    <>
      <Button onPress={onOpen} size='sm'>
        查看应用
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='5xl' scrollBehavior='inside'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{projectName} 项目下的应用列表</ModalHeader>
              <ModalBody>
                <Card>
                  <CardHeader className='flex justify-between'>
                    <Input
                      className='w-full sm:max-w-[44%]'
                      placeholder='搜索应用名称...'
                      startContent={<SearchIcon />}
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    <CreateAppModal projectId={projectId} onAppCreated={fetchData} />
                  </CardHeader>
                  <CardBody>
                    <Table className='min-h-96' aria-label='项目应用列表'>
                      <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                      </TableHeader>
                      <TableBody
                        items={filteredDataSource}
                        emptyContent={loading ? <Spinner label='加载中...' /> : "没有找到应用"}
                      >
                        {(item) => (
                          <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
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

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title='删除应用'
        content={`确定要删除应用 "${currentRecord.name}" 吗？此操作不可逆。`}
      />
      <UpdateAppModal
        isOpen={updateModalOpen}
        app={currentRecord}
        onUpdate={fetchData}
        onOpenChange={onUpdateModalOpenChange}
      />
      <ReleaseAppModal
        isOpen={releaseModalOpen}
        app={currentRecord}
        onRelease={fetchData}
        onOpenChange={onReleaseModalOpenChange}
      />
      <WebSocketModal
        isOpen={wsModalOpen}
        onClose={() => setWsModalOpen(false)}
        appId={currentRecord.id}
        navigate={navigate}
        environments={environments}
        onAddEnvironment={handleAddEnvironment}
        readyState={readyState}
        sendMessage={sendMessage}
      />
    </>
  )
}
