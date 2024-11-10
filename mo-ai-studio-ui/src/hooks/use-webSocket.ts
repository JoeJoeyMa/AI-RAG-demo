import { message } from "@/components/Message"
import { initializeWebSocket } from "@/service/websocketUtils"
import { jsonStringify } from "@/utils"
import { useState, useEffect, useCallback } from "react"

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING)

  useEffect(() => {
    let ws
    const init = async () => {
      const wsPort = (await (window as any).electronAPI?.env?.getWsPort()) || 3000
      if (!wsPort) return

      const url = `ws://localhost:${wsPort}`
      ws = new WebSocket(url)
      initializeWebSocket(ws)
      ws.onopen = () => {
        setReadyState(WebSocket.OPEN)
        message.success("WebSocket连接成功")
      }
      ws.onclose = () => {
        setReadyState(WebSocket.CLOSED)
        message.error("WebSocket连接失败")
      }
      ws.onerror = (error) => {
        console.error("WebSocket错误:", error)
        message.error("WebSocket连接出错")
      }
      ws.onmessage = (event) => setLastMessage(event)

      setSocket(ws)
    }
    // init()
    return () => {
      if (ws) ws.close()
    }
  }, [])

  const sendMessage = useCallback(
    (msg: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(msg)
      } else {
        message.error("WebSocket未连接,无法发送消息")
      }
    },
    [socket]
  )

  const executeCommand = useCallback(
    (command: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(jsonStringify({ action: "executeCommand", command }))
      } else {
        message.error("WebSocket未连接,无法执行命令")
      }
    },
    [socket]
  )

  return { lastMessage, readyState, sendMessage, executeCommand }
}
