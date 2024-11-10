import React, { useState, useEffect } from "react"
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
  useDisclosure,
  Input,
  Card,
  CardHeader,
  CardBody,
  Spinner,
} from "@nextui-org/react"
import { PlusIcon } from "lucide-react"
import { queryTenants, createTenant, deleteTenant } from "@/service/api"
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll"
import { useAsyncList } from "@react-stately/data"

const TenantsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newTenantName, setNewTenantName] = useState("")

  const list = useAsyncList({
    async load({ signal, cursor }) {
      if (cursor) {
        setIsLoading(false)
      }

      const response = await queryTenants({ cursor })
      setHasMore(response.hasMore)

      return {
        items: response.data,
        cursor: response.nextCursor,
      }
    },
  })

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  })

  useEffect(() => {
    setIsLoading(false)
  }, [list.items])

  const handleCreateTenant = async () => {
    try {
      await createTenant({ name: newTenantName })
      onClose()
      setNewTenantName("")
      list.reload()
    } catch (error) {
      console.error("Failed to create tenant:", error)
    }
  }

  const handleDeleteTenant = async (id: string) => {
    try {
      await deleteTenant(id)
      list.reload()
    } catch (error) {
      console.error("Failed to delete tenant:", error)
    }
  }

  const columns = [
    { name: "名称", uid: "name" },
    { name: "操作", uid: "actions" },
  ]

  const renderCell = (tenant, columnKey) => {
    switch (columnKey) {
      case "name":
        return tenant.name
      case "actions":
        return (
          <Button color='danger' variant='light' onPress={() => handleDeleteTenant(tenant.id)}>
            删除
          </Button>
        )
      default:
        return tenant[columnKey]
    }
  }

  return (
    <div className='p-8 h-full'>
      <Card className='w-full h-full'>
        <CardHeader className='flex justify-between'>
          <h4 className='text-2xl font-bold'>租户管理</h4>
          <Button color='primary' endContent={<PlusIcon />} onPress={onOpen}>
            创建租户
          </Button>
        </CardHeader>
        <CardBody>
          <Table
            isHeaderSticky
            aria-label='租户列表'
            className='w-full'
            baseRef={scrollerRef}
            bottomContent={
              hasMore ? (
                <div className='flex w-full justify-center'>
                  <Spinner ref={loaderRef} color='primary' />
                </div>
              ) : null
            }
            classNames={{
              base: "max-h-[600px] overflow-scroll",
              table: "min-h-[400px]",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={list.items} isLoading={isLoading} loadingContent={<Spinner label='加载中...' />}>
              {(item) => (
                <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>创建租户</ModalHeader>
          <ModalBody>
            <Input
              label='租户名称'
              placeholder='请输入租户名称'
              value={newTenantName}
              onChange={(e) => setNewTenantName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onClose}>
              取消
            </Button>
            <Button color='primary' onPress={handleCreateTenant}>
              创建
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default TenantsPage
