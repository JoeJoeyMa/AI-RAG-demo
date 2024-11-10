import system from "@/agents/mo-2/system"
import user from "@/agents/mo-2/user"
import { localDB } from "@/utils/localDB"
import { useEffect, useState } from "react"
const defaultAgent = {
  id: "mo-2",
  name: "Mo-2",
  system: system,
  user: user,
}
export const useSelectAgent = () => {
  const [selectedAgent, setSelectedAgent] = useState(defaultAgent)
  useEffect(() => {
    const _selectedAgent = localDB.getItem("selectedAgent")
    setSelectedAgent(_selectedAgent)
  }, [])

  useEffect(() => {
    const dispose = localDB.watchKey("selectedAgent", ({ key, value }) => {
      setSelectedAgent(value)
    })
    return () => {
      dispose()
    }
  }, [])

  const selectAgent = (agent) => {
    localDB.setItem("selectedAgent", agent)
    setSelectedAgent(agent)
  }
  return {
    selectedAgent,
    selectAgent,
    defaultAgent,
  }
}
