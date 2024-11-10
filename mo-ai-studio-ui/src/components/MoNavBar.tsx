import React, { useState, useEffect } from "react"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@nextui-org/react"
import { ChevronDown, Smartphone, Database, CreditCard, Cloud, Server } from "lucide-react"
import Logo from "./Logo"
import { Link as RouterLink, useLocation } from "react-router-dom"
import LearnMoreModal from "./LearnMoreModal"
import { useTranslation } from "react-i18next"
import languageIcon from "../../public/assets/i18n-copy.png" //假设你已经有这个图标
export default function MoNavBar() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.pathname)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { i18n, t } = useTranslation()
  useEffect(() => {
    setActiveTab(location.pathname)
  }, [location])
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }
  const icons = {
    chevron: <ChevronDown size={16} />,
    smartphone: <Smartphone className='text-primary' size={30} />,
    database: <Database className='text-success' size={30} />,
    creditCard: <CreditCard className='text-warning' size={30} />,
    cloud: <Cloud className='text-secondary' size={30} />,
    server: <Server className='text-danger' size={30} />,
  }
  return (
    <>
      <Navbar>
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
        <NavbarContent className='hidden sm:flex gap-4' justify='center'>
          <NavbarItem isActive={activeTab === "/"}>
            <Link
              underline={activeTab === "/" ? "always" : "none"}
              color={activeTab === "/" ? "primary" : "foreground"}
              href='/'
              aria-current='page'
            >
              {t("product")}
            </Link>
          </NavbarItem>
          <NavbarItem isActive={activeTab === "/price"}>
            <Link
              underline={activeTab === "/price" ? "always" : "none"}
              color={activeTab === "/price" ? "primary" : "foreground"}
              href='/price'
            >
              {t("pricing")}
            </Link>
          </NavbarItem>
          <NavbarItem isActive={activeTab === "/docs"}>
            <Link
              underline={activeTab === "/docs" ? "always" : "none"}
              color={activeTab === "/docs" ? "primary" : "foreground"}
              href='https://www.modelbase.com.cn/zh-CN'
            >
              {t("product_docs")}
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify='end' className='gap-1'>
          <NavbarItem>
            <Button
              as={RouterLink}
              to='/login'
              variant={activeTab === "/login" ? "flat" : "bordered"}
              color={activeTab === "/login" ? "primary" : "default"}
              className='transition-all duration-300'
            >
              {t("login")}
            </Button>
          </NavbarItem>
          <NavbarItem className='hidden lg:flex'>
            <Button
              as={RouterLink}
              to='/register'
              variant={activeTab === "/register" ? "flat" : "light"}
              color={activeTab === "/register" ? "primary" : "default"}
              className='transition-all duration-300'
            >
              {t("register")}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant='light' size='sm'>
                  <img src={languageIcon} alt='language' width={24} height={24} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key='en' onClick={() => changeLanguage("en")}>
                  English
                </DropdownItem>
                <DropdownItem key='zh' onClick={() => changeLanguage("zh")}>
                  中文
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <LearnMoreModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  )
}
