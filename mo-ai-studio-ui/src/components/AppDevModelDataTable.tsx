import React, { useState, useEffect, useCallback, useRef } from "react"
import { queryData, insertData, updateData, batchDelete, queryModelProperties } from "@/service/api"
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Checkbox,
  Select,
  SelectItem,
  Textarea,
  Switch,
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
  Spinner,
  DatePicker,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { message } from "@/components/Message"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { now, parseAbsoluteToLocal, parseDate, toZoned } from "@internationalized/date"
import { I18nProvider, useDateFormatter } from "@react-aria/i18n"
import { jsonParse } from "@/utils"

const ModelDataTable = ({ model, modelId, modelName }) => {
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingRecord, setEditingRecord] = useState(null)
  const [modelProperties, setModelProperties] = useState([])
  const modelPropertiesRef = useRef([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  let formatter = useDateFormatter({ dateStyle: "full" })

  useEffect(() => {
    fetchData()
    fetchModelProperties()
  }, [modelId, modelName])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await queryData({
        namespace: model.namespace,
        modelPluralCode: model.pluralCode,
        offset: 0,
        limit: 100,
      })
      setData(response.data)
      if (response.data.length > 0) {
        setColumns(
          Object.keys(response.data[0])
            .filter((key) => key !== "id")
            .filter((column) => {
              const newColumn = modelPropertiesRef.current.filter((prop) => {
                return prop.code === column
              })
              return newColumn.length > 0
            })
        )
      }
    } catch (error) {
      console.error("Failed to fetch model data:", error)
      message.error("获取数据失败")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchModelProperties = async () => {
    try {
      const properties = await queryModelProperties(modelId)
      const processedProperties = properties.data
        .filter((prop) => !prop.isSystem)
        .map((prop) => {
          if (prop.uiType === "select" && prop.defaultValue) {
            try {
              const jsonString = prop.defaultValue.replaceAll("'", "")
              prop.options = jsonParse(jsonString)
            } catch (error) {
              console.error("Error parsing defaultValue for select:", error)
              prop.options = []
            }
          }
          return prop
        })
      setModelProperties(processedProperties)
      modelPropertiesRef.current = processedProperties
      setColumns(processedProperties.map((prop) => prop.name))
    } catch (error) {
      console.error("Failed to fetch model properties:", error)
      message.error("获取模型属性失败")
    }
  }

  const generateValidationSchema = useCallback(() => {
    const schema = {}
    modelProperties.forEach((prop) => {
      let fieldSchema = yup.mixed()
      if (prop.required) {
        fieldSchema = fieldSchema.required(`${prop.name} 是必填项`)
      }
      switch (prop.uiType) {
        case "number":
          fieldSchema = yup.number().typeError("必须是数字")
          break
        case "date":
          fieldSchema = yup.date().typeError("必须是有效的日期")
          break
        case "email":
          fieldSchema = yup.string().email("必须是有效的邮箱地址")
          break
        default:
          fieldSchema = yup.string()
      }
      schema[prop.code] = fieldSchema
    })
    return yup.object().shape(schema)
  }, [modelProperties])

  const validationSchema = generateValidationSchema()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {},
  })

  const handleAdd = () => {
    const initialRecord = {}
    modelProperties.forEach((prop) => {
      initialRecord[prop.code] = ""
    })
    setEditingRecord(initialRecord)
    reset(initialRecord)
    onOpen()
  }

  const handleEdit = (record) => {
    const editRecord = {}
    modelProperties.forEach((prop) => {
      editRecord[prop.code] = record[prop.code] || ""
    })
    setEditingRecord({ ...editRecord, id: record.id })
    reset(editRecord)
    onOpen()
  }

  const handleDelete = async (record) => {
    try {
      await batchDelete({
        namespace: model.namespace,
        modelPluralCode: model.pluralCode,
        data: [record.id],
      })
      message.success("删除成功")
      fetchData()
    } catch (error) {
      console.error("Failed to delete record:", error)
      message.error("删除失败")
    }
  }

  const handleBatchDelete = async () => {
    if (selectedKeys.size === 0) {
      message.warning("请先选择要删除的数据")
      return
    }

    try {
      let _data = []
      if (selectedKeys === "all") {
        _data = data.map((item) => item.id)
      } else {
        _data = Array.from(selectedKeys)
      }
      await batchDelete({
        namespace: model.namespace,
        modelPluralCode: model.pluralCode,
        data: _data,
      })
      message.success("批量删除成功")
      setSelectedKeys(new Set([]))
      fetchData()
    } catch (error) {
      console.error("Failed to batch delete records:", error)
      message.error("批量删除失败")
    }
  }

  const onSubmit = async (formData) => {
    try {
      const submitData = {}
      modelProperties.forEach((prop) => {
        submitData[prop.code] = formData[prop.code]
      })

      if (editingRecord.id) {
        await updateData({
          namespace: model.namespace,
          modelPluralCode: model.pluralCode,
          data: { ...submitData, id: editingRecord.id },
        })
        message.success("更新成功")
      } else {
        await insertData({
          namespace: model.namespace,
          modelPluralCode: model.pluralCode,
          data: submitData,
        })
        message.success("添加成功")
      }
      onClose()
      fetchData()
    } catch (error) {
      console.error("Failed to save record:", error)
      message.error("保存失败")
    }
  }

  const renderFormField = useCallback(
    (prop) => {
      switch (prop.uiType) {
        case "textarea":
          return (
            <Controller
              name={prop.code}
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label={prop.name}
                  errorMessage={errors[prop.code]?.message}
                  isInvalid={!!errors[prop.code]}
                />
              )}
            />
          )
        case "select":
          return (
            <Controller
              name={prop.code}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={prop.name}
                  errorMessage={errors[prop.code]?.message}
                  isInvalid={!!errors[prop.code]}
                >
                  {prop.options &&
                    prop.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </Select>
              )}
            />
          )
        case "checkbox":
          return (
            <Controller
              name={prop.code}
              control={control}
              render={({ field }) => (
                <Checkbox {...field} isSelected={field.value} onValueChange={field.onChange}>
                  {prop.name}
                </Checkbox>
              )}
            />
          )
        case "switch":
          return (
            <Controller
              name={prop.code}
              control={control}
              render={({ field }) => (
                <Switch {...field} isSelected={field.value} onValueChange={field.onChange}>
                  {prop.name}
                </Switch>
              )}
            />
          )
        case "datepicker":
          return (
            <Controller
              name={prop.code}
              control={control}
              render={({ field }) => {
                if (typeof field.value === "string") {
                  field.value = parseAbsoluteToLocal(field.value)
                }
                return (
                  <I18nProvider locale='zh-CN'>
                    <DatePicker
                      {...field}
                      label={prop.name}
                      errorMessage={errors[prop.code]?.message}
                      isInvalid={!!errors[prop.code]}
                      value={field.value ? field.value : now()}
                      onChange={(date) => {
                        field.onChange(date)
                      }}
                    />
                  </I18nProvider>
                )
              }}
            />
          )
        default:
          return (
            <Controller
              name={prop.code}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={prop.name}
                  errorMessage={errors[prop.code]?.message}
                  isInvalid={!!errors[prop.code]}
                />
              )}
            />
          )
      }
    },
    [control, errors]
  )

  const renderTableCell = useCallback(
    (record, col) => {
      if (!record || !col) return null
      const prop = modelProperties.find((p) => p.name === col)
      if (!prop) return record[col]

      switch (prop.uiType) {
        case "checkbox":
        case "switch":
          return record[col] ? "是" : "否"
        case "date":
          return record[col] ? new Date(record[col]).toLocaleDateString() : ""
        case "select":
          const option = prop.options?.find((opt) => opt.value === record[col])
          return option ? option.label : record[col]
        default:
          return record[col]
      }
    },
    [modelProperties]
  )

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Spinner size='lg' />
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Button color='primary' onClick={handleAdd}>
          新增数据
        </Button>
        <Button color='danger' onClick={handleBatchDelete} disabled={selectedKeys.size === 0}>
          批量删除
        </Button>
      </div>
      {data.length === 0 ? (
        <div className='flex justify-center items-center h-64 text-gray-500'>空数据</div>
      ) : (
        <Table
          aria-label='Model Data Table'
          selectionMode='multiple'
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader>
            {columns.map((col) => (
              <TableColumn key={col}>{col}</TableColumn>
            ))}
            <TableColumn>操作</TableColumn>
          </TableHeader>
          <TableBody>
            {data.map((record) => (
              <TableRow key={record.id}>
                {columns.map((col) => (
                  <TableCell key={col}>{renderTableCell(record, col)}</TableCell>
                ))}
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant='light' isIconOnly aria-label='操作'>
                        <Icon icon='mdi:dots-horizontal' width='20' height='20' />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='操作选项'>
                      <DropdownItem key='edit' onClick={() => handleEdit(record)}>
                        <Icon icon='mdi:pencil' className='mr-2' />
                        编辑
                      </DropdownItem>
                      <DropdownItem
                        key='delete'
                        className='text-danger'
                        color='danger'
                        onClick={() => handleDelete(record)}
                      >
                        <Icon icon='mdi:delete' className='mr-2' />
                        删除
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>{editingRecord?.id ? "编辑数据" : "新增数据"}</ModalHeader>
            <ModalBody>
              {modelProperties.map((prop) => (
                <div key={prop.code}>{renderFormField(prop)}</div>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onClick={onClose}>
                取消
              </Button>
              <Button color='primary' type='submit'>
                保存
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ModelDataTable
