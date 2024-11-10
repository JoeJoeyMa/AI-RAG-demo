export interface FileInfo {
  path: string
  name: string
  type: string
  content?: string
  size?: number
}

export interface FileSelectorProps {
  label: string
  value: string[]
  onValueChange: (value: string[]) => void
  className?: string
  cardId: string
  variableName: string
}