import React, { useState, useEffect } from "react"
import { Input, Select, SelectItem } from "@nextui-org/react"
import { format, toZonedTime } from "date-fns-tz"
import { useTranslation } from "react-i18next"

const timezones = [
  { value: "Asia/Shanghai", label: "Beijing Time" },
  { value: "Asia/Tokyo", label: "Tokyo Time" },
  { value: "America/New_York", label: "New York Time" },
  { value: "Europe/London", label: "London Time" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
]

const DateSetter = ({ value, onValueChange, label, ...props }) => {
  const [date, setDate] = useState(value?.date || new Date().toISOString())
  const [timezone, setTimezone] = useState(value?.timezone || "Asia/Shanghai")
  const { t } = useTranslation()

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date().toISOString()
      setDate(newDate)
      onValueChange({ date: newDate, timezone })
    }, 60000)

    return () => clearInterval(interval)
  }, [onValueChange, timezone])

  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone)
    onValueChange({ date, timezone: newTimezone })
  }

  const formattedDate = format(toZonedTime(date, timezone), "yyyy-MM-dd HH:mm:ss zzz", { timeZone: timezone })

  return (
    <div className='space-y-2'>
      <Input type='text' label={label} value={formattedDate} readOnly {...props} />
      <Select
        label={t("select_timezone")}
        selectedKeys={[timezone]}
        onSelectionChange={(keys) => handleTimezoneChange(Array.from(keys)[0])}
      >
        {timezones.map((tz) => (
          <SelectItem key={tz.value} value={tz.value}>
            {t(tz.label)}
          </SelectItem>
        ))}
      </Select>
    </div>
  )
}

export default DateSetter