import React from "react"
import { Button, Card, ScrollShadow } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import { FileInfo } from "./types"
import FileCard from "./FileCard"

interface GroupCardProps {
  groupPath: string
  files: FileInfo[]
  onRemoveFile: (path: string) => void
  onPreviewFile: (file: FileInfo) => void
  onRemoveGroup: () => void
}

const GroupCard: React.FC<GroupCardProps> = React.memo(
  ({ groupPath, files, onRemoveFile, onPreviewFile, onRemoveGroup }) => {
    const { t } = useTranslation()
    return (
      <Card className='p-4 m-2 hover:shadow-md transition-shadow duration-200'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-lg font-semibold'>{groupPath || t("root_directory")}</h3>
          <Button isIconOnly size='sm' color='danger' variant='light' onPress={onRemoveGroup}>
            <Icon icon='mdi:delete' />
          </Button>
        </div>
        <ScrollShadow className='max-h-[300px]'>
          <div className='flex flex-wrap gap-2'>
            {files.map((file) => (
              <FileCard
                key={file.path}
                file={file}
                onRemove={() => onRemoveFile(file.path)}
                onPreview={() => onPreviewFile(file)}
              />
            ))}
          </div>
        </ScrollShadow>
      </Card>
    )
  }
)

export default GroupCard