import React from "react"
import { TextareaSetter, URLInput, DateSetter, FirecrawlSetter } from "."
import FileSelector from "../FileSelector/FileSelector"
import DirectorySelector from "../DirectorySelector"
import { message } from "@/components/Message"

const MAX_DEPTH = 5
const MAX_FILE_SIZE = 50 * 1024

const shouldIgnoreDirectory = (dirName: string): boolean => {
  const ignoredDirs = ["node_modules", ".git", "build", "dist", ".cache"]
  return ignoredDirs.includes(dirName) || dirName.startsWith(".")
}

export const variableSetters = {
  textSetter: {
    name: "Text Setter",
    component: TextareaSetter,
    parse: (value: string) => {
      console.log(value)
      return value
    },
  },
  fileSetter: {
    name: "File Setter",
    component: FileSelector,
    parse: async (value: string[]) => {
      if (Array.isArray(value)) {
        const processedPaths = new Set<string>()
        const contents = await Promise.all(
          value.map(async (filePath) => {
            try {
              if (processedPaths.has(filePath)) {
                return "" // Skip already processed paths
              }
              processedPaths.add(filePath)

              const statsResult = await window.electronAPI.file.getFileStats(filePath)
              if (statsResult.success) {
                const stats = statsResult.stats
                if (stats.isDirectory) {
                  const dirContents = await readDirectoryRecursive(filePath, processedPaths, 0)
                  return `
                  Directory path: ${filePath}
                  Directory structure:
                  ${dirContents}
                  `
                } else if (stats.size <= MAX_FILE_SIZE) {
                  const result = await window.electronAPI.file.readFiles([filePath])
                  if (result.success) {
                    return `
                    File path: ${filePath}
                    File content:
                    ${result?.contents[0]?.content}
                    `
                  } else {
                    message.error(t("file_read_error", { error: result.error }))
                    return `Error: Could not read file ${filePath}. ${result.error}`
                  }
                } else {
                  return `File ${filePath} is too large (${stats.size} bytes) and was skipped.`
                }
              } else {
                return `Error: Could not get file stats for ${filePath}. ${statsResult.error}`
              }
            } catch (error) {
              console.error(`Error reading file: ${filePath}`, error)
              message.error(t("file_read_error", { error: error.message }))
              return `Error: Could not read file ${filePath}. ${error.message}`
            }
          })
        )
        return contents.filter((content) => content !== "").join("\n")
      }
      return ""
    },
  },
  directorySetter: {
    name: "Directory Setter",
    component: DirectorySelector,
    parse: async (value: string) => {
      if (value) {
        try {
          const result = await readDirectoryRecursive(value, new Set<string>(), 0)
          return result
        } catch (error) {
          console.error(`Error getting directory structure: ${value}`, error)
          message.error(t("directory_structure_error", { error: error.message }))
          return `Error: Could not get directory structure for ${value}. ${error.message}`
        }
      }
      return value
    },
  },
  urlSetter: {
    name: "URL Setter",
    component: URLInput,
    parse: (value: { url: string; content: string }) => {
      return value?.content
    },
  },
  dateSetter: {
    name: "Date Setter",
    component: DateSetter,
    parse: (value: { date: string; timezone: string }) => {
      const { date, timezone } = value
      return format(toZonedTime(date, timezone), "yyyy-MM-dd HH:mm:ss zzz", { timeZone: timezone })
    },
  },
  firecrawlSetter: {
    name: "Firecrawl Setter",
    component: FirecrawlSetter,
    parse: (value: { url: string; content: string }) => {
      return value?.content
    },
  },
}

const readDirectoryRecursive = async (dirPath: string, processedPaths: Set<string>, depth: number): Promise<string> => {
  if (depth > MAX_DEPTH) {
    return `Max depth (${MAX_DEPTH}) reached. Stopping recursion.`
  }

  try {
    const result = await window.electronAPI.file.readDir(dirPath)
    if (result.success) {
      const contents = await Promise.all(
        result.files
          .filter((file) => !shouldIgnoreDirectory(file.name))
          .map(async (file) => {
            const fullPath = `${dirPath}/${file.name}`
            if (processedPaths.has(fullPath)) {
              return "" // Skip already processed paths
            }
            processedPaths.add(fullPath)

            const statsResult = await window.electronAPI.file.getFileStats(fullPath)
            if (statsResult.success) {
              const stats = statsResult.stats
              if (stats.isDirectory) {
                const subDirContents = await readDirectoryRecursive(fullPath, processedPaths, depth + 1)
                return `${file.name}/\n${subDirContents
                  .split("\n")
                  .map((line) => `  ${line}`)
                  .join("\n")}`
              } else {
                if (stats.size <= MAX_FILE_SIZE) {
                  return file.name
                } else {
                  return `${file.name} (${stats.size} bytes, too large to process)`
                }
              }
            } else {
              return `Error: Could not get file stats for ${fullPath}. ${statsResult.error}`
            }
          })
      )
      return contents.filter((content) => content !== "").join("\n")
    } else {
      message.error(t("directory_read_error", { error: result.error }))
      return `Error: ${result.error}`
    }
  } catch (error) {
    console.error(`Error reading directory: ${dirPath}`, error)
    message.error(t("directory_read_error", { error: error.message }))
    return `Error: Could not read directory ${dirPath}. ${error.message}`
  }
}

export function getVariableSetter(setterName: string) {
  return variableSetters[setterName] || variableSetters.textSetter
}
