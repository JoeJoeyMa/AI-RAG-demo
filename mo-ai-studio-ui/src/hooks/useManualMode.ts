import { blog } from "@/utils"
import { localDB } from "@/utils/localDB"
import { useEffect, useState } from "react"

export const useManualMode = () => {
  const [isManualContext, setIsManualContext] = useState(false)
  useEffect(() => {
    const _isManualContext = localDB.getItem("_isManualContextMode")
    setIsManualContext(_isManualContext !== "false")
  }, [])

  useEffect(() => {
    const dispose = localDB.watchKey("_isManualContextMode", ({ key, value }) => {
      setIsManualContext(value)
    })
    return () => {
      dispose()
    }
  }, [])

  const toggleMode = (mode) => {
    localDB.setItem("_isManualContextMode", mode)
    setIsManualContext(mode)
  }
  return {
    isManualContext,
    toggleMode,
  }
}
