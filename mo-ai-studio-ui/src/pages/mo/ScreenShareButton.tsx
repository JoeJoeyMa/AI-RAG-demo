import React, { useState, useEffect } from "react"
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Tooltip,
  ScrollShadow,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { message } from "@/components/Message"
import { useTranslation } from "react-i18next"

type ScreenSource = {
  id: string
  name: string
  thumbnail: string
  type: "screen" | "window"
}

interface ScreenShareButtonProps {
  isLoading: boolean
  onScreenSourceSelect: (sourceId: string) => void
}

const ScreenShareButton: React.FC<ScreenShareButtonProps> = ({ isLoading, onScreenSourceSelect }) => {
  const [screenSources, setScreenSources] = useState<ScreenSource[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    initScreenSources()
  }, [])

  const initScreenSources = async () => {
    try {
      const sources = await window.electronAPI.screenShare.getSources()
      if (Array.isArray(sources) && sources.length > 0) {
        const typedSources: ScreenSource[] = sources.map((source) => ({
          ...source,
          type: source.name.toLowerCase().includes("screen") ? "screen" : "window",
        }))
        setScreenSources(typedSources)
      } else {
        message.error(t("no_screen_sources"))
      }
    } catch (error) {
      console.error(t("error_getting_screen_sources"), error)
      message.error(`${t("failed_to_get_screen_sources")}: ${error.message || t("unknown_error")}`)
    }
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isDisabled={isLoading}
          size='sm'
          startContent={<Icon className='text-default-500' icon='mdi:monitor-screenshot' width={18} />}
          variant='flat'
        >
          {t("share_screen")}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label={t("screen_share_options")}
        onAction={(key) => onScreenSourceSelect(key as string)}
        items={screenSources}
      >
        <DropdownSection className='min-h-20' title={t("screens")}>
          {screenSources
            .filter((item) => item.name.includes(t("screen")))
            .map((item) => (
              <DropdownItem key={item.id}>
                <div className='flex items-center gap-2'>
                  <img src={item.thumbnail} alt={item.name} className='w-12 h-12 object-cover' />
                  <span>{item.name}</span>
                </div>
              </DropdownItem>
            ))}
        </DropdownSection>

        <DropdownSection className='max-h-96 overflow-auto' title={t("windows")}>
          {screenSources
            .filter((item) => !item.name.includes(t("screen")))
            .map((item) => (
              <DropdownItem key={item.id}>
                <div className='flex items-center gap-2'>
                  <img src={item.thumbnail} alt={item.name} className='w-12 h-12 object-cover' />
                  <span>{item.name}</span>
                </div>
              </DropdownItem>
            ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ScreenShareButton
