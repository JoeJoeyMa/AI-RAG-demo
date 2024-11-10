import React, { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react"
import { DatePicker } from "@nextui-org/react"
import { now, getLocalTimeZone } from "@internationalized/date"
import { queryRamAccount, addProjectMember } from "@/service/api"

interface AssignMemberModalProps {
  project: {
    id: string
  }
  onAssign: () => void
  children: React.ReactNode
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

const AssignMemberModal: React.FC<AssignMemberModalProps> = ({ project, onAssign, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ramAccounts, setRamAccounts] = useState([])
  const [assignMemberData, setAssignMemberData] = useState({ ramUserId: "", role: "", startTime: "", endTime: "" })

  useEffect(() => {
    const fetchRamAccounts = async () => {
      try {
        const res = await queryRamAccount()
        setRamAccounts(res.data)
      } catch (error) {
        console.error("获取RAM账户失败", error)
      }
    }

    if (isOpen) {
      fetchRamAccounts()
    }
  }, [isOpen])

  const handleAssignMember = async () => {
    try {
      const ra = ramAccounts.find((ra) => ra.id === assignMemberData.ramUserId)
      await addProjectMember({
        ...assignMemberData,
        name: ra.name,
        projectId: project.id,
      })
      onClose()
      onAssign()
    } catch (error) {
      console.error("分配成员失败", error)
    }
  }

  const formatDate = (date) => {
    if (!date) return ""
    const zonedDate = date.toDate(getLocalTimeZone())
    return zonedDate.toISOString().replace("T", " ").slice(0, 19)
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>分配成员</ModalHeader>
          <ModalBody>
            <Select
              label='选择成员'
              placeholder='请选择成员'
              selectedKeys={assignMemberData.ramUserId ? [assignMemberData.ramUserId] : []}
              onChange={(e) => setAssignMemberData({ ...assignMemberData, ramUserId: e.target.value })}
            >
              {ramAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              label='智能体'
              placeholder='请选择智能体'
              selectedKeys={assignMemberData.role ? [assignMemberData.role] : []}
              onChange={(e) => setAssignMemberData({ ...assignMemberData, role: e.target.value })}
            >
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </Select>
            <DatePicker
              label='开始时间'
              placeholder='选择开始时间'
              defaultValue={now(getLocalTimeZone())}
              onChange={(date) =>
                setAssignMemberData({
                  ...assignMemberData,
                  startTime: formatDate(date),
                })
              }
            />
            <DatePicker
              label='结束时间'
              placeholder='选择结束时间'
              defaultValue={now(getLocalTimeZone())}
              onChange={(date) =>
                setAssignMemberData({
                  ...assignMemberData,
                  endTime: formatDate(date),
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onClose}>
              取消
            </Button>
            <Button color='primary' onPress={handleAssignMember}>
              分配
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AssignMemberModal
