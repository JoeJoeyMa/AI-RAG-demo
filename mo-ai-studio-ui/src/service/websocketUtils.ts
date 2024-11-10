import { blog, jsonParse, jsonStringify } from "@/utils"

let ws
export function initializeWebSocket(wsIns) {
  ws = wsIns
}
export function sendWebSocketMessage(message) {
  console.log(message, "---ws---")
  return new Promise((resolve, reject) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(jsonStringify(message))
      ws.onmessage = (event) => {
        const response = jsonParse(event.data)
        if (response.success) {
          resolve(response)
        } else {
          reject(new Error(response.message || "Operation failed"))
        }
      }
    } else {
      reject(new Error("WebSocket connection not established"))
    }
  })
}
