import React, { useState, useEffect } from "react"
import { Spinner } from "@nextui-org/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const FunctionProcessorResult: React.FC<any> = ({ results }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (results) {
      setIsLoading(false)
    }
  }, [results])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Spinner label='Processing...' color='primary' />
      </div>
    )
  }

  return (
    <div
      style={{ margin: "16px", height: "calc(100vh - 32px)" }}
      className='w-full max-w-4xl mx-auto p-4 bg-black rounded-lg shadow-md overflow-auto markdown-body'
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{results}</ReactMarkdown>
      {results.error && (
        <div className='mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded'>Error: {results.error}</div>
      )}
    </div>
  )
}

export default FunctionProcessorResult
