import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { message } from "@/components/Message"
import { FileInfo } from "./types"

// Constants
const MAX_DEPTH = 5
const MAX_FILE_SIZE = 50 * 1024 // 50KB

const useFileOperations = () => {
  const { t } = useTranslation()

  const handleError = useCallback(
    (error: Error, messageKey: string) => {
      console.error(messageKey, error)
      message.error(t(messageKey, { error: error.message }))
    },
    [t]
  )

  const selectFiles = useCallback(async () => {
    try {
      const result = await window.electronAPI.file.selectFiles()
      if (result.success) {
        const newFiles: FileInfo[] = await Promise.all(
          result.paths.map(async (path) => {
            const name = path.split("/").pop() || path
            const type = path.includes(".") ? path.split(".").pop() || "file" : "directory"
            const stats = await window.electronAPI.file.getFileStats(path)
            return { path, name, type, size: stats.success ? stats.stats.size : undefined }
          })
        )
        return newFiles
      }
      return []
    } catch (error) {
      handleError(error, "file_selection_error")
      return []
    }
  }, [handleError])

  const selectDirectory = useCallback(async () => {
    try {
      const result = await window.electronAPI.file.selectDirectory()
      if (result.success) {
        return result.path
      }
      return null
    } catch (error) {
      handleError(error, "directory_selection_error")
      return null
    }
  }, [handleError])

  const createDirectory = useCallback(async () => {
    try {
      const result = await window.electronAPI.file.createDirectory(false, "")
      if (result.success) {
        message.success(t("directory_created_successfully"))
        return result.path
      }
      message.error(t("directory_creation_error", { error: result.error }))
      return null
    } catch (error) {
      handleError(error, "directory_creation_error")
      return null
    }
  }, [handleError, t])

  const cloneRepository = useCallback(
    async (repoUrl: string, targetPath: string, onProgress: (progress: number) => void) => {
      try {
        const isGitInstalled = await window.electronAPI.file.checkGitInstalled()
        if (!isGitInstalled.success || !isGitInstalled.isInstalled) {
          message.error(t("git_not_installed"))
          return false
        }

        const cloneResult = await window.electronAPI.file.cloneGitRepository(repoUrl, targetPath, onProgress)
        if (cloneResult.success) {
          message.success(t("repository_cloned_successfully"))
          return true
        }
        throw new Error(cloneResult.error)
      } catch (error) {
        handleError(error, "repository_clone_error")
        return false
      }
    },
    [handleError, t]
  )

  const readDirectoryRecursive = useCallback(async (dirPath: string, depth: number): Promise<any> => {
    if (depth > MAX_DEPTH) {
      return { success: true, files: [] }
    }

    try {
      const result = await window.electronAPI.file.readDir(dirPath)
      if (result.success) {
        const files = await Promise.all(
          result.files.map(async (file) => {
            const fullPath = `${dirPath}/${file.name}`
            if (file.isDirectory) {
              const subDirFiles = await readDirectoryRecursive(fullPath, depth + 1)
              return {
                path: fullPath,
                name: file.name,
                type: "directory",
                children: subDirFiles.success ? subDirFiles.files : [],
              }
            } else {
              const stats = await window.electronAPI.file.getFileStats(fullPath)
              if (stats.success && stats.stats.size <= MAX_FILE_SIZE) {
                return {
                  path: fullPath,
                  name: file.name,
                  type: "file",
                  size: stats.stats.size,
                }
              }
              return null
            }
          })
        )
        return { success: true, files: files.filter(Boolean) }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error(`Error reading directory: ${dirPath}`, error)
      return { success: false, error: error.message }
    }
  }, [])

  return {
    selectFiles,
    selectDirectory,
    createDirectory,
    cloneRepository,
    readDirectoryRecursive,
  }
}

export default useFileOperations