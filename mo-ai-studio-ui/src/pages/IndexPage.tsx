import React from "react"
import { Button, useDisclosure, Card, CardBody } from "@nextui-org/react"
import { Link as RouterLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import LearnMoreModal from "@/components/LearnMoreModal"
import GridPattern from "@/components/GridPattern"
import { cn } from "@/theme/cn"
import GradualSpacing from "@/components/GradualSpacing"
import video from "../../public/assets/home.mp4"

// GitHub icon component
const GitHubIcon = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
  </svg>
)

function IndexPage() {
  const { t } = useTranslation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <div className='container mx-auto px-4 py-12 md:py-24 lg:py-32 md:px-56 lg:px-72 min-h-screen flex flex-col justify-center'>
      <h1 className='text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center md:text-left flex items-center gap-1 flex-wrap'>
        <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 min-w-32'>
          Mo👉
        </span>
        <GradualSpacing text={t("real_ai_engineer")} />
      </h1>
      <p className='text-lg md:text-xl text-gray-400 mb-8 text-center md:text-left'>
        {t("mo_description")}
      </p>
      <p className='text-lg md:text-xl text-gray-400 mb-12 text-center md:text-left'>
        {t("mo_ai_studio_description")}
      </p>
      <div className='flex flex-col sm:flex-row justify-center md:justify-start gap-4'>
        <Button
          variant='bordered'
          onPress={onOpen}
          className='w-full sm:w-auto bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg border-yellow-500'
        >
          {t("learn_more")}
        </Button>
        <Button
          as='a'
          href='https://github.com/mobenai/mo-ai-studio'
          target='_blank'
          rel='noopener noreferrer'
          className='w-full sm:w-auto'
          startContent={<GitHubIcon />}
        >
          {t("download_mo_ai_studio")}
        </Button>
      </div>
      <h2 className='text-3xl font-bold text-center text-white mt-16 mb-8'>{t("see_what_mo_can_do")}</h2>
      <div className='mt-12 space-y-8'>
        <Card className='mt-1'>
          <CardBody>
            <h2 className='text-2xl font-bold mb-4 text-center text-white'>{t("mo_modify_website")}</h2>
            <video
              style={{ width: "100%" }}
              src='https://modelbase-dev-open.oss-cn-shanghai.aliyuncs.com/MO%20%E4%BF%AE%E6%94%B9%E4%BA%86%E5%AE%98%E7%BD%91.mp4'
              type='video/mp4'
              scrolling='no'
              border='0'
              frameborder='no'
              framespacing='0'
              loading='lazy'
              controls
              playsInline
              loop
              muted
              allowFullScreen='true'
            ></video>
          </CardBody>
        </Card>
        <Card className='mt-1'>
          <CardBody>
            <h2 className='text-2xl font-bold mb-4 text-center text-white'>{t("mo_refactor_large_file")}</h2>
            <video
              style={{ width: "100%" }}
              src='https://modelbase-dev-open.oss-cn-shanghai.aliyuncs.com/Mo%20%E9%87%8D%E6%9E%84%20700%E8%A1%8C%E4%BB%A3%E7%A0%81.mp4'
              type='video/mp4'
              scrolling='no'
              border='0'
              frameborder='no'
              framespacing='0'
              loading='lazy'
              controls
              playsInline
              loop
              muted
              allowFullScreen='true'
            ></video>
          </CardBody>
        </Card>
        <Card className='mt-1'>
          <CardBody>
            <h2 className='text-2xl font-bold mb-4 text-center text-white'>{t("mo_generate_i18n")}</h2>
            <video
              style={{ width: "100%" }}
              src='https://modelbase-dev-open.oss-cn-shanghai.aliyuncs.com/Mo%20%E7%BF%BB%E8%AF%91%20i18n.mp4'
              type='video/mp4'
              scrolling='no'
              border='0'
              frameborder='no'
              framespacing='0'
              loading='lazy'
              controls
              playsInline
              loop
              muted
              allowFullScreen='true'
            ></video>
          </CardBody>
        </Card>
      </div>
      <h2 className='text-3xl font-bold text-center text-white mt-16 mb-8'>
        {t("mo_can_do_more")}{" "}
        <Button
          variant='bordered'
          onPress={onOpen}
          className='w-full sm:w-auto bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg border-yellow-500'
        >
          {t("learn_more")}
        </Button>
      </h2>
      <LearnMoreModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <GridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-50%] h-[200%] skew-y-12"
        )}
      />
    </div>
  )
}

export default IndexPage