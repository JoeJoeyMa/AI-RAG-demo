import React, { useState } from "react"
import { Input, Button, Tooltip } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import { message } from "@/components/Message"
import { localDB } from "@/utils/localDB"

const FirecrawlSetter = ({ value, onValueChange, label, ...props }) => {
  const [url, setUrl] = useState(value?.url || "")
  const [content, setContent] = useState(value?.content || "")
  const [prompt, setPrompt] = useState(value?.prompt || "")
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  const handleFetch = async () => {
    if (!url.trim()) {
      message.error(t("url_empty_error"))
      return
    }

    setIsLoading(true)
    try {
      const apiKey = localDB.getItem("toolApiKeys").firecrawl || ""
      const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          formats: prompt ? ["extract", "markdown"] : ["markdown"],
          onlyMainContent: true,
          extract: {
            schema: {},
            systemPrompt: "",
            prompt: prompt,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setContent(data.data.markdown)
        onValueChange({ url, content: data.data.markdown, prompt })
      } else {
        throw new Error(data.error || "Unknown error occurred")
      }
    } catch (error) {
      console.error("Error fetching URL with Firecrawl:", error)
      message.error(t("firecrawl_fetch_error", { error: error.message }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl)
    onValueChange({ url: newUrl, content, prompt })
  }

  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt)
    onValueChange({ url, content, prompt: newPrompt })
  }

  return (
    <div className='space-y-2'>
      <Input
        endContent={
          <Button
            isIconOnly
            onClick={handleFetch}
            className='bg-transparent'
            aria-label={t("fetch_content")}
            isLoading={isLoading}
          >
            <Tooltip content={t("fetch_with_firecrawl")}>
              <Icon icon='mdi:spider-web' />
            </Tooltip>
          </Button>
        }
        label={label}
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder={t("enter_url_for_firecrawl")}
        {...props}
      />

      <Input
        label={t("custom_prompt")}
        value={prompt}
        onChange={(e) => handlePromptChange(e.target.value)}
        placeholder={t("enter_custom_prompt")}
      />

      {content && (
        <div className='mt-2'>
          <p className='font-semibold'>{t("fetched_content")}:</p>
          <pre className='bg-gray-100 p-2 rounded mt-1 max-h-40 w-full overflow-auto text-small'>{content}</pre>
        </div>
      )}
    </div>
  )
}

export default FirecrawlSetter
