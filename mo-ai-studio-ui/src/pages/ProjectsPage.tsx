import React from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Card,
  CardHeader,
  CardBody,
  Spinner,
} from "@nextui-org/react"
import { ChevronDownIcon, UserPlusIcon, PlusIcon } from "lucide-react"
import { queryMyProject } from "@/service/api"
import { EyeIcon } from "@/Icons/EyeIcon"
import { EditIcon } from "@/Icons/EditIcon"
import DeleteProjectButton from "@/components/DeleteProjectButton"
import ViewProjectModal from "@/components/ViewProjectModal"
import UpdateProjectModal from "@/components/UpdateProjectModal"
import AssignMemberModal from "@/components/AssignMemberModal"
import ProjectMembersModal from "@/components/ProjectMembersModal"
import CreateProjectModal from "@/components/CreateProjectModal"
import ProjectAppsModal from "@/components/ProjectAppsModal"

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
}

export default function App() {
  const [dataSource, setDataSource] = React.useState([])
  const [reload, setReload] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const columns = [
    { name: "名称", uid: "name" },
    { name: "描述", uid: "description" },
    { name: "企业名称", uid: "organizationName" },
    { name: "成员", uid: "members" },
    { name: "应用", uid: "apps" },
    { name: "操作", uid: "actions" },
  ]

  const renderCell = React.useCallback((project, columnKey) => {
    const cellValue = project[columnKey]

    switch (columnKey) {
      case "status":
        return (
          <Chip color={statusColorMap[project.status] || "default"} size='sm' variant='flat'>
            {cellValue}
          </Chip>
        )
      case "members":
        return <ProjectMembersModal projectId={project.id}></ProjectMembersModal>
      case "apps":
        return <ProjectAppsModal projectName={project.name} projectId={project.id}></ProjectAppsModal>
      case "actions":
        return (
          <div className='relative flex gap-2 items-center'>
            <ViewProjectModal project={project}>
              <Tooltip content='查看项目'>
                <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                  <EyeIcon />
                </span>
              </Tooltip>
            </ViewProjectModal>
            <UpdateProjectModal project={project} onUpdate={() => setReload(!reload)}>
              <Tooltip content='更新项目'>
                <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                  <EditIcon />
                </span>
              </Tooltip>
            </UpdateProjectModal>
            <AssignMemberModal project={project} onAssign={() => setReload(!reload)}>
              <Tooltip content='分配成员'>
                <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                  <UserPlusIcon className='w-[17px]' />
                </span>
              </Tooltip>
            </AssignMemberModal>
            <DeleteProjectButton project={project} onDelete={() => setReload(!reload)} />
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  async function fetchData() {
    setIsLoading(true)
    try {
      const res = await queryMyProject({})
      setDataSource(res.data)
    } catch (error) {
      console.error("获取项目列表失败", error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [reload])

  return (
    <div className='p-8 h-full'>
      <Card className='h-full'>
        <CardHeader className='flex justify-between'>
          <h4 className='text-2xl font-bold'>我的项目</h4>
          <CreateProjectModal onCreate={() => setReload(!reload)}></CreateProjectModal>
        </CardHeader>
        <CardBody>
          <Table aria-label='项目列表'>
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={dataSource} isLoading={isLoading} loadingContent={<Spinner label='加载中...' />}>
              {(item) => (
                <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}
