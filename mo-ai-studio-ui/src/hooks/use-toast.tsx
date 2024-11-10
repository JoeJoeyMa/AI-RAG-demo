import React, { useState, useCallback, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { motion, AnimatePresence } from "framer-motion"

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const useToast = () => {
  const show = useCallback(({ message, type, duration }: ToastProps) => {
    const container = document.createElement("div")
    document.body.appendChild(container)

    const root = createRoot(container)
    root.render(<Toast message={message} type={type} duration={duration} />)

    setTimeout(() => {
      root.unmount()
      document.body.removeChild(container)
    }, duration || 3000)
  }, [])

  return { show }
}

export default useToast
