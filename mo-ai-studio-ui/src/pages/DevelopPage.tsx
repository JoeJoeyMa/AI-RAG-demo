import React, { useContext, useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  User,
  Avatar,
  Chip,
  Button,
  ScrollShadow,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Spacer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react"
import Sidebar from "@/components/Sidebar"
import Logo from "@/components/Logo"
import logo from "../../public/assets/logo.png"
import type { SidebarItem } from "@/components/Sidebar"
import { Outlet, useNavigate } from "react-router-dom"
import { UserContext } from "@/context/UserContext"
import PasswordForm from "@/components/PasswordForm"
import LearnMoreModal from "@/components/LearnMoreModal"
import { useDisclosure } from "@nextui-org/react"
import { Upload, X, Loader2 } from "lucide-react"
import { localDB } from "@/utils/localDB"
import { loginOut } from "@/service/auth"

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ value, onChange }) => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      const localUrl = URL.createObjectURL(selectedFile)
      onChange(localUrl)
    }
  }

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    onChange("")
  }

  return (
    <div className='space-y-4'>
      <input
        type='file'
        onChange={handleFileChange}
        disabled={uploading}
        className='hidden'
        ref={fileInputRef}
        accept='image/*'
      />
      <Button onClick={handleButtonClick} disabled={uploading} type='button' variant='outline'>
        <Upload className='mr-2 h-4 w-4' />
        上传
      </Button>
      {value && (
        <div className='relative'>
          <img src={value} alt='已上传的图片' className='max-w-full h-auto rounded-lg' />
          <button
            onClick={handleRemoveFile}
            className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
            type='button'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      )}
    </div>
  )
}

const allSidebarItems: SidebarItem[] = [
  { key: "projects", href: "/develop/projects", icon: "solar:widget-2-outline", title: "我的项目" },
  { key: "expenses", href: "/develop/expenses", icon: "solar:bill-list-outline", title: "算力支出" },
  { key: "tenants", href: "/develop/tenants", icon: "solar:users-group-rounded-outline", title: "企业租户" },
  { key: "accounts", href: "/develop/accounts", icon: "solar:user-outline", title: "企业账户" },
  { key: "roles", href: "/develop/roles", icon: "solar:user-id-outline", title: "智能体管理" }, // 新增的智能体管理菜单项
  { key: "settings", href: "/develop/settings", icon: "solar:settings-outline", title: "企业设置" },
]

export default function App() {
  const { t } = useTranslation()
  const userInfo = useContext(UserContext)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [avatarUrl, setAvatarUrl] = useState(logo)
  const [profileInfo, setProfileInfo] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [isRootAdmin, setIsRootAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedAvatarUrl = localDB.getItem("avatarUrl")
    if (savedAvatarUrl) {
      setAvatarUrl(savedAvatarUrl)
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      setIsAdmin(userInfo.userRoles?.some((role) => role.keyz === "admin") || false)
      setIsRootAdmin(userInfo.organizationId === "1" || false)
    }
  }, [userInfo])

  const sidebarItems = allSidebarItems.filter((item) => {
    if (!isAdmin) return item.key === "projects"
    if (item.key === "tenants" && !isRootAdmin) return false
    return true
  })

  const handleDropdownAction = (key) => {
    if (key === "changePassword") {
      setIsPasswordModalOpen(true)
    } else if (key === "editProfile") {
      setIsProfileModalOpen(true)
    } else if (key === "help_and_feedback") {
      onOpen()
    } else if (key === "logout") {
      handleLogout()
    }
  }

  const handleLogout = async () => {
    await loginOut()
    localStorage.removeItem("model-base-user-token")
    navigate("/")
  }

  const handleAvatarChange = (url) => {
    setAvatarUrl(url)
    localDB.setItem("avatarUrl", url)
  }

  const handleSaveProfile = () => {
    localDB.setItem("profileInfo", profileInfo)
    setIsProfileModalOpen(false)
  }

  const handleProfileInfoChange = (e) => {
    const { name, value } = e.target
    setProfileInfo((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className='h-dvh flex'>
      <div className='relative flex h-full max-w-64 flex-1 flex-col border-r border-divider p-6 bg-slate-950'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 px-2'>
            <Logo />
          </div>
          <div className='flex items-center justify-end'>
            <Dropdown showArrow placement='bottom-start'>
              <DropdownTrigger>
                <Button disableRipple isIconOnly className='-mr-1' radius='full' variant='light'>
                  <Avatar className='h-6 w-6 cursor-pointer' name={userInfo?.name} src={avatarUrl} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label={t("customize_project_style")}
                disabledKeys={["profile"]}
                onAction={handleDropdownAction}
              >
                <DropdownSection showDivider aria-label={t("profile_and_actions")}>
                  <DropdownItem
                    key='profile'
                    isReadOnly
                    className='h-14 gap-2 opacity-100'
                    textValue={t("logged_in_as")}
                  >
                    <User
                      avatarProps={{ size: "sm", imgProps: { className: "transition-none" }, src: avatarUrl }}
                      classNames={{ name: "text-default-600", description: "text-default-500" }}
                      description={userInfo?.userRoles?.[0]?.name || ""}
                      name={userInfo?.name}
                    />
                  </DropdownItem>
                  <DropdownItem key='changePassword'>{t("change_password")}</DropdownItem>
                </DropdownSection>
                <DropdownSection aria-label={t("help_and_feedback")}>
                  <DropdownItem key='help_and_feedback'>{t("help_and_feedback")}</DropdownItem>
                  <DropdownItem key='logout'>{t("logout")}</DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <ScrollShadow className='-mr-6 h-full max-h-full py-6 pr-6'>
          <Sidebar
            defaultSelectedKey='projects'
            iconClassName='group-data-[selected=true]:text-primary-foreground'
            itemClasses={{
              base: "data-[selected=true]:bg-default-200/40 dark:data-[selected=true]:bg-primary-300 data-[hover=true]:bg-default-300/20 dark:data-[hover=true]:bg-default-200/40",
              title: "group-data-[selected=true]:text-primary-foreground",
            }}
            items={sidebarItems}
          />
          <Spacer y={8} />
        </ScrollShadow>
      </div>
      <div className='flex-1 h-full'>
        <Outlet />
      </div>
      <PasswordForm isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      <LearnMoreModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{t("edit_profile")}</ModalHeader>
          <ModalBody>
            <div className='flex flex-col items-center'>
              <Avatar src={avatarUrl} size='lg' />
              <Spacer y={2} />
              <FileUpload value={avatarUrl} onChange={handleAvatarChange} />
            </div>
            <div className='space-y-4'>
              <input
                type='text'
                name='name'
                value={profileInfo.name}
                onChange={handleProfileInfoChange}
                placeholder={t("name")}
                className='w-full p-2 border rounded'
              />
              <input
                type='email'
                name='email'
                value={profileInfo.email}
                onChange={handleProfileInfoChange}
                placeholder={t("email")}
                className='w-full p-2 border rounded'
              />
              <input
                type='tel'
                name='phone'
                value={profileInfo.phone}
                onChange={handleProfileInfoChange}
                placeholder={t("phone")}
                className='w-full p-2 border rounded'
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={handleSaveProfile}>
              {t("save")}
            </Button>
            <Button color='danger' variant='light' onPress={() => setIsProfileModalOpen(false)}>
              {t("cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
