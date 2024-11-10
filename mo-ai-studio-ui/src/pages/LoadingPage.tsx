import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Spinner } from "@nextui-org/react"

const LoadingPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className='flex items-center justify-center h-screen bg-gradient-to-br from-black via-slate-700 to-slate-900'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className='text-6xl font-bold text-white'
      >
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          Mo
        </motion.span>
        <motion.span
          className='text-blue-500 ml-1 mr-1'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          AI
        </motion.span>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }}>
          Studio
        </motion.span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className='ml-4 text-white'
      >
        <Spinner label={t("loading_message")} size='lg' color='white'></Spinner>
      </motion.div>
    </div>
  )
}

export default LoadingPage
