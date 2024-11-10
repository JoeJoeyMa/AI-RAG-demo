import React from "react"
import { Divider, Chip, Link, Input, Button, Image } from "@nextui-org/react"
import Logo from "./Logo"
import wechatimg from "../../public/assets/wechat.jpg"
import { useTranslation } from "react-i18next"

const Footer = () => {
  const { t } = useTranslation()

  const footerNavigation = {
    resources: [
      { name: t("juejin_blog"), href: "https://juejin.cn/column/7379826188749668393" },
      { name: t("ant_design"), href: "https://ant.design/index-cn" },
      { name: t("mui"), href: "https://v4.mui.com/zh/" },
      { name: t("css_guide"), href: "https://www.runoob.com/css/css-tutorial.html" },
      { name: t("react_guide"), href: "https://react.dev/" },
    ],
    cooperation: [
      { name: t("sv_tech_review"), href: "https://www.svtrai.com" },
      { name: t("microsoft_cloud"), href: "https://ai.azure.com/" },
      { name: t("aws_cloud"), href: "https://aws.amazon.com/" },
      { name: t("aliyun"), href: "https://www.aliyun.com/" },
    ],
    aboutUs: [
      { name: t("startup_story"), href: "#" },
      { name: t("latest_report"), href: "#" },
    ],
  }

  const renderList = React.useCallback(
    ({ title, items }) => (
      <div className='mb-8 sm:mb-0'>
        <h3 className='text-small font-semibold text-default-600'>{title}</h3>
        <ul className='mt-4 space-y-2 sm:mt-6 sm:space-y-4'>
          {items.map((item) => (
            <li key={item.name}>
              <Link className='text-default-400' href={item.href} size='sm' isExternal>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ),
    []
  )

  return (
    <footer className='flex w-full min-h-[620px] flex-col bg-[#0f0f0f] text-white'>
      <div className='mx-auto w-full max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-24'>
        <div className='lg:grid lg:grid-cols-3 lg:gap-8'>
          <div className='space-y-8 md:pr-8'>
            <div className='flex items-center justify-start'>
              <Logo />
              <span className='text-medium font-medium ml-2'>{t("company_name")}</span>
            </div>
            <Chip className='border-none px-0 text-default-500' color='success' variant='dot'>
              {t("beta_notice")}
            </Chip>
            <Image isBlurred width={200} src={wechatimg} alt='企业微信二维码' className='max-w-full h-auto' />
          </div>
          <div className='mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:mt-0'>
            <div className='sm:grid sm:grid-cols-2 sm:gap-8'>
              <div>{renderList({ title: t("resources"), items: footerNavigation.resources })}</div>
              <div className='mt-8 sm:mt-0'>{renderList({ title: t("cooperation"), items: footerNavigation.cooperation })}</div>
            </div>
            <div className='sm:grid sm:grid-cols-2 sm:gap-8'>
              <div>{renderList({ title: t("about_us"), items: footerNavigation.aboutUs })}</div>
            </div>
          </div>
        </div>

        <Divider className='my-8' />

        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-8'>
          <p className='text-center text-tiny text-default-400 sm:text-start'>
            &copy; 2024 {t("company_full_name")} Inc. {t("all_rights_reserved")}
          </p>
          <Link
            href='https://beian.miit.gov.cn/#/Integrated/recordQuery'
            target='_blank'
            className='text-tiny text-default-400 text-center sm:text-start'
          >
            {t("icp_number")}
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
