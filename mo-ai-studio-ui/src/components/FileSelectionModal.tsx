import React, { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  ScrollShadow,
  Progress,
} from "@nextui-org/react"
import { ChevronDown, ChevronRight, FileIcon, FolderIcon } from "lucide-react"
import { message } from "./Message"
import { blog, findNodeByPath } from "@/utils"

interface FileNode {
  name: string
  type: "file" | "directory"
  children?: FileNode[]
  length?: number // 添加文件长度属性
}

interface FileSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (selectedFiles: Set<string>) => void
  fileTree: FileNode[]
  initialSelectedFiles: Set<string>
  maxTotalLength?: number // 修改为最大总长度
}

const FileSelectionModal: React.FC<FileSelectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fileTree,
  initialSelectedFiles,
  maxTotalLength = 100000,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(initialSelectedFiles))
  const [searchQuery, setSearchQuery] = useState("")
  const [totalSelectedLength, setTotalSelectedLength] = useState(0)

  useEffect(() => {
    setSelectedFiles(new Set(initialSelectedFiles))
    calculateTotalLength(new Set(initialSelectedFiles))
  }, [initialSelectedFiles])

  const toggleNode = (path: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const calculateTotalLength = (files: Set<string>) => {
    let total = 0
    files.forEach((file) => {
      const node = findNodeByPath(fileTree, file)
      if (node && node.content.length) {
        total += node.content.length
      }
    })
    setTotalSelectedLength(total)
  }

  const toggleFile = (path: string) => {
    setSelectedFiles((prev) => {
      const newFiles = new Set(prev)
      const node = findNodeByPath(fileTree, path)
      if (!node) return prev
      if (newFiles.has(path)) {
        newFiles.delete(path)
        setTotalSelectedLength(totalSelectedLength - (node.content.length || 0))
      } else {
        const newTotalLength = totalSelectedLength + (node.content.length || 0)
        if (newTotalLength <= maxTotalLength) {
          newFiles.add(path)
          setTotalSelectedLength(newTotalLength)
        } else {
          message.error(`选择的文件总长度不能超过 ${maxTotalLength} 字符`)
          return prev
        }
      }
      return newFiles
    })
  }

  const isNodeVisible = (node: FileNode, path: string): boolean => {
    const currentPath = `${path}/${node.name}`.replace(/^\//, "")
    if (searchQuery === "") return true
    if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) return true
    if (node.type === "directory" && node.children) {
      return node.children.some((child) => isNodeVisible(child, currentPath))
    }
    return false
  }

  const renderTree = (node: FileNode, path: string = "") => {
    const currentPath = `${path}/${node.name}`.replace(/^\//, "")
    const isExpanded = expandedNodes.has(currentPath)
    const isSelected = selectedFiles.has(currentPath)
    const isVisible = isNodeVisible(node, path)

    if (!isVisible) {
      return null
    }

    return (
      <div key={currentPath} className='ml-2'>
        <div className='flex items-center'>
          {node.type === "file" && (
            <Checkbox isSelected={isSelected} onChange={() => toggleFile(currentPath)} className='mr-2' />
          )}
          <Button
            onPress={() => {
              if (node.type === "directory") {
                toggleNode(currentPath)
              }
            }}
            className='p-1 justify-start w-full hover:bg-default-100 bg-transparent'
            variant='light'
          >
            <div className='flex items-center w-full'>
              {node.type === "directory" ? (
                isExpanded ? (
                  <ChevronDown className='w-4 h-4 mr-2 text-default-500' />
                ) : (
                  <ChevronRight className='w-4 h-4 mr-2 text-default-500' />
                )
              ) : (
                <FileIcon className='w-4 h-4 mr-2 text-default-500' />
              )}
              {node.type === "directory" && <FolderIcon className='w-4 h-4 mr-2 text-warning' />}
              <span className='text-sm'>{node.name}</span>
              {node.type === "file" && node.content.length && (
                <span className='text-xs text-gray-500 ml-2'>({node.content.length} 字符)</span>
              )}
            </div>
          </Button>
        </div>
        {node.type === "directory" && isExpanded && node.children && (
          <div className='ml-4'>{node.children.map((child) => renderTree(child, currentPath))}</div>
        )}
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size='2xl'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>选择文件</ModalHeader>
            <ModalBody>
              <Input
                label='搜索文件'
                placeholder='输入文件名搜索'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className='mt-4'>
                <Progress value={(totalSelectedLength / maxTotalLength) * 100} color='primary' className='max-w-md' />
                <p className='text-sm mt-2'>
                  已选择 {totalSelectedLength}/{maxTotalLength} 字符
                </p>
              </div>
              <ScrollShadow className='h-[300px] mt-4'>
                <div className='flex flex-col gap-2'>{fileTree.map((node) => renderTree(node))}</div>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                取消
              </Button>
              <Button color='primary' onPress={() => onSave(selectedFiles)}>
                保存
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default FileSelectionModal
