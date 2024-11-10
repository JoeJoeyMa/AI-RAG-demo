import React, { useState } from "react"
import { Button, Input, Spinner } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion"
import { message } from "@/components/Message"
import { chatRole } from "@/service/api"

const MagicNameGenerator: React.FC = () => {
  const [description, setDescription] = useState("")
  const [generatedName, setGeneratedName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!description.trim()) {
      message.error("请输入中文描述")
      return
    }

    setIsLoading(true)
    try {
      const response = await chatRole([
        {
          role: "system",
          content: "你是一个英文命名专家，根据用户输入的中文描述，生成一个适合的英文名称，使用xxx_xxxx_xxx格式。",
        },
        { role: "user", content: [{ type: "text", text: description }] },
      ])
      const generatedName = response.choices[0].message.content.trim()
      setGeneratedName(generatedName)
      message.success("名称生成成功")
    } catch (error) {
      console.error("Error generating name:", error)
      message.error("生成名称时出错，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center space-y-4 p-4'>
      <Input
        label='中文描述'
        placeholder='输入中文描述以生成英文名称'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='max-w-xs'
      />
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          color='primary'
          endContent={<Icon icon='mdi:magic-wand' width='20' height='20' />}
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? <Spinner color='secondary' size='sm' /> : "生成名称"}
        </Button>
      </motion.div>
      {generatedName && (
        <div className='mt-4 p-2 bg-gray-100 rounded'>
          <p className='text-center font-semibold'>{generatedName}</p>
        </div>
      )}
    </div>
  )
}

export default MagicNameGenerator
