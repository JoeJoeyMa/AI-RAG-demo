import React, { useState } from "react"
import { Input, Button, Tooltip } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import { message } from "@/components/Message"

const URLInput = ({ value, onValueChange, label, ...props }) => {
  const [url, setUrl] = useState(value?.url || "")
  const [content, setContent] = useState(value?.content || "")
  const [showDeleteButton, setShowDeleteButton] = useState(false)
  const { t } = useTranslation()

  const handleFetch = async () => {
    if (!url.trim()) {
      message.error(t("url_empty_error"))
      return
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const text = await response.text()
      setContent(text)
      onValueChange({ url, content: text })
      setShowDeleteButton(true)
    } catch (error) {
      console.error("Error fetching URL:", error)
      message.error(t("url_fetch_error", { error: error.message }))
    }
  }

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl)
    onValueChange({ url: newUrl, content })
  }

  const handleDelete = () => {
    setContent("")
    setShowDeleteButton(false)
    onValueChange({ url, content: "" })
  }

  return (
    <div className='space-y-2'>
      <Input
        endContent={
          <Button isIconOnly onClick={handleFetch} className='bg-transparent' aria-label={t("fetch_content")}>
            <Tooltip content={t("fetched_content")}>
              <Icon icon='mdi:download' />
            </Tooltip>
          </Button>
        }
        label={label}
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder={t("enter_url")}
        {...props}
      />

      {content && (
        <div className='mt-2'>
          <div className='flex justify-between items-center'>
            <p className='font-semibold'>{t("fetched_content")}:</p>
            {showDeleteButton && (
              <Button isIconOnly onClick={handleDelete} className='bg-transparent' aria-label={t("delete_content")}>
                <Tooltip content={t("delete_content")}>
                  <Icon icon='mdi:delete' />
                </Tooltip>
              </Button>
            )}
          </div>
          <pre className='bg-gray-100 p-2 rounded mt-1 max-h-40 max-w-96 overflow-auto'>{content}</pre>
        </div>
      )}
    </div>
  )
}

export default URLInput