
import React, { useState, useEffect } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Chip,
  Spinner,
  Modal,
  Button,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalContent,
} from "@nextui-org/react"
import { apiService, products, orders, pagePay } from "@/service/api"

const statusColorMap = {
  NORMAL: "success",
  ABNORMAL: "danger",
}

const statusTextMap = {
  NORMAL: "正常",
  ABNORMAL: "异常",
}

const ComputeExpenses = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const rowsPerPage = 10

  const [productList, setProductList] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(10)
  const [paymentForm, setPaymentForm] = useState("")

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
  const { isOpen: isPaymentModalOpen, onOpen: onPaymentModalOpen, onClose: onPaymentModalClose } = useDisclosure()

  useEffect(() => {
    fetchData()
    fetchProducts()
  }, [page])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiService.get("/api/compute-accounts", {
        params: {
          limit: rowsPerPage,
          offset: (page - 1) * rowsPerPage,
        },
      })
      setData(response.data.data)
      setTotal(parseInt(response.data.total))
    } catch (error) {
      console.error("获取数据时出错:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await products()
      setProductList(res.data)
      if (res.data.length > 0) {
        setSelectedProduct(res.data[0])
      }
    } catch (error) {
      console.error("获取产品列表失败:", error)
    }
  }

  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey]

    switch (columnKey) {
      case "status":
        return (
          <Chip className='capitalize' color={statusColorMap[cellValue]} size='sm' variant='flat'>
            {statusTextMap[cellValue]}
          </Chip>
        )
      case "totalComputePower":
        return cellValue.toFixed(2)
      default:
        return cellValue
    }
  }

  const bottomContent = React.useMemo(() => {
    return (
      <div className='py-2 px-2 flex justify-between items-center'>
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          page={page}
          total={Math.ceil(total / rowsPerPage)}
          onChange={setPage}
        />
        <span className='text-small text-default-400'>总计 {total} 条</span>
      </div>
    )
  }, [page, total])

  const handleOpenModal = () => {
    setSelectedProduct(productList.length > 0 ? productList[0] : null)
    setQuantity(10)
    onModalOpen()
  }

  const handlePay = async () => {
    if (!selectedProduct) {
      console.error("请选择一个产品")
      return
    }

    try {
      const orderDataRes = await orders({
        productId: selectedProduct.id,
        quantity,
        paymentMethod: "ALIPAY",
      })
      const payDataRes = await pagePay({
        orderId: orderDataRes.id,
        returnUrl: window.location.href,
      })
      setPaymentForm(payDataRes)
      onModalClose()
      onPaymentModalOpen()
    } catch (error) {
      console.error("创建订单或发起支付失败:", error)
    }
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>算力支出</h1>
        <Button color='primary' onClick={handleOpenModal}>
          购买算力
        </Button>
      </div>
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <Spinner size='lg' />
        </div>
      ) : (
        <Table aria-label='算力支出表格' bottomContent={bottomContent} bottomContentPlacement='outside'>
          <TableHeader>
            <TableColumn>组织</TableColumn>
            <TableColumn>总算力</TableColumn>
            <TableColumn>状态</TableColumn>
          </TableHeader>
          <TableBody items={data}>
            {(item) => (
              <TableRow key={item.id}>
                {["organizationId", "totalComputePower", "status"].map((columnKey) => (
                  <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className='text-lg font-semibold'>购买算力</h3>
              </ModalHeader>
              <ModalBody>
                <div className='space-y-4'>
                  {productList.map((product) => (
                    <div
                      key={product.id}
                      className={`p-2 rounded cursor-pointer ${
                        selectedProduct?.id === product.id ? "bg-blue-100" : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <span>
                        每 100{product.name}/{product.price}元
                      </span>
                    </div>
                  ))}
                  <div>
                    <span>购买数量: </span>
                    <Input
                      type='number'
                      min={10}
                      step={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <span> 单位 （100算力/单位）</span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onClick={onClose}>
                  取消
                </Button>
                <Button color='primary' onClick={handlePay}>
                  去支付
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isPaymentModalOpen} onClose={onPaymentModalClose} size='xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className='text-lg font-semibold'>支付</h3>
              </ModalHeader>
              <ModalBody>
                <iframe
                  srcDoc={paymentForm}
                  style={{ width: "100%", height: "600px", border: "none" }}
                  sandbox='allow-forms allow-scripts allow-same-origin allow-popups'
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ComputeExpenses
      