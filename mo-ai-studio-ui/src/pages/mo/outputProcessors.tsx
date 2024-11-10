import DevProcessorResult from "./DevProcessorResult"
import FunctionProcessorResult from "./FunctionProcessorResult"
import { message } from "@/components/Message"
import { chatByRoleName } from "@/service/chat"
import { localDB } from "@/utils/localDB"
import Exa from "exa-js"

// 新增：Bash结果组件
const BashResultComponent = ({ results }) => {
  return (
    <div className='p-4 bg-gray-100 rounded-md'>
      <h3 className='text-lg font-semibold mb-2'>Bash 执行结果：</h3>
      <pre className='whitespace-pre-wrap'>{results}</pre>
    </div>
  )
}

export const outputProcessors = {
  // 默认输出处理器
  // 直接返回原始输出，不做任何特殊处理
  defaultOutputProcessor: {
    name: "默认输出处理器",
    process: (output: string) => {
      // 默认输出处理器不做任何处理，直接返回原始输出
      return output
    },
    resultComponent: () => {
      return <></>
    },
  },

  // Exa 搜索处理器
  // 执行 Exa 搜索并处理结果
  exaProcessor: {
    name: "Exa 搜索处理器",
    process: async (output: string) => {
      const apiKey = "357fc811-ad6b-4b66-89f6-ed87485b68a3"
      const exa = new Exa(apiKey)
      // 查找 Exa 搜索函数
      const exaFunctionMatch = output.match(/\/\/exaSearchBegin\s*([\s\S]*?)\s*\/\/exaSearchEnd/g)
      if (exaFunctionMatch) {
        const exaFunctionCode = exaFunctionMatch[0]
        try {
          // 执行 Exa 搜索函数
          const exaFunction = new Function(`${exaFunctionCode}`)()
          const result = await exaFunction(exa)
          const json = JSON.stringify(result, null, 2)
          console.log(json)
          return json
        } catch (error) {
          console.error("Error executing Exa search function:", error)
          message.error(`执行 Exa 搜索函数失败: ${error.message}`)
          return `Error: ${error.message}`
        }
      }
      return output
    },
    resultComponent: null,
  },

  // 文件输出处理器
  // 将输出写入指定文件
  fileOutputProcessor: {
    name: "文件输出处理器",
    process: async (output: string = "") => {
      const fileRegex = /<mo-ai-file path="([^"]+)">([\s\S]*?)<\/mo-ai-file>/g
      const results = []
      let match

      while ((match = fileRegex.exec(output)) !== null) {
        const [, filePath, content] = match
        try {
          // 获取文件的绝对路径
          const absolutePath = await window.electronAPI.file.getAbsolutePath(filePath)
          // 写入文件内容
          await window.electronAPI.file.writeFile(absolutePath, content.trim())
          console.log(`File written: ${absolutePath}`)
          results.push({ path: filePath, status: "success" })
          message.success(`文件 ${filePath} 已成功写入`)
        } catch (error) {
          console.error(`Error writing file: ${filePath}`, error)
          results.push({ path: filePath, status: "error", message: error.message })
          message.error(`文件 ${filePath} 写入失败: ${error.message}`)
        }
      }

      return results
    },
    resultComponent: DevProcessorResult,
  },

  // 函数处理器
  // 执行自定义 JavaScript 函数来处理输出
  functionProcessor: {
    name: "函数处理器",
    process: async (output: string, onChunk: () => {}) => {
      const functionRegex = /<function deps="([^"]+)">([\s\S]*?)<\/function>/
      const match = output.match(functionRegex)
      if (match) {
        const [, deps, functionBody] = match
        const depsArray = deps.split(",").map((dep) => dep.trim())
        const apiKey = "357fc811-ad6b-4b66-89f6-ed87485b68a3"
        const exa = new Exa(apiKey)
        const depsObject = {
          exa,
          localDB,
          chatByRoleName,
          onChunk,
        }
        try {
          // 创建并执行自定义函数
          const func = new Function(...Object.keys(depsObject), functionBody)
          const result = await func(...Object.values(depsObject))()
          console.log(result)
          return result
        } catch (error) {
          console.error("Error executing function:", error)
          message.error(`执行函数失败: ${error.message}`)
          return `Error: ${error.message}`
        }
      }
      return output
    },
    resultComponent: FunctionProcessorResult,
  },

  // 工作流处理器
  // 执行自定义工作流来处理输出
  workflowProcessor: {
    name: "工作流处理器",
    process: async (output: string) => {
      const workflowRegex = /<mo-ai-workflow>([\s\S]*?)<\/mo-ai-workflow>/
      const match = output.match(workflowRegex)
      if (match) {
        const [, workflowBody] = match
        try {
          // 创建并执行工作流函数
          const workflowFunction = new Function(workflowBody)()
          const result = await workflowFunction(outputProcessors, output)
          console.log("Workflow result:", result)
          return result
        } catch (error) {
          console.error("Error executing workflow:", error)
          message.error(`执行工作流失败: ${error.message}`)
          return `Error: ${error.message}`
        }
      }
      return output
    },
    resultComponent: null, // 可以根据需要添加结果组件
  },

  // Bash 处理器
  // 执行 Bash 命令
  bashProcessor: {
    name: "Bash 处理器",
    process: async (output: string = "") => {
      const bashRegex = /<mo-ai-bash>([\s\S]*?)<\/mo-ai-bash>/
      const match = output.match(bashRegex)
      if (match) {
        const [, bashScript] = match
        try {
          const result = await window.electronAPI.bash.executeBash(bashScript.trim())
          if (result.success) {
            console.log("Bash execution result:", result.stdout)
            return { success: true, output: result.stdout }
          } else {
            throw new Error(result.error || result.stderr)
          }
        } catch (error) {
          console.error("Error executing bash script:", error)
          message.error(`执行 Bash 脚本失败: ${error.message}`)
          return { success: false, output: `Error: ${error.message}` }
        }
      }
      return { success: false, output: "No bash script found" }
    },
    resultComponent: BashResultComponent,
  },
}

// 根据处理器名称获取对应的输出处理器
export function getOutputProcessor(processorName: string) {
  return outputProcessors[processorName] || outputProcessors.defaultOutputProcessor
}

// 获取所有输出处理器的选项，用于UI展示
export function getOutputProcessorOptions() {
  return Object.entries(outputProcessors).map(([key, processor]) => ({
    key,
    value: key,
    label: processor.name,
  }))
}
