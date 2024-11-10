import React, { useState, useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Button, ModalFooter } from "@nextui-org/react"
import { message } from "./Message"
import { useSearchParams } from "react-router-dom"
import { blog, jsonParse, jsonStringify } from "@/utils"

interface FileEditorProps {
  file: {
    name: string
    content?: string
  } | null
  onClose: () => void
  onSave: (content: string) => void
}

const FileEditor: React.FC<FileEditorProps> = ({ file, onClose }) => {
  const [content, setContent] = useState(file?.content || "")
  const [isChanged, setIsChanged] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const [searchParams] = useSearchParams()

  const wsUrl = searchParams.get("wsUrl")
  useEffect(() => {
    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onopen = () => {
      console.log("WebSocket连接已建立")
    }

    wsRef.current.onmessage = (event) => {
      const response = jsonParse(event.data)
      if (response.success) {
        // message.success("文件保存成功")
        setIsChanged(false)
      } else {
        message.error(`文件保存失败: ${response.message}`)
      }
    }

    wsRef.current.onerror = (error) => {
      console.error("WebSocket错误:", error)
      message.error("WebSocket连接错误")
    }

    wsRef.current.onclose = () => {
      console.log("WebSocket连接已关闭")
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    setContent(file?.content || "")
    setIsChanged(false)
  }, [file])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value)
      setIsChanged(true)
    }
  }

  return (
    <>
      <Editor
        height='60vh'
        defaultLanguage='javascript'
        value={content}
        readOnly
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
      <ModalFooter>
        <Button color='danger' variant='light' onPress={onClose}>
          关闭
        </Button>
      </ModalFooter>
    </>
  )
}

export default FileEditor
