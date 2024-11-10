import React, { useState } from "react"
import { Button, Input } from "@nextui-org/react"
import { useTranslation } from "react-i18next"

const DirectorySelector = ({ value, onValueChange, ...props }) => {
  const [selectedDirectory, setSelectedDirectory] = useState(value || "")
  const { t } = useTranslation()

  const handleSelectDirectory = async () => {
    try {
      const result = await window.electronAPI.file.selectDirectory()
      if (result.success) {
        setSelectedDirectory(result.path)
        onValueChange(result.path)
      } else {
        console.error("Failed to select directory:", result.error)
      }
    } catch (error) {
      console.error("Error selecting directory:", error)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        {...props}
        type="text"
        value={selectedDirectory}
        onChange={(e) => {
          setSelectedDirectory(e.target.value)
          onValueChange(e.target.value)
        }}
        placeholder={t("select_directory")}
      />
      <Button onClick={handleSelectDirectory}>{t("select_directory")}</Button>
    </div>
  )
}

export default DirectorySelector