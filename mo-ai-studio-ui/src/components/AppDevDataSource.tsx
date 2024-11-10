import React, { useState, useEffect } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Pagination,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { useAsyncList } from "@react-stately/data"
import { queryModels, createModel, updateModel, deleteModel, queryModelProperties } from "@/service/model"
import { message } from "@/components/Message"
import PropertyTable from "@/components/AppDevModelProperties"
import MagicNameGenerator from "@/components/MagicNameGenerator"
import ModelDataTable from "@/components/AppDevModelDataTable"
import { sleep } from "@/utils"

export default function ModelManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [filterValue, setFilterValue] = useState("")
  const [page, setPage] = useState(1)
  const rowsPerPage = 10
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalMode, setModalMode] = useState("create")
  const [currentModel, setCurrentModel] = useState(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [nameError, setNameError] = useState("")
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false)
  const [currentProperties, setCurrentProperties] = useState([])
  const [isMagicNameModalOpen, setIsMagicNameModalOpen] = useState(false)
  const [magicNameTarget, setMagicNameTarget] = useState("")
  const [isDataModalOpen, setIsDataModalOpen] = useState(false)

  const list = useAsyncList({
    async load({ signal }) {
      await sleep(300)
      try {
        setIsLoading(true)
        const data = await queryModels()
        setIsLoading(false)
        return { items: data.data, count: data.total }
      } catch (error) {
        setIsLoading(false)
        message.error("加载模型列表失败")
        return { items: [], count: 0 }
      }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column]
          let second = b[sortDescriptor.column]
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1
          if (sortDescriptor.direction === "descending") {
            cmp *= -1
          }
          return cmp
        }),
      }
    },
  })

  useEffect(() => {
    list.reload()
  }, [page])

  const filteredItems = React.useMemo(() => {
    return list.items.filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase()))
  }, [list.items, filterValue])

  const pages = Math.ceil(list.count / rowsPerPage)

  const handleAdd = () => {
    setModalMode("create")
    setFormData({ name: "", description: "" })
    setNameError("")
    onOpen()
  }

  const handleEdit = (model) => {
    setModalMode("edit")
    setCurrentModel(model)
    setFormData({ name: model.name, description: model.description })
    setNameError("")
    onOpen()
  }

  const handleDelete = async (model) => {
    try {
      await deleteModel(model.id)
      message.success("删除模型成功")
      list.reload()
    } catch (error) {
      message.error("删除模型失败")
    }
  }

  const validateName = (name) => {
    if (!name) {
      setNameError("名称不能为空")
      return false
    }
    if (!/^[a-z][a-z_]*[a-z]$/.test(name)) {
      setNameError("名称必须是英文小写、下划线（_），首尾必须为英文")
      return false
    }
    setNameError("")
    return true
  }

  const handleSubmit = async () => {
    if (!validateName(formData.name)) {
      return
    }
    try {
      if (modalMode === "create") {
        await createModel(formData)
        message.success("创建模型成功")
      } else {
        await updateModel(currentModel.id, formData)
        message.success("更新模型成功")
      }
      onClose()
      list.reload()
    } catch (error) {
      message.error(modalMode === "create" ? "创建模型失败" : "更新模型失败")
    }
  }

  const handleViewProperties = async (model) => {
    try {
      const properties = await queryModelProperties(model.id)
      setCurrentProperties(properties.data.filter((prop) => !prop.isSystem))
      setCurrentModel(model)
      setIsPropertyModalOpen(true)
    } catch (error) {
      console.error(error)
      message.error("加载属性失败")
    }
  }

  const handleMagicName = (target) => {
    setMagicNameTarget(target)
    setIsMagicNameModalOpen(true)
  }

  const handleMagicNameGenerated = (generatedName) => {
    setFormData({ ...formData, [magicNameTarget]: generatedName })
    setIsMagicNameModalOpen(false)
  }

  const handleViewData = (model) => {
    setCurrentModel(model)
    setIsDataModalOpen(true)
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <Input
          isClearable
          className='w-full sm:max-w-[44%]'
          placeholder='搜索模型...'
          startContent={<Icon icon='mdi:magnify' />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />
        <Button color='primary' onPress={handleAdd}>
          添加模型
        </Button>
      </div>

      <Table
        aria-label='模型列表'
        bottomContent={
          pages > 0 ? (
            <div className='flex w-full justify-center'>
              <Pagination
                isCompact
                showControls
                showShadow
                color='primary'
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
        classNames={{
          wrapper: "min-h-[50vh]",
        }}
      >
        <TableHeader>
          <TableColumn key='name'>名称</TableColumn>
          <TableColumn key='description'>描述</TableColumn>
          <TableColumn key='actions'>操作</TableColumn>
        </TableHeader>
        <TableBody items={filteredItems} isLoading={isLoading} loadingContent={<Spinner label='加载中...' />}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <div className='flex gap-2'>
                  <Button size='sm' isIconOnly onPress={() => handleViewProperties(item)}>
                    <Icon icon='mdi:eye' />
                  </Button>
                  <Button size='sm' isIconOnly onPress={() => handleEdit(item)}>
                    <Icon icon='mdi:pencil' />
                  </Button>
                  <Button size='sm' isIconOnly color='danger' onPress={() => handleDelete(item)}>
                    <Icon icon='mdi:delete' />
                  </Button>
                  <Button size='sm' isIconOnly color='secondary' onPress={() => handleViewData(item)}>
                    <Icon icon='mdi:table' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{modalMode === "create" ? "创建模型" : "编辑模型"}</ModalHeader>
              <ModalBody>
                <div className='flex items-center gap-2'>
                  <Input
                    label='名称'
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      validateName(e.target.value)
                    }}
                    errorMessage={nameError}
                    isInvalid={!!nameError}
                  />
                  <Button isIconOnly onPress={() => handleMagicName("name")}>
                    <Icon icon='mdi:magic-wand' />
                  </Button>
                </div>
                <div className='flex items-center gap-2'>
                  <Input
                    label='描述'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <Button isIconOnly onPress={() => handleMagicName("description")}>
                    <Icon icon='mdi:magic-wand' />
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  取消
                </Button>
                <Button color='primary' onPress={handleSubmit}>
                  确定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isPropertyModalOpen} onClose={() => setIsPropertyModalOpen(false)} size='full'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>模型属性</ModalHeader>
              <ModalBody>
                <PropertyTable
                  properties={currentProperties}
                  modelId={currentModel?.id}
                  onPropertiesChange={() => handleViewProperties(currentModel)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onPress={onClose}>
                  关闭
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isMagicNameModalOpen} onClose={() => setIsMagicNameModalOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>魔法名称生成器</ModalHeader>
              <ModalBody>
                <MagicNameGenerator onGenerated={handleMagicNameGenerated} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isDataModalOpen} onClose={() => setIsDataModalOpen(false)} size='full'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>模型数据</ModalHeader>
              <ModalBody>
                <ModelDataTable model={currentModel} modelId={currentModel?.id} modelName={currentModel?.name} />
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onPress={onClose}>
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
