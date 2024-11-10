import React from "react"
import { Icon } from "@iconify/react"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
  Spacer,
  useDisclosure,
} from "@nextui-org/react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/theme/cn"
import type { ButtonProps } from "@nextui-org/react"
import LearnMoreModal from "../components/LearnMoreModal"
import { useTranslation } from "react-i18next"

export enum TiersEnum {
  Free = "free",
  Enterprise = "enterprise",
}

export type Tier = {
  key: TiersEnum
  title: string
  price: string
  href: string
  description: string
  mostPopular?: boolean
  featured?: boolean
  features: string[]
  buttonText: string
  buttonColor?: ButtonProps["color"]
  buttonVariant: ButtonProps["variant"]
}

export default function PricingPage() {
  const { t, i18n } = useTranslation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const navigate = useNavigate()

  const tiers: Array<Tier> = [
    {
      key: TiersEnum.Free,
      title: t("free"),
      price: t("free_price"),
      href: "/signup",
      featured: false,
      mostPopular: false,
      description: t("free_description"),
      features: [
        t("free_feature_1"),
        t("free_feature_2"),
        t("free_feature_3"),
        t("free_feature_4"),
        t("free_feature_5"),
      ],
      buttonText: t("free_button_text"),
      buttonColor: "success",
      buttonVariant: "flat",
    },
    {
      key: TiersEnum.Enterprise,
      title: t("enterprise"),
      price: t("enterprise_price"),
      href: "#",
      featured: true,
      mostPopular: true,
      description: t("enterprise_description"),
      features: [
        t("enterprise_feature_1"),
        t("enterprise_feature_2"),
        t("enterprise_feature_3"),
        t("enterprise_feature_4"),
        t("enterprise_feature_5"),
        t("enterprise_feature_6"),
        t("enterprise_feature_7"),
      ],
      buttonText: t("enterprise_button_text"),
      buttonColor: "primary",
      buttonVariant: "solid",
    },
  ]

  const handleButtonClick = (tier: Tier) => {
    if (tier.key === TiersEnum.Free) {
      navigate("/signup")
    } else {
      onOpen()
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900 text-gray-100'>
      <div className='max-w-6xl w-full px-4 py-16'>
        <div className='flex max-w-xl mx-auto flex-col text-center mb-16'>
          <h1 className='text-4xl font-medium tracking-tight mt-2'>{t("choose_plan")}</h1>
          <Spacer y={4} />
          <h2 className='text-large text-gray-400'>{t("flexible_options")}</h2>
        </div>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {tiers.map((tier) => (
            <Card
              key={tier.key}
              className={cn("relative p-6", {
                "bg-primary text-white": tier.mostPopular,
                "bg-gray-800": !tier.mostPopular,
              })}
              shadow='lg'
            >
              {tier.mostPopular && (
                <Chip
                  classNames={{
                    base: "absolute top-4 right-4",
                    content: "font-medium",
                  }}
                  color='secondary'
                >
                  {t("most_popular")}
                </Chip>
              )}
              <CardHeader className='flex flex-col items-start gap-2 pb-6'>
                <h2 className='text-2xl font-bold'>{tier.title}</h2>
                <p className='text-lg font-semibold'>{tier.price}</p>
                <p className='text-sm opacity-70'>{tier.description}</p>
              </CardHeader>
              <Divider className='my-4' />
              <CardBody>
                <ul className='space-y-3'>
                  {tier.features.map((feature, index) => (
                    <li key={index} className='flex items-center gap-2'>
                      <Icon icon='ci:check' className='text-green-400' width={20} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter>
                <Button
                  fullWidth
                  color={tier.buttonColor}
                  variant={tier.buttonVariant}
                  className='mt-4'
                  onPress={() => handleButtonClick(tier)}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className='text-center mt-12'>
          <p className='text-gray-400'>
            {t("need_more_info")}
            <Link href='#' color='primary' className='ml-1' onPress={onOpen}>
              {t("contact_expert")}
            </Link>
          </p>
        </div>
      </div>

      <LearnMoreModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  )
}