import React, { useState, useEffect } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import SidebarMenu from "@/components/AppDevSidebarMenu"
import DevChat from "@/components/DevChat"
import { Tabs, Tab, Tooltip, ScrollShadow, Card, Code } from "@nextui-org/react"
import BrowserPreview from "@/components/BrowserPreview"
import { Icon } from "@iconify/react"
import AppDevDataSource from "@/components/AppDevDataSource"
import WorkspaceExplorer from "@/components/WorkspaceExplorer"
import { useParams, useLocation } from "react-router-dom"
import { useWebSocket } from "@/hooks/use-webSocket"
import { localDB } from "@/utils/localDB"
import { convertArrayToObject, convertFileStructure, jsonParse, jsonStringify } from "@/utils"
import { useManualMode } from "@/hooks/useManualMode"
import AgentManager from "@/components/AgentManager"

export default function AppDevPage() {
  const [activeTab, setActiveTab] = useState("browser")
  const params = useParams()
  const location = useLocation()
  const [directoryStructure, setDirectoryStructure] = useState(null)
  const { isManualContext } = useManualMode()
  const [savedContext, setSavedContext] = useState<{ path: string; content: string }[]>([])

  const wsUrl = new URLSearchParams(location.search).get("wsUrl")
  const { lastMessage, sendMessage } = useWebSocket(wsUrl)

  useEffect(() => {
    if (lastMessage !== null) {
      const data = jsonParse(lastMessage.data)
      setDirectoryStructure(data.directoryStructure)
      localDB.setItem("directoryStructure", data.directoryStructure)
      if (!isManualContext) {
        let context = localDB.getItem("directoryStructure")
        if (context) {
          context = convertFileStructure(context)
          context = convertArrayToObject(context)
          setSavedContext(context)
        }
      }
      localDB.setItem("startUrl", data.startUrl)
    }
  }, [lastMessage])

  useEffect(() => {
    const appId = params.appId
    if (appId) {
      sessionStorage.setItem("x-app-id", appId)
      if (sendMessage) {
        sendMessage(jsonStringify({ action: "sendAppId", appId }))
      }
    }
  }, [params.appId, sendMessage])

  useEffect(() => {
    if (sendMessage) {
      sendMessage(jsonStringify({ action: "getDirectoryStructure" }))
    }
  }, [sendMessage])

  const handleTabChange = (key: React.Key) => {
    setActiveTab(key.toString())
  }

  return (
    <div className='flex h-dvh w-full'>
      <SidebarMenu />
      <div className='w-full flex-1 flex p-4 pl-24'>
        <PanelGroup direction='horizontal'>
          <Panel defaultSize={50} minSize={30}>
            <DevChat activeTab={activeTab} />
          </Panel>
          <PanelResizeHandle className='w-2 transition-colors flex items-center justify-center'>
            <Icon icon='lucide:grip-vertical' className='text-white' />
          </PanelResizeHandle>
          <Panel defaultSize={50} minSize={30}>
            <Tabs aria-label='Development tabs' selectedKey={activeTab} onSelectionChange={handleTabChange}>
              <Tab key='browser' title='浏览器'>
                {activeTab === "browser" && <BrowserPreview />}
              </Tab>
              <Tab key='data' title='数据'>
                {activeTab === "data" && <AppDevDataSource />}
              </Tab>
              <Tab key='workspace' title='上下文'>
                {activeTab === "workspace" && !isManualContext ? (
                  <ScrollShadow className='h-[calc(100vh-150px)]'>
                    <div className='workspace-tree space-y-4'>
                      {Object.keys(savedContext).map((key) => (
                        <Card key={key} className='p-4 bg-gray-800'>
                          <h4 className='text-sm font-semibold text-white mb-2'>{key}</h4>
                          <code>{savedContext[key]}</code>
                        </Card>
                      ))}
                    </div>
                  </ScrollShadow>
                ) : (
                  <WorkspaceExplorer />
                )}
              </Tab>
              <Tab key='agents' title='智能体'>
                <AgentManager />
              </Tab>
            </Tabs>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}
