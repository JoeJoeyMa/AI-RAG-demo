import React, { useState } from "react"
import { Button, Input, Spinner } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion"
import { message } from "@/components/Message"
import { chatRole } from "@/service/api"

const MagicSqlGenerator = ({ onGenerated, propertyType }) => {
  const [description, setDescription] = useState("")
  const [generatedSql, setGeneratedSql] = useState("")
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
          content: `你是一个PostgreSQL专家，根据用户输入的中文描述，生成一个适合的SQL表达式。
          生成的SQL表达式应该只包含值的部分，不需要包含字段名。
          生成的SQL表达式类型应该匹配属性类型：${propertyType}。
          例如，对于JSON类型，可能生成：'[ {"label": "选项1", "value": "option1"}, {"label": "选项2", "value": "option2"} ]';直接返回生成的结果，开头和结尾都不要解释和说明`,
        },
        { role: "user", content: [{ type: "text", text: description }] },
      ])
      const generatedSql = response.choices[0].message.content.trim()
      setGeneratedSql(generatedSql)
      onGenerated(generatedSql)
      message.success("SQL表达式生成成功")
    } catch (error) {
      console.error("Error generating SQL:", error)
      message.error("生成SQL表达式时出错，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center space-y-4 p-4'>
      <Input
        label='中文描述'
        placeholder='输入中文描述以生成SQL表达式'
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
          {isLoading ? <Spinner color='secondary' size='sm' /> : "生成SQL表达式"}
        </Button>
      </motion.div>
      {generatedSql && (
        <div className='mt-4 p-2 bg-gray-100 rounded'>
          <p className='text-center font-semibold'>{generatedSql}</p>
        </div>
      )}
    </div>
  )
}

export default MagicSqlGenerator
