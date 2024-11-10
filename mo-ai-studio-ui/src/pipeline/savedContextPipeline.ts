import { localDB } from "@/utils/localDB"
import { findNodeByPath } from "@/utils"
import { message } from "@/components/Message"

export interface SavedContext {
  path: string
  content: string
}

export interface ContextGroup {
  name: string
  files: string[]
}

localDB.addBusinessPipeline("set", "savedContext", (value) => {
  return value
})

export const savedContextPipeline = {
  getSavedContext: (): SavedContext[] => {
    return localDB.getItem("savedContext") || []
  },

  setSavedContext: (context: SavedContext[]) => {
    localDB.setItem("savedContext", context)
  },

  updateSavedContext: async (fileTree: any[], filesToSave: Set<string>): Promise<SavedContext[]> => {
    try {
      const selectedContext = await Promise.all(
        Array.from(filesToSave).map(async (path) => {
          const node = findNodeByPath(fileTree, path)
          if (node && node.type === "file") {
            return { path, content: node.content || "" }
          }
          return null
        })
      )
      const validContext = selectedContext.filter((item) => item !== null) as SavedContext[]
      savedContextPipeline.setSavedContext(validContext)
      return validContext
    } catch (error) {
      console.error("保存上下文时出错:", error)
      return []
    }
  },

  copyContext: async (savedContext: SavedContext[]): Promise<void> => {
    try {
      if (savedContext.length > 0) {
        const contextString = savedContext.map((item) => `文件路径: ${item.path}\n内容:\n${item.content}\n`).join("\n")
        await navigator.clipboard.writeText(contextString)
        message.success("上下文已复制到剪贴板")
      } else {
        message.warning("没有保存的上下文可供复制")
      }
    } catch (error) {
      console.error("复制上下文时出错:", error)
      message.error("复制上下文时出错")
    }
  },

  updateFileContentInContext: (savedContext: SavedContext[], filePath: string, newContent: string): SavedContext[] => {
    return savedContext.map((item) => (item.path === filePath ? { ...item, content: newContent } : item))
  },

  getContextGroups: (): ContextGroup[] => {
    return localDB.getItem("contextGroups") || []
  },

  setContextGroups: (groups: ContextGroup[]) => {
    localDB.setItem("contextGroups", groups)
  },

  getActiveContextGroups: (): Set<string> => {
    const activeGroups = localDB.getItem("activeContextGroups")
    return new Set(activeGroups || [])
  },

  setActiveContextGroups: (activeGroups: Set<string>) => {
    localDB.setItem("activeContextGroups", Array.from(activeGroups))
  },

  updateSavedContextFromGroups: async (
    groups: ContextGroup[],
    activeGroups: Set<string>,
    fileTree: any[]
  ): Promise<SavedContext[]> => {
    const allFiles = new Set<string>()
    await Promise.all(
      groups.map(async (group) => {
        if (activeGroups.has(group.name)) {
          const groupFiles = localDB.getItem(`contextGroup_${group.name}`)
          if (groupFiles) {
            groupFiles.forEach((file: string) => allFiles.add(file))
          }
        }
      })
    )
    return savedContextPipeline.updateSavedContext(fileTree, allFiles)
  },

  saveContextGroup: (name: string, files: string[]) => {
    localDB.setItem(`contextGroup_${name}`, files)
  },

  deleteContextGroup: (name: string) => {
    localDB.removeItem(`contextGroup_${name}`)
  },
}
