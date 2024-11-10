import React, { useState } from "react"
import { Textarea, Button } from "@nextui-org/react"
import { useTranslation } from "react-i18next"

const TextareaSetter = ({ value, onValueChange, label, ...props }) => {
  const [localValue, setLocalValue] = useState(value || "")
  const { t } = useTranslation()

  const handleSave = () => {
    onValueChange(localValue)
  }

  return (
    <div className='space-y-2'>
      <Textarea label={label} value={localValue} onChange={(e) => setLocalValue(e.target.value)} {...props} />
      <Button variant='light' size='sm' onPress={handleSave}>
        {t("save")}
      </Button>
    </div>
  )
}

export default TextareaSetter