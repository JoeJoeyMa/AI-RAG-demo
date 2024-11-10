import React, { useState, useRef } from "react"
import {
  Button,
  Input,
  Checkbox,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import EnterpriseList from "@/components/EnterpriseList"
import { message } from "@/components/Message"
import { useTranslation } from "react-i18next"
import { jsonStringify } from "@/utils"
import { login } from "@/service/api"

type LoginModalProps = {
  onLoginSuccess: () => void
}

export default function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("enterprise")
  const [rememberMe, setRememberMe] = useState(false)
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")

  const loginData = useRef({
    account: "",
    password: "",
    organizationId: 0,
    enterpriseName: "",
  })

  const toggleVisibility = () => setIsVisible(!isVisible)

  const handleLogin = async () => {
    const trimmedAccount = account.trim()
    const trimmedPassword = password.trim()

    if (!trimmedAccount) {
      return message.error(t("username_required"))
    }

    if (!trimmedPassword) {
      return message.error(t("password_required"))
    }

    if (!loginData.current.organizationId) {
      return message.error(t("organization_id_required"))
    }

    loginData.current.account = trimmedAccount
    loginData.current.password = trimmedPassword

    setLoginLoading(true)

    try {
      const res = await login(loginData.current)

      if (res === "has token") {
        if (rememberMe) {
          localStorage.setItem("loginData", jsonStringify(loginData.current))
        } else {
          localStorage.removeItem("loginData")
        }
        onLoginSuccess()
      } else {
        message.error(t("login_failed"))
      }
    } catch (error) {
      console.error("登录错误:", error)
      message.error(t("login_error"))
    } finally {
      setLoginLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "account") {
      setAccount(value)
    } else if (name === "password") {
      setPassword(value)
    }
  }

  const handleRememberMeChange = (isSelected) => {
    setRememberMe(isSelected)
  }

  return (
    <div className='flex w-full flex-col gap-4 p-4'>
      <ModalHeader className='flex flex-col gap-1'>{t("login_to_mobenai")}</ModalHeader>
      <ModalBody>
        <form className='flex flex-col gap-3' onSubmit={(e) => e.preventDefault()}>
          <EnterpriseList loginData={loginData} />
          <Input
            isRequired
            label={t("username")}
            name='account'
            placeholder={t("enter_your_username")}
            type='text'
            variant='bordered'
            onChange={handleInputChange}
            value={account}
          />
          <Input
            isRequired
            endContent={
              <button type='button' onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon className='pointer-events-none text-2xl text-default-400' icon='solar:eye-closed-linear' />
                ) : (
                  <Icon className='pointer-events-none text-2xl text-default-400' icon='solar:eye-bold' />
                )}
              </button>
            }
            label={t("password")}
            name='password'
            placeholder={t("enter_your_password")}
            type={isVisible ? "text" : "password"}
            variant='bordered'
            onChange={handleInputChange}
            value={password}
          />
          <div className='flex items-center justify-between px-1 py-2'>
            <Checkbox name='remember' size='sm' isSelected={rememberMe} onValueChange={handleRememberMeChange}>
              {t("remember_me")}
            </Checkbox>
          </div>
          <Button color='primary' type='submit' onClick={handleLogin} isLoading={loginLoading}>
            {t("login")}
          </Button>
        </form>
      </ModalBody>
    </div>
  )
}
