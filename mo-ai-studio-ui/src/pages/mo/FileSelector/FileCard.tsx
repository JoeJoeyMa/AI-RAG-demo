import React, { useMemo } from "react"
import { Button, Card, Tooltip } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import { FileInfo } from "./types"

interface FileCardProps {
  file: FileInfo
  onRemove: () => void
  onPreview: () => void
}

const FileCard: React.FC<FileCardProps> = React.memo(({ file, onRemove, onPreview }) => {
  const { t } = useTranslation()

  const fileIcon = useMemo(() => {
    if (file.type === "directory") return "mdi:folder"
    switch (file.name.split(".").pop()?.toLowerCase()) {
      case "pdf":
        return "mdi:file-pdf-box"
      case "doc":
      case "docx":
        return "mdi:file-word-box"
      case "xls":
      case "xlsx":
        return "mdi:file-excel-box"
      case "ppt":
      case "pptx":
        return "mdi:file-powerpoint-box"
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "mdi:file-image-box"
      case "mp3":
      case "wav":
        return "mdi:file-music-box"
      case "mp4":
      case "avi":
      case "mov":
        return "mdi:file-video-box"
      case "zip":
      case "rar":
        return "mdi:file-zip-box"
      default:
        return "mdi:file-document-outline"
    }
  }, [file.type, file.name])

  const fileSize = useMemo(() => {
    if (file.size === undefined) return ""
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (file.size === 0) return "0 Byte"
    const i = parseInt(Math.floor(Math.log(file.size) / Math.log(1024)).toString())
    return Math.round((file.size / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }, [file.size])

  return (
    <Tooltip
      content={
        <div>
          <p>{file.name}</p>
          <p>{t(file.type)}</p>
          <p>{fileSize}</p>
        </div>
      }
    >
      <Card
        className='relative w-[100px] h-[100px] m-1 hover:shadow-md transition-shadow duration-200 cursor-pointer'
        isPressable
        onPress={onPreview}
      >
        <Button
          isIconOnly
          size='sm'
          variant='light'
          className='absolute top-1 right-1 z-10'
          onPress={(e) => {
            onRemove()
          }}
        >
          <Icon icon='mdi:close' />
        </Button>
        <div className='flex flex-col items-center justify-center h-full'>
          <Icon icon={fileIcon} className='text-primary text-4xl mb-2' />
          <span className='text-xs text-ellipsis font-medium truncate w-16 text-center px-2'>{file.name}</span>
        </div>
      </Card>
    </Tooltip>
  )
})

export default FileCard