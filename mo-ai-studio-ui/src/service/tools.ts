import { sendWebSocketMessage } from "./websocketUtils"

export const tools = [
  {
    type: "function",
    function: {
      name: "writeFile",
      description: "为 <Project> 向文件写入内容，写入内容必须是完整的内容，不能省略原来的内容，如果是修改，就在原有内容基础上进行修改",
      parameters: {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description: "要写入的文件路径",
          },
          content: {
            type: "string",
            description: "要写入文件的内容",
          },
        },
        required: ["filePath", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "commitChanges",
      description: "为 <Project> 提交 Git 更改",
      parameters: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "提交信息",
          },
        },
        required: ["summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "initializationComplete",
      description: "标记 <Project> 的项目初始化为完成",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "sendAppId",
      description: "为 <Project> 向服务器发送 AppId",
      parameters: {
        type: "object",
        properties: {
          appId: {
            type: "string",
            description: "要发送的 AppId",
          },
        },
        required: ["appId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "rollback",
      description: "为 <Project> 回滚到上一个 Git 提交",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "executeCommand",
      description: "为 <Project> 在服务器上执行命令",
      parameters: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description: "要执行的命令",
          },
        },
        required: ["command"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "refreshFileTree",
      description: "刷新 <Project> 的文件树",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
]

export const runTools = [
  {
    function: {
      name: "writeFile",
      async implementation({ filePath, content }) {
        const response = await sendWebSocketMessage({
          action: "writeFile",
          filePath,
          content,
        })
        return `${filePath} 编写完成`
      },
    },
  },
  {
    function: {
      name: "commitChanges",
      async implementation({ summary }) {
        const response = await sendWebSocketMessage({
          action: "commitChanges",
          summary,
        })
        return `更改已提交，提交信息：${summary}`
      },
    },
  },
  {
    function: {
      name: "initializationComplete",
      async implementation() {
        const response = await sendWebSocketMessage({
          action: "initializationComplete",
        })
        return "初始化已标记为完成"
      },
    },
  },
  {
    function: {
      name: "sendAppId",
      async implementation({ appId }) {
        const response = await sendWebSocketMessage({
          action: "sendAppId",
          appId,
        })
        return `AppId ${appId} 发送成功`
      },
    },
  },
  {
    function: {
      name: "rollback",
      async implementation() {
        const response = await sendWebSocketMessage({
          action: "rollback",
        })
        return "回滚成功"
      },
    },
  },
  {
    function: {
      name: "executeCommand",
      async implementation({ command }) {
        const response = await sendWebSocketMessage({
          action: "executeCommand",
          command,
        })
        return `命令执行成功：${response.output}`
      },
    },
  },
  {
    function: {
      name: "refreshFileTree",
      async implementation() {
        const response = await sendWebSocketMessage({
          action: "refreshFileTree",
        })
        return "文件树刷新成功"
      },
    },
  },
]
