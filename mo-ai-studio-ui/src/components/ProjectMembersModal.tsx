import React, { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Button,
  Spinner,
} from "@nextui-org/react"
import { queryProjectMembers } from "@/service/api"

interface ProjectMembersModalProps {
  projectId: string
}

const roleOptions = [
  { value: "DEVOPS_ENGINEER", label: "运维工程师" },
  { value: "BUSINESS_ANALYST", label: "业务分析师" },
  { value: "ARCHITECT", label: "架构师" },
  { value: "PROJECT_MANAGER", label: "项目经理" },
  { value: "DATABASE_ADMINISTRATOR", label: "数据库管理员" },
  { value: "DEVELOPER", label: "开发人员" },
  { value: "CONSULTANT", label: "顾问" },
  { value: "TESTER", label: "测试人员" },
  { value: "DESIGNER", label: "设计师" },
]

const ProjectMembersModal: React.FC<ProjectMembersModalProps> = ({ projectId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [projectMembers, setProjectMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjectMembers = async () => {
      setIsLoading(true)
      try {
        const res = await queryProjectMembers({ projectId })
        setIsLoading(false)
        setProjectMembers(res.data)
      } catch (error) {
        console.error("查询成员失败", error)
      } finally {
      }
    }

    if (isOpen) {
      fetchProjectMembers()
    }
  }, [isOpen, projectId])

  return (
    <>
      <Button onPress={onOpen} size='sm'>
        查询
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalContent>
          <ModalHeader>项目成员</ModalHeader>
          <ModalBody>
            <Table
              aria-label='项目成员列表'
              isHeaderSticky
              classNames={{
                wrapper: "max-h-[400px]",
              }}
            >
              <TableHeader>
                <TableColumn>成员名称</TableColumn>
                <TableColumn>智能体</TableColumn>
                <TableColumn>开始时间</TableColumn>
                <TableColumn>结束时间</TableColumn>
              </TableHeader>
              <TableBody items={projectMembers} isLoading={isLoading} loadingContent={<Spinner label='Loading...' />}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{roleOptions.find((role) => role.value === item.role)?.label || item.role}</TableCell>
                    <TableCell>{item.startTime}</TableCell>
                    <TableCell>{item.endTime}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProjectMembersModal
