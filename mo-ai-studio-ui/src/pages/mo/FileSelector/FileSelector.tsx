import React, { useState, useEffect, useCallback, useMemo, useReducer } from "react"
import {
  Button,
  Input,
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ScrollShadow,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Progress,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { message } from "@/components/Message"
import { localDB } from "@/utils/localDB"
import { useTranslation } from "react-i18next"
import { FileInfo, FileSelectorProps } from "./types"
import { groupFilesByPath, processFiles } from "./utils"
import useFileOperations from "./useFileOperations"
import FileCard from "./FileCard"
import GroupCard from "./GroupCard"

// Main component
const FileSelector: React.FC<FileSelectorProps> = ({
  label,
  value,
  onValueChange,
  className,
  cardId,
  variableName,
}) => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_SELECTED_FILES":
          return { ...state, selectedFiles: action.payload }
        case "SET_PREVIEW_FILE":
          return { ...state, previewFile: action.payload }
        case "SET_FILE_CONTENTS":
          return { ...state, fileContents: action.payload }
        case "SET_IS_LOADING":
          return { ...state, isLoading: action.payload }
        case "SET_PROGRESS":
          return { ...state, progress: action.payload }
        case "SET_IS_CLONE_MODAL_OPEN":
          return { ...state, isCloneModalOpen: action.payload }
        case "SET_REPO_URL":
          return { ...state, repoUrl: action.payload }
        case "SET_CLONE_PROGRESS":
          return { ...state, cloneProgress: action.payload }
        case "SET_CLONE_TARGET_DIR":
          return { ...state, cloneTargetDir: action.payload }
        case "REMOVE_FILE":
          state.selectedFiles = state.selectedFiles.filter((f) => f.path !== action.payload)
          return { ...state }
        case "SET_IGNORE_LIST":
          return { ...state, ignoreList: action.payload }
        case "SET_IS_IGNORE_MODAL_OPEN":
          return { ...state, isIgnoreModalOpen: action.payload }
        default:
          return state
      }
    },
    {
      selectedFiles: [],
      previewFile: null,
      fileContents: "",
      isLoading: false,
      progress: 0,
      isCloneModalOpen: false,
      repoUrl: "",
      cloneProgress: 0,
      cloneTargetDir: "",
      ignoreList: ["node_modules", ".git", "build", "dist"],
      isIgnoreModalOpen: false,
    }
  )

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation()
  const fileOperations = useFileOperations()

  useEffect(() => {
    loadSavedFileSelections()
    loadSavedIgnoreList()
  }, [cardId, variableName])

  const loadSavedFileSelections = () => {
    const savedFileSelections = localDB.getItem("savedFileSelections") || {}
    const savedSelection = savedFileSelections[cardId]?.[variableName] || []
    dispatch({ type: "SET_SELECTED_FILES", payload: savedSelection })
  }

  const loadSavedIgnoreList = () => {
    const savedIgnoreList = localDB.getItem("savedIgnoreList") || state.ignoreList
    dispatch({ type: "SET_IGNORE_LIST", payload: savedIgnoreList })
  }

  const filterNewFiles = useCallback(
    (newFiles: FileInfo[], existingFiles: FileInfo[]): FileInfo[] => {
      const existingPaths = new Set(existingFiles.map((file) => file.path))
      return newFiles.filter((file) => {
        const shouldIgnore = state.ignoreList.some(
          (ignoreItem) => file.name === ignoreItem || file.path.includes(`/${ignoreItem}/`)
        )
        return !existingPaths.has(file.path) && !shouldIgnore
      })
    },
    [state.ignoreList]
  )

  const handleFileSelect = useCallback(async () => {
    const newFiles = await fileOperations.selectFiles()
    const filteredNewFiles = filterNewFiles(newFiles, state.selectedFiles)
    const updatedFiles = [...state.selectedFiles, ...filteredNewFiles]
    dispatch({ type: "SET_SELECTED_FILES", payload: updatedFiles })
    onValueChange(updatedFiles.map((f) => f.path))
    saveFileSelections(updatedFiles)
  }, [fileOperations, filterNewFiles, state.selectedFiles, onValueChange])

  const handleDirectorySelect = useCallback(async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true })
    dispatch({ type: "SET_PROGRESS", payload: 0 })
    const dirPath = await fileOperations.selectDirectory()
    if (dirPath) {
      const dirName = dirPath.split("/").pop()
      if (dirName && state.ignoreList.includes(dirName)) {
        message.error(t("directory_ignored", { name: dirName }))
        dispatch({ type: "SET_IS_LOADING", payload: false })
        return
      }

      const files = await fileOperations.readDirectoryRecursive(dirPath, 0)
      if (files.success) {
        const newFiles = processFiles(files.files, dirPath)
        const filteredNewFiles = filterNewFiles(newFiles, state.selectedFiles)
        const updatedFiles = [...state.selectedFiles, ...filteredNewFiles]
        dispatch({ type: "SET_SELECTED_FILES", payload: updatedFiles })
        onValueChange(updatedFiles.map((f) => f.path))
        saveFileSelections(updatedFiles)
      } else {
        message.error(t("directory_read_error", { error: files.error }))
      }
    }
    dispatch({ type: "SET_IS_LOADING", payload: false })
  }, [fileOperations, filterNewFiles, state.selectedFiles, onValueChange, t, state.ignoreList])

  const handleCreateDirectory = useCallback(async () => {
    const newDirPath = await fileOperations.createDirectory()
    if (newDirPath) {
      const newDirectory: FileInfo = {
        path: newDirPath,
        name: newDirPath.split("/").pop() || newDirPath,
        type: "directory",
      }
      const updatedFiles = [...state.selectedFiles, newDirectory]
      dispatch({ type: "SET_SELECTED_FILES", payload: updatedFiles })
      onValueChange(updatedFiles.map((f) => f.path))
      saveFileSelections(updatedFiles)
    }
  }, [fileOperations, state.selectedFiles, onValueChange])

  const handleCloneRepository = useCallback(async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true })
    dispatch({ type: "SET_CLONE_PROGRESS", payload: 0 })

    if (!state.repoUrl) {
      message.error(t("repository_url_required"))
      dispatch({ type: "SET_IS_LOADING", payload: false })
      return
    }

    if (!state.cloneTargetDir) {
      message.error(t("clone_target_directory_required"))
      dispatch({ type: "SET_IS_LOADING", payload: false })
      return
    }

    const repoName =
      state.repoUrl
        .split("/")
        .pop()
        ?.replace(/\.git$/, "") || "cloned-repo"
    const targetPath = `${state.cloneTargetDir}/${repoName}`
    const cloneSuccess = await fileOperations.cloneRepository(state.repoUrl, targetPath, (progress) => {
      dispatch({ type: "SET_CLONE_PROGRESS", payload: progress })
    })

    if (cloneSuccess) {
      const files = await fileOperations.readDirectoryRecursive(targetPath, 0)
      if (files.success) {
        const newFiles = processFiles(files.files, targetPath)
        const filteredNewFiles = filterNewFiles(newFiles, state.selectedFiles)
        const updatedFiles = [...state.selectedFiles, ...filteredNewFiles]
        dispatch({ type: "SET_SELECTED_FILES", payload: updatedFiles })
        onValueChange(updatedFiles.map((f) => f.path))
        saveFileSelections(updatedFiles)
      } else {
        message.error(t("directory_read_error", { error: files.error }))
      }
    }

    dispatch({ type: "SET_IS_LOADING", payload: false })
    dispatch({ type: "SET_IS_CLONE_MODAL_OPEN", payload: false })
    dispatch({ type: "SET_REPO_URL", payload: "" })
    dispatch({ type: "SET_CLONE_TARGET_DIR", payload: "" })
    dispatch({ type: "SET_CLONE_PROGRESS", payload: 0 })
  }, [fileOperations, state.repoUrl, state.cloneTargetDir, state.selectedFiles, filterNewFiles, onValueChange, t])

  const handleRemoveFile = useCallback(
    (filePath: string) => {
      dispatch({ type: "REMOVE_FILE", payload: filePath })
      onValueChange(state.selectedFiles.map((f) => f.path))
      saveFileSelections(state.selectedFiles)
    },
    [state.selectedFiles, onValueChange]
  )

  const handleRemoveGroup = useCallback(
    (groupPath: string) => {
      const updatedFiles = state.selectedFiles.filter((f) => !f.path.startsWith(groupPath))
      dispatch({ type: "SET_SELECTED_FILES", payload: updatedFiles })
      onValueChange(updatedFiles.map((f) => f.path))
      saveFileSelections(updatedFiles)
    },
    [state.selectedFiles, onValueChange]
  )

  const handlePreviewFile = useCallback(
    async (file: FileInfo) => {
      try {
        if (file.type === "directory") {
          message.info(t("directory_preview_not_available"))
          return
        }
        const result = await window.electronAPI.file.readFiles([file.path])
        if (result.success) {
          dispatch({ type: "SET_FILE_CONTENTS", payload: result.contents[0].content })
          dispatch({ type: "SET_PREVIEW_FILE", payload: file })
          onOpen()
        } else {
          message.error(t("file_read_error", { error: result.error }))
        }
      } catch (error) {
        console.error(`Error reading file: ${file.path}`, error)
        message.error(t("file_read_error", { error: error.message }))
      }
    },
    [onOpen, t]
  )

  const saveFileSelections = useCallback(
    (files: FileInfo[]) => {
      const savedFileSelections = localDB.getItem("savedFileSelections") || {}
      savedFileSelections[cardId] = savedFileSelections[cardId] || {}
      savedFileSelections[cardId][variableName] = files
      localDB.setItem("savedFileSelections", savedFileSelections)
    },
    [cardId, variableName]
  )

  const saveIgnoreList = useCallback((ignoreList: string[]) => {
    localDB.setItem("savedIgnoreList", ignoreList)
  }, [])

  const groupedFiles = useMemo(() => groupFilesByPath(state.selectedFiles), [state.selectedFiles])

  const handleSelectCloneTargetDir = useCallback(async () => {
    const dirPath = await fileOperations.selectDirectory()
    if (dirPath) {
      dispatch({ type: "SET_CLONE_TARGET_DIR", payload: dirPath })
    }
  }, [fileOperations])

  const handleIgnoreListChange = useCallback(
    (newIgnoreList: string[]) => {
      dispatch({ type: "SET_IGNORE_LIST", payload: newIgnoreList })
      saveIgnoreList(newIgnoreList)
    },
    [saveIgnoreList]
  )

  return (
    <div className={`${className} space-y-3`}>
      <Input
        label={label}
        value={state.selectedFiles.map((f) => f.name).join(", ")}
        readOnly
        placeholder={t("select_file_or_directory")}
        endContent={
          <Dropdown>
            <DropdownTrigger>
              <Button size='sm' isIconOnly color='primary' aria-label={t("add_file_or_directory")}>
                <Icon icon='mdi:plus' />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label={t("file_selection_options")}>
              <DropdownItem key='file' startContent={<Icon icon='mdi:file-upload' />} onPress={handleFileSelect}>
                {t("select_file")}
              </DropdownItem>
              <DropdownItem
                key='directory'
                startContent={<Icon icon='mdi:folder-open' />}
                onPress={handleDirectorySelect}
              >
                {t("select_directory")}
              </DropdownItem>
              <DropdownItem
                key='create_directory'
                startContent={<Icon icon='mdi:folder-plus' />}
                onPress={handleCreateDirectory}
              >
                {t("create_directory")}
              </DropdownItem>
              <DropdownItem
                key='clone_repository'
                startContent={<Icon icon='mdi:git' />}
                onPress={() => dispatch({ type: "SET_IS_CLONE_MODAL_OPEN", payload: true })}
              >
                {t("clone_git_repository")}
              </DropdownItem>
              <DropdownItem
                key='edit_ignore_list'
                startContent={<Icon icon='mdi:file-hidden' />}
                onPress={() => dispatch({ type: "SET_IS_IGNORE_MODAL_OPEN", payload: true })}
              >
                {t("edit_ignore_list")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        }
      />
      {state.isLoading && <Progress value={state.progress} className='mt-2' />}
      <ScrollShadow className='max-h-[600px]'>
        {Object.entries(groupedFiles).map(([groupPath, files]) => (
          <GroupCard
            key={groupPath}
            groupPath={groupPath}
            files={files}
            onRemoveFile={handleRemoveFile}
            onPreviewFile={handlePreviewFile}
            onRemoveGroup={() => handleRemoveGroup(groupPath)}
          />
        ))}
      </ScrollShadow>
      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <span className='font-bold'>{state.previewFile?.name}</span>
                <span className='text-sm text-gray-500'>{state.previewFile?.path}</span>
              </ModalHeader>
              <ModalBody>
                <ScrollShadow className='h-[300px]'>
                  <pre className='whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-lg text-sm'>
                    ```
                    {state.fileContents}
                  </pre>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onPress={onClose}>
                  {t("close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={state.isCloneModalOpen}
        onClose={() => dispatch({ type: "SET_IS_CLONE_MODAL_OPEN", payload: false })}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{t("clone_git_repository")}</ModalHeader>
              <ModalBody>
                <Input
                  label={t("enter_git_repo_url")}
                  placeholder='https://github.com/username/repo.git'
                  value={state.repoUrl}
                  onChange={(e) => dispatch({ type: "SET_REPO_URL", payload: e.target.value })}
                />
                <Input
                  label={t("select_clone_target_directory")}
                  placeholder={t("select_directory")}
                  value={state.cloneTargetDir}
                  readOnly
                  endContent={
                    <Button size='sm' onPress={handleSelectCloneTargetDir}>
                      {t("select")}
                    </Button>
                  }
                />
                {state.cloneProgress > 0 && <Progress value={state.cloneProgress} className='mt-2' />}
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  {t("cancel")}
                </Button>
                <Button color='primary' onPress={handleCloneRepository} isLoading={state.isLoading}>
                  {t("clone")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={state.isIgnoreModalOpen}
        onClose={() => dispatch({ type: "SET_IS_IGNORE_MODAL_OPEN", payload: false })}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{t("edit_ignore_list")}</ModalHeader>
              <ModalBody>
                <Input
                  label={t("ignore_list")}
                  placeholder={t("enter_ignore_items")}
                  value={state.ignoreList.join(", ")}
                  onChange={(e) => handleIgnoreListChange(e.target.value.split(",").map((item) => item.trim()))}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  {t("cancel")}
                </Button>
                <Button color='primary' onPress={onClose}>
                  {t("save")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default FileSelector
