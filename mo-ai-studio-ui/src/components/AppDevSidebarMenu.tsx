import React, { useState } from "react"
import { Tooltip, Button } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion"
import LearnMoreModal from "./LearnMoreModal"
import { useNavigate } from "react-router-dom"

const menuItems = [
  { icon: "solar:arrow-left-bold-duotone", label: "返回" },
  { icon: "solar:question-circle-bold-duotone", label: "帮助" },
]

const SidebarMenu: React.FC = () => {
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()

  const handleItemClick = (label: string) => {
    if (label === "帮助") {
      setIsLearnMoreModalOpen(true)
    } else if (label === "返回") {
      navigate("/develop")
    }
  }

  return (
    <>
      <motion.div
        className='fixed z-50 left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 p-2 bg-background/60 backdrop-blur-lg rounded-r-2xl shadow-lg'
        initial={{ width: "64px" }}
        animate={{ width: isExpanded ? "96px" : "64px" }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
      >
        {menuItems.map((item, index) => (
          <Tooltip key={index} content={item.label} placement='right'>
            <Button
              isIconOnly
              variant='light'
              className='w-12 h-12 transition-transform hover:scale-110'
              onClick={() => handleItemClick(item.label)}
            >
              <Icon icon={item.icon} width={24} height={24} />
            </Button>
          </Tooltip>
        ))}
      </motion.div>
      <LearnMoreModal isOpen={isLearnMoreModalOpen} onOpenChange={() => setIsLearnMoreModalOpen(false)} />
    </>
  )
}

export default SidebarMenu
