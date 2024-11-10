import React, { useRef, useState, useEffect } from "react"
import {
  Input,
  Button,
  Spinner,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react"
import { RefreshCw, Smartphone, Tablet, Monitor, Maximize2, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { localDB } from "@/utils/localDB"
import { message } from "@/components/Message"

interface BrowserPreviewProps {
  initialUrl?: string
}

const BrowserPreview: React.FC<BrowserPreviewProps> = ({ initialUrl = "" }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewportWidth, setViewportWidth] = useState<"mobile" | "tablet" | "desktop">(() => {
    const savedViewport = localStorage.getItem("browserPreviewViewport")
    return (savedViewport as "mobile" | "tablet" | "desktop") || "desktop"
  })
  const [showFlash, setShowFlash] = useState(false)
  const [url, setUrl] = useState(initialUrl)
  const [isUrlActive, setIsUrlActive] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [protocol, setProtocol] = useState<"http" | "https">("https")

  useEffect(() => {
    const fetchStartUrl = async () => {
      try {
        const startUrl = localDB.getItem("startUrl")
        if (startUrl) {
          setUrl(startUrl)
          setIsUrlActive(true)
          loadUrl(startUrl)
        } else {
          message.error("无法获取初始 URL，请尝试手动输入")
        }
      } catch (error) {
        console.error("获取初始 URL 失败:", error)
        message.error("获取初始 URL 失败")
      }
    }

    fetchStartUrl()
  }, [])

  useEffect(() => {
    localStorage.setItem("browserPreviewViewport", viewportWidth)
  }, [viewportWidth])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const handleRefresh = () => {
    if (iframeRef.current && isUrlActive) {
      setIsLoading(true)
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }

  const loadUrl = (urlToLoad: string) => {
    setIsLoading(true)
    setIsUrlActive(true)
    setTimeout(() => {
      if (iframeRef.current) {
        const fullUrl = urlToLoad.startsWith("http") ? urlToLoad : `${protocol}://${urlToLoad}`
        iframeRef.current.src = fullUrl
      }
      localStorage.setItem("browserPreviewUrl", urlToLoad)
    }, 300)
  }

  const handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (url) {
      loadUrl(url)
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const getViewportClass = () => {
    switch (viewportWidth) {
      case "mobile":
        return "w-[375px] h-full"
      case "tablet":
        return "w-[768px] h-full"
      case "desktop":
      default:
        return "w-full h-full"
    }
  }

  const handleViewportChange = (newViewport: "mobile" | "tablet" | "desktop") => {
    setViewportWidth(newViewport)
    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 300)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleProtocolChange = (key: string) => {
    setProtocol(key as "http" | "https")
  }

  return (
    <div
      ref={containerRef}
      className='flex flex-col h-[calc(100vh-98px)] border border-slate-800 rounded-lg overflow-hidden'
    >
      <div className='flex items-center bg-slate-950 p-2'>
        <div className='flex space-x-2 mr-4'>
          <div className='w-3 h-3 rounded-full bg-red-500'></div>
          <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
          <div className='w-3 h-3 rounded-full bg-green-500'></div>
        </div>
        <Button isIconOnly size='sm' variant='light' className='mr-2' onPress={handleRefresh}>
          <RefreshCw size={18} />
        </Button>
        <form onSubmit={handleUrlSubmit} className='flex-grow flex items-center'>
          <Dropdown>
            <DropdownTrigger>
              <Button variant='bordered' className='mr-2 h-[40px]'>
                {protocol} <ChevronDown size={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Protocol selection'
              selectionMode='single'
              selectedKeys={[protocol]}
              onSelectionChange={(keys) => handleProtocolChange(Array.from(keys)[0] as string)}
            >
              <DropdownItem key='http'>http</DropdownItem>
              <DropdownItem key='https'>https</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Input
            className='flex-grow'
            size='sm'
            value={url}
            onChange={handleUrlChange}
            placeholder='输入URL并按回车加载'
            startContent={
              <div className='pointer-events-none flex items-center'>
                <span className='text-default-400 text-small'>🔒</span>
              </div>
            }
          />
        </form>
        <ButtonGroup className='ml-2'>
          <Button
            isIconOnly
            size='sm'
            variant={viewportWidth === "mobile" ? "solid" : "light"}
            onPress={() => handleViewportChange("mobile")}
          >
            <Smartphone size={18} />
          </Button>
          <Button
            isIconOnly
            size='sm'
            variant={viewportWidth === "tablet" ? "solid" : "light"}
            onPress={() => handleViewportChange("tablet")}
          >
            <Tablet size={18} />
          </Button>
          <Button
            isIconOnly
            size='sm'
            variant={viewportWidth === "desktop" ? "solid" : "light"}
            onPress={() => handleViewportChange("desktop")}
          >
            <Monitor size={18} />
          </Button>
        </ButtonGroup>
        <Button isIconOnly size='sm' variant='light' className='ml-2' onPress={toggleFullscreen}>
          <Maximize2 size={18} />
        </Button>
      </div>
      <div className='flex-grow bg-slate-700 overflow-auto relative'>
        <div className={`flex items-center justify-center ${viewportWidth !== "desktop" ? "h-full" : "h-full"}`}>
          <motion.div
            className={`bg-white transition-all duration-300 ${getViewportClass()}`}
            animate={{ x: showFlash ? 10 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {isLoading && (
              <div className='absolute inset-0 flex items-center justify-center bg-slate-700 bg-opacity-75'>
                <Spinner size='lg' color='success' />
              </div>
            )}
            {isUrlActive && (
              <iframe
                ref={iframeRef}
                className='w-full h-full border-none'
                title='Browser Preview'
                onLoad={handleIframeLoad}
              />
            )}
          </motion.div>
          {showFlash && (
            <motion.div
              className='absolute right-0 top-0 bottom-0 w-1 bg-white'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BrowserPreview
