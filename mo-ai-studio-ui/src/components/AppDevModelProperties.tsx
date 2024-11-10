import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Chip,
  Textarea,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { deleteModelProperty, createModelProperty, updateModelProperty } from "@/service/model"
import { message } from "@/components/Message"
import MagicNameGenerator from "@/components/MagicNameGenerator"
import MagicSqlGenerator from "@/components/MagicSqlGenerator"
import DefaultValueViewer from "@/components/DefaultValueViewer"

export default function PropertyTable({ modelId, properties, onPropertiesChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [newProperty, setNewProperty] = useState({
    name: "",
    type: "",
    uiType: "",
    description: "",
    required: false,
    defaultValue: "",
    code: "",
  })
  const [isMagicNameModalOpen, setIsMagicNameModalOpen] = useState(false)
  const [isMagicSqlModalOpen, setIsMagicSqlModalOpen] = useState(false)
  const [magicNameTarget, setMagicNameTarget] = useState("")

  const handleEdit = useCallback((property) => {
    setEditingProperty(property)
    setNewProperty({
      name: property.name,
      type: property.type,
      uiType: property.uiType,
      description: property.description,
      required: property.required,
      defaultValue: property.defaultValue || "",
      code: property.code || "",
      ...property,
    })
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (property) => {
      try {
        await deleteModelProperty(property.id)
        message.success("删除属性成功")
        onPropertiesChange()
      } catch (error) {
        message.error("删除属性失败")
      }
    },
    [onPropertiesChange]
  )

  const handleAddProperty = useCallback(() => {
    setEditingProperty(null)
    setNewProperty({
      name: "",
      type: "",
      uiType: "",
      description: "",
      required: false,
      defaultValue: "",
      code: "",
    })
    setIsModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setEditingProperty(null)
    setNewProperty({ name: "", type: "", uiType: "", description: "", required: false, defaultValue: "", code: "" })
  }, [])

  const handleInputChange = useCallback((key, value) => {
    setNewProperty((prev) => {
      const updatedProperty = { ...prev, [key]: value }

      if (key === "uiType" && value === "select") {
        updatedProperty.type = "json"
      }

      return updatedProperty
    })
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      if (editingProperty) {
        await updateModelProperty(editingProperty.id, {
          modelId,
          ...editingProperty,
          ...newProperty,
        })
        message.success("更新属性成功")
      } else {
        await createModelProperty({
          modelId,
          ...newProperty,
        })
        message.success("添加属性成功")
      }
      handleModalClose()
      onPropertiesChange()
    } catch (error) {
      message.error(editingProperty ? "更新属性失败" : "添加属性失败")
    }
  }, [editingProperty, modelId, newProperty, handleModalClose, onPropertiesChange])

  const handleMagicName = useCallback((target) => {
    setMagicNameTarget(target)
    setIsMagicNameModalOpen(true)
  }, [])

  const handleMagicNameGenerated = useCallback(
    (generatedName) => {
      setNewProperty((prev) => ({ ...prev, [magicNameTarget]: generatedName }))
      setIsMagicNameModalOpen(false)
    },
    [magicNameTarget]
  )

  const handleMagicSql = useCallback(() => {
    setIsMagicSqlModalOpen(true)
  }, [])

  const handleMagicSqlGenerated = useCallback((generatedSql) => {
    setNewProperty((prev) => ({ ...prev, defaultValue: generatedSql }))
    setIsMagicSqlModalOpen(false)
  }, [])

  const typeOptions = useMemo(
    () => [
      { key: "integer", value: "整数", icon: "mdi:numeric", color: "primary" },
      { key: "long", value: "长整数", icon: "mdi:numeric", color: "secondary" },
      { key: "float", value: "浮点数", icon: "mdi:decimal", color: "success" },
      { key: "double", value: "双精度浮点数", icon: "mdi:decimal", color: "warning" },
      { key: "text", value: "文本", icon: "mdi:text", color: "danger" },
      { key: "boolean", value: "布尔值", icon: "mdi:toggle-switch", color: "primary" },
      { key: "date", value: "日期", icon: "mdi:calendar", color: "secondary" },
      { key: "datetime", value: "日期时间", icon: "mdi:calendar-clock", color: "success" },
      { key: "json", value: "JSON", icon: "mdi:code-json", color: "warning" },
    ],
    []
  )

  const uiTypeOptions = useMemo(
    () => [
      { key: "default", value: "默认", icon: "mdi:form-textbox", type: "text", color: "default" },
      { key: "email", value: "邮箱", icon: "mdi:email", type: "text", color: "primary" },
      { key: "phone", value: "手机号", icon: "mdi:phone", type: "text", color: "secondary" },
      { key: "url", value: "网址", icon: "mdi:web", type: "text", color: "success" },
      { key: "address", value: "地址", icon: "mdi:map-marker", type: "text", color: "warning" },
      { key: "select", value: "选项", icon: "mdi:form-select", type: "json", color: "danger" },
      { key: "radio", value: "单选", icon: "mdi:radiobox-marked", type: "text", color: "primary" },
      { key: "checkbox", value: "多选", icon: "mdi:checkbox-marked", type: "text", color: "secondary" },
      { key: "textarea", value: "多行文本", icon: "mdi:form-textarea", type: "text", color: "success" },
      { key: "password", value: "密码", icon: "mdi:form-textbox-password", type: "text", color: "warning" },
      { key: "file", value: "文件上传", icon: "mdi:file-upload", type: "text", color: "danger" },
      { key: "image", value: "图片上传", icon: "mdi:image", type: "text", color: "primary" },
      { key: "slider", value: "滑块", icon: "mdi:gesture-swipe-horizontal", type: "integer", color: "secondary" },
      { key: "switch", value: "开关", icon: "mdi:toggle-switch", type: "boolean", color: "success" },
      { key: "rate", value: "评分", icon: "mdi:star", type: "integer", color: "warning" },
      { key: "datepicker", value: "日期选择", icon: "mdi:calendar", type: "date", color: "primary" },
    ],
    []
  )

  useEffect(() => {
    const selectedUiType = uiTypeOptions.find((option) => option.key === newProperty.uiType)
    if (selectedUiType) {
      setNewProperty((prev) => ({ ...prev, type: selectedUiType.type }))
    }
  }, [newProperty.uiType, uiTypeOptions])

  const renderTableBody = useCallback(
    () => (
      <TableBody items={properties}>
        {(item) => (
          <TableRow key={item.id}>
            <TableCell className='whitespace-normal'>{item.name}</TableCell>
            <TableCell>
              <Chip
                variant='faded'
                color={typeOptions.find((option) => option.key === item.type)?.color || "default"}
                startContent={
                  <Icon icon={typeOptions.find((option) => option.key === item.type)?.icon || "mdi:help-circle"} />
                }
              >
                {item.type}
              </Chip>
            </TableCell>
            <TableCell>
              <Chip
                variant='faded'
                color={uiTypeOptions.find((option) => option.key === item.uiType)?.color || "default"}
                startContent={
                  <Icon icon={uiTypeOptions.find((option) => option.key === item.uiType)?.icon || "mdi:help-circle"} />
                }
              >
                {item.uiType}
              </Chip>
            </TableCell>
            <TableCell>{item.required ? "是" : "否"}</TableCell>
            <TableCell className='whitespace-normal'>{item.description}</TableCell>
            <TableCell>
              <DefaultValueViewer value={item.defaultValue} />
            </TableCell>
            <TableCell className='whitespace-normal'>{item.code}</TableCell>
            <TableCell>
              <div className='flex gap-2'>
                <Button size='sm' isIconOnly onPress={() => handleEdit(item)}>
                  <Icon icon='mdi:pencil' />
                </Button>
                <Button size='sm' isIconOnly color='danger' onPress={() => handleDelete(item)}>
                  <Icon icon='mdi:delete' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    ),
    [properties, handleEdit, handleDelete, typeOptions, uiTypeOptions]
  )

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Button color='primary' onPress={handleAddProperty}>
          添加属性
        </Button>
      </div>
      <Table
        isHeaderSticky
        aria-label='属性列表'
        classNames={{
          wrapper: "max-h-[400px] overflow-y-auto",
          table: "min-w-full",
        }}
      >
        <TableHeader>
          <TableColumn key='name' className='whitespace-normal'>
            名称
          </TableColumn>
          <TableColumn key='type'>类型</TableColumn>
          <TableColumn key='uiType'>UI类型</TableColumn>
          <TableColumn key='required'>是否必填</TableColumn>
          <TableColumn key='description' className='whitespace-normal'>
            描述
          </TableColumn>
          <TableColumn key='defaultValue'>默认值</TableColumn>
          <TableColumn key='code' className='whitespace-normal'>
            代码
          </TableColumn>
          <TableColumn key='actions'>操作</TableColumn>
        </TableHeader>
        {renderTableBody()}
      </Table>

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <ModalContent>
          <ModalHeader>{editingProperty ? "编辑属性" : "添加新属性"}</ModalHeader>
          <ModalBody>
            <div className='flex items-center gap-2'>
              <Input
                label='名称'
                placeholder='输入属性名称'
                value={newProperty.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <Button isIconOnly onPress={() => handleMagicName("name")}>
                <Icon icon='mdi:magic-wand' />
              </Button>
            </div>
            {!editingProperty && (
              <Select
                label='UI类型'
                placeholder='选择UI类型'
                selectedKeys={newProperty.uiType ? [newProperty.uiType] : []}
                onChange={(e) => handleInputChange("uiType", e.target.value)}
              >
                {uiTypeOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key} textValue={option.value}>
                    <Chip variant='faded' color={option.color} startContent={<Icon icon={option.icon} />}>
                      {option.value}
                    </Chip>
                  </SelectItem>
                ))}
              </Select>
            )}
            {!editingProperty && (
              <Select
                label='类型'
                placeholder='选择属性类型'
                selectedKeys={newProperty.type ? [newProperty.type] : []}
                onChange={(e) => handleInputChange("type", e.target.value)}
                isDisabled={newProperty.uiType === "select"}
              >
                {typeOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key} textValue={option.value}>
                    <Chip variant='faded' color={option.color} startContent={<Icon icon={option.icon} />}>
                      {option.value}
                    </Chip>
                  </SelectItem>
                ))}
              </Select>
            )}

            <div className='flex items-center gap-2'>
              <Input
                label='描述'
                placeholder='输入属性描述'
                value={newProperty.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
            <Checkbox isSelected={newProperty.required} onValueChange={(value) => handleInputChange("required", value)}>
              是否必填
            </Checkbox>
            <div className='flex items-center gap-2'>
              <Textarea
                label='默认值'
                placeholder='输入SQL表达式作为默认值'
                value={newProperty.defaultValue}
                onChange={(e) => handleInputChange("defaultValue", e.target.value)}
              />
              <Button isIconOnly onPress={handleMagicSql}>
                <Icon icon='mdi:magic-wand' />
              </Button>
            </div>
            <Textarea
              label='代码'
              placeholder='输入属性相关代码'
              value={newProperty.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={handleModalClose}>
              取消
            </Button>
            <Button color='primary' onPress={handleSubmit}>
              {editingProperty ? "更新" : "添加"}
            </Button>
          </ModalFooter>
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

      <Modal isOpen={isMagicSqlModalOpen} onClose={() => setIsMagicSqlModalOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>魔法SQL生成器</ModalHeader>
              <ModalBody>
                <MagicSqlGenerator onGenerated={handleMagicSqlGenerated} propertyType={newProperty.type} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
