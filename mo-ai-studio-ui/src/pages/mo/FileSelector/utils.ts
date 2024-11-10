interface FileInfo {
  path: string
  name: string
  type: string
  content?: string
  size?: number
}
export const groupFilesByPath = (files: FileInfo[]) => {
  const groups: { [key: string]: FileInfo[] } = {}
  files.forEach((file) => {
    const parts = file.path.split("/")
    const groupPath = parts.slice(0, -1).join("/")
    if (!groups[groupPath]) {
      groups[groupPath] = []
    }
    groups[groupPath].push(file)
  })
  return groups
}

export const processFiles = (files: any[], basePath: string): FileInfo[] => {
  return files.flatMap((file) => {
    if (file.type === "directory") {
      return [
        {
          path: file.path,
          name: file.name,
          type: "directory",
        },
        ...processFiles(file.children, file.path),
      ]
    } else {
      return [
        {
          path: file.path,
          name: file.name,
          type: "file",
          size: file.size,
        },
      ]
    }
  })
}
