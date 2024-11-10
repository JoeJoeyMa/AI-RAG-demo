import React, { useEffect, useRef, useState, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import mermaid from "mermaid"
import { Icon } from "@iconify/react"
import globalStore from "@/globalStore"

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
})

interface MarkdownRendererProps {
  content: string
}

const MermaidDiagram = ({ code }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      mermaid.contentLoaded()
    }
  }, [code])

  return (
    <div className='mermaid' ref={ref}>
      {code}
    </div>
  )
}

const isRenderComponentsSyntax = (code: string): boolean => {
  const submitButton = ["SubmitDevelopmentButton"]
  return submitButton.some((keyword) => code.trim().includes(keyword))
}

const renderFileContent = (content, filepath) => {
  const isComplete = content.includes("//GenEnd")

  if (isComplete) {
    globalStore.currentFilePath = filepath
    return (
      <div className='mt-2 flex items-center space-x-2 text-sm text-green-500'>
        <span>编码任务执行完成</span>
        <Icon icon='mdi:check-circle' width='20' height='20' />
      </div>
    )
  }
}

const CopyButton = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [code])

  return (
    <button
      onClick={handleCopy}
      className='absolute top-2 right-2 p-1 rounded bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
    >
      {isCopied ? (
        <Icon icon='mdi:check' width='20' height='20' />
      ) : (
        <Icon icon='mdi:content-copy' width='20' height='20' />
      )}
    </button>
  )
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h1({ ...props }) {
          return (
            <>
              <h1 className='scroll-m-20 my-4 text-4xl font-extrabold tracking-tight lg:text-5xl' {...props} />
            </>
          )
        },
        h2({ ...props }) {
          return (
            <>
              <h2
                className='scroll-m-20 my-4 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'
                {...props}
              />
            </>
          )
        },
        h3({ ...props }) {
          return (
            <>
              <h3 className='scroll-m-20 my-4 text-2xl font-semibold tracking-tight' {...props} />
            </>
          )
        },
        h4({ ...props }) {
          return (
            <>
              <h4 className='scroll-m-20 my-4 text-xl font-semibold tracking-tight' {...props} />
            </>
          )
        },
        h5({ ...props }) {
          return (
            <>
              <h5 className='scroll-m-20 my-4 text-lg font-semibold tracking-tight' {...props} />
            </>
          )
        },
        h6({ ...props }) {
          return (
            <>
              <h6 className='scroll-m-20 my-4 text-base font-semibold tracking-tight' {...props} />
            </>
          )
        },
        ul({ ...props }) {
          return <ul className='my-6 ml-6 list-disc [&>li]:mt-2' {...props}></ul>
        },
        blockquote({ ...props }) {
          return <blockquote className='mt-6 border-l-2 pl-6 italic' {...props}></blockquote>
        },
        a({ ...props }) {
          return <a className='text-primary' {...props}></a>
        },
        li({ ...props }) {
          return <li className='mt-2' {...props}></li>
        },
        ol({ ...props }) {
          return <ol className='my-6 ml-6 list-decimal [&>li]:mt-2' {...props}></ol>
        },
        p({ ...props }) {
          return <p className='leading-7 [&:not(:first-child)]:mt-6' {...props} />
        },
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          if (!inline && match) {
            if (match[1] === "mermaid") {
              return <MermaidDiagram code={String(children).replace(/\n$/, "")} />
            }
            const codeString = String(children).replace(/\n$/, "").replace("//only for mo-2", "")
            return (
              <div className='relative'>
                <SyntaxHighlighter wrapLongLines style={materialDark} language={match[1]} PreTag='div' {...props}>
                  {codeString}
                </SyntaxHighlighter>
                <div>吃吃吃吃吃吃吃好吃吃</div>
                <CopyButton code={codeString} />
              </div>
            )
          }
          return (
            <code
              className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold bg-slate-300 text-blue-500'
              {...props}
            >
              {children}
            </code>
          )
        },
        mermaid({ node, ...props }) {
          return <MermaidDiagram code={node?.children[0]?.value} />
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
