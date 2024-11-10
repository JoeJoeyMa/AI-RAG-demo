import { useState } from "react"

export const useElectronFile = () => {
  const [error, setError] = useState(null)

  const isElectronAvailable = () => {
    return window.electronAPI && window.electronAPI.file
  }

  const readFiles = async (filePaths) => {
    try {
      if (isElectronAvailable()) {
        const contents = await window.electronAPI.file.readFiles(filePaths)
        return contents
      } else {
        // 在非 Electron 环境中提供替代方案
        console.warn("Electron API 不可用，使用替代方案")
        // 这里可以使用浏览器的 File API 或其他方法来读取文件
        // 示例：假设 filePaths 是 File 对象数组
        const contents = await Promise.all(
          filePaths.map((file) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = (e) => resolve(e.target.result)
              reader.onerror = (e) => reject(e)
              reader.readAsText(file)
            })
          })
        )
        return contents
      }
    } catch (err) {
      setError(err)
      throw err
    }
  }

  const writeFile = async (filePath, content) => {
    try {
      if (isElectronAvailable()) {
        await window.electronAPI.file.writeFile(filePath, content)
      } else {
        console.warn("Electron API 不可用，使用替代方案")
        // 在非 Electron 环境中，可以使用浏览器的下载功能作为替代
        const blob = new Blob([content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filePath.split("/").pop()
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError(err)
      throw err
    }
  }

  const readDir = async (dirPath) => {
    try {
      if (isElectronAvailable()) {
        const files = await window.electronAPI.file.readDir(dirPath)
        return files
      } else {
        console.warn("Electron API 不可用，无法读取目录")
        // 在非 Electron 环境中，通常无法直接读取目录
        // 可以返回一个空数组或抛出一个错误
        return []
      }
    } catch (err) {
      setError(err)
      throw err
    }
  }

  return { readFiles, writeFile, readDir, error }
}
