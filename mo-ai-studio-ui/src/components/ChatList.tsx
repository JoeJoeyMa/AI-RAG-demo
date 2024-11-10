import React, { useRef, useEffect } from "react"
import { Spinner, Card, CardBody, Image } from "@nextui-org/react"
import MarkdownRenderer from "./MarkdownRenderer"
import userAva from "../../public/assets/user.png"
import Mo2 from "../../public/assets/mo-2.png"
import { jsonStringify } from "@/utils"

interface Message {
  id: number
  content: string
  isUser: boolean
  isLoading?: boolean
  images?: string[]
}

interface ChatListProps {
  messages: Message[]
}

const ChatList: React.FC<ChatListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
  }, [jsonStringify(messages[messages.length - 1] || 1)])

  return (
    <div className='flex flex-col gap-4 h-[510px] overflow-y-auto p-4 bg-[#00000030] rounded-md'>
      <div>
        {messages &&
          messages.map((message) => (
            <Card
              data-message-id={message.id}
              key={message.id}
              className={`${message.isUser ? "ml-auto" : "mr-auto"} mt-3`}
              style={{ maxWidth: "80%" }}
            >
              <CardBody
                className={`${message.isUser ? "bg-black text-white" : "bg-white text-gray-900"} ${
                  message.isLoading ? "overflow-hidden" : ""
                }`}
              >
                <div className='flex items-start gap-2'>
                  {!message.isUser && <Image src={Mo2} className='max-w-[36px] max-h-[36px] object-cover rounded' />}
                  <div className='flex-1'>
                    {message.isLoading ? (
                      <Spinner size='md' color='current' label='' />
                    ) : (
                      <>
                        {/* {message.content} */}
                        <MarkdownRenderer content={message.content} />
                        {message.images && message.images.length > 0 && (
                          <div className='flex flex-wrap gap-2 mt-2'>
                            {message.images.map((image, index) => (
                              <Image
                                key={index}
                                src={image}
                                alt={`Uploaded image ${index + 1}`}
                                className='max-w-[100px] max-h-[100px] object-cover rounded'
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {message.isUser && <Image src={userAva} className='max-w-[36px] max-h-[36px] object-cover rounded' />}
                </div>
              </CardBody>
            </Card>
          ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatList
