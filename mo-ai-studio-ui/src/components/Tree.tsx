import React, { useState } from "react"
import { Icon } from "@iconify/react"

export const TreeNode = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const hasChildren = React.Children.count(children) > 0

  return (
    <div className='ml-4'>
      <div className='flex items-center'>
        {hasChildren && (
          <Icon
            icon={isOpen ? "mdi:chevron-down" : "mdi:chevron-right"}
            className='cursor-pointer'
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
        <div className='ml-2'>{title}</div>
      </div>
      {isOpen && children}
    </div>
  )
}

export const Tree = ({ children }) => {
  return <div className='tree'>{children}</div>
}
