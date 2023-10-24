import { useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { MessageThread, SendBox } from '@azure/communication-react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { Avatar, Image } from '@mantine/core'
import { IconBrandTelegram } from '@tabler/icons-react'
import { serviceNameAtom, temperatureAtom, filterWordsAtom } from '@/stores'

function MessageLoading() {
  return (
    <div style={{ width: 50, padding: "0 10px" }}>
      <Image src='/message-loading.svg' fit="contain" />
    </div>
  )
}

function messageType ({
    role = 'AI',
    typing = true,
    loading = false,
    messageId = Math.random().toString(),
    content = '您好，我是智能客服，能帮您解答任何政务问题~'
  } = {}) {
  if (role == 'AI') {
    return {
      messageType: 'AI',
      typing: typing,
      messageId: messageId,
      content: !loading ? content : <MessageLoading />,
      createdOn: new Date()
    }
  } else {
    return {
      messageType: 'chat',
      senderId: 'me',
      messageId: Math.random().toString(),
      content: content,
      createdOn: new Date(),
      mine: true,
      attached: false,
      contentType: 'text',
    }
  }
}

function MessageRender({ typing, message, name, time }) {
  return (
    <div className='flex items-center'>
      <div className='avator'>
        <Avatar variant="filled" radius="sm" src="/avator.png" />
      </div>
      <div
        className='lg:max-w-3xl content p-4 bg-white ml-2'
        style={{
          borderRadius: '10px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
          lineHeight: '1.6rem',
          fontFamily: "Helvetica, 'Microsoft YaHei', Arial, sans-serif"
        }}
      >
        <div className='mb-2'>
          <span className='font-bold mr-2'>{name}</span>
          <span className='opacity-80 text-xs'>{dayjs(time).format('MM-DD HH:mm')}</span>
        </div>
        {typing ?
          <TypeAnimation
              style={{ whiteSpace: 'pre-line' }}
              sequence={[ message, 500 ]}
              wrapper="span"
              cursor={true}
            /> : message
          }
      </div>
    </div>
  )
}

const messageStyles = {
  myChatMessageContainer: {
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
  },
  chatContainer: {
    backgroundColor: '#ebf3f8',
    maxWidth: '100%',
    maxHeight: '600px',
    padding: '30px',
  }
}

export default function AIMessages() {
  const initMessage = messageType()
  const [messages, setMessages] = useState([initMessage])
  const [temperature] = useAtom(temperatureAtom)
  const [filterWords] = useAtom(filterWordsAtom)
  const [serviceName] = useAtom(serviceNameAtom)

  const filterWordsList = filterWords !== '' ? filterWords.split('|') : []

  async function askQuestion(data) {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const result = await response.json()
      const content = result.choices[0].message.content

      if ((filterWordsList.length > 0) && filterWordsList.some(v => content.includes(v))) {
         return "很抱歉,我的目的是提供客观、准确的信息,并尊重各种政治观点和立场。请换一个问题"
      } else {
        return content.replace(/(^\\")|(\\"$)/g, "").replace(/^\"|\"$/g, '').replace(/\\n/g, '\n')
      }
    } else {
      return "我不懂您的问题，请换一个～"
    }
  }

  async function handleSend(msg) {
    const msgId = Math.random().toString()

    setMessages((messages) => [
      ...messages,
      messageType({
        role: 'Customer',
        content: msg
      }),
      messageType({
        role: 'AI',
        typing: false,
        loading: true,
        messageId: msgId,
      })
    ])

    const content = await askQuestion({
      model: "chatglm2-6b",
      messages: [
        { role: "user", content: msg }
      ]
    })

    setMessages((messages) => messages.map(item => {
      if (item.messageId == msgId) {
        return messageType({
          content: content
        })
      } else {
        return item
      }
    }))
  }

  function onRenderMessage(messageProps, defaultOnRender) {
    const msg = messageProps.message
    if (msg.messageType === 'AI') {
      return <MessageRender typing={msg.typing} message={msg.content} name={serviceName} time={msg.createdOn} />
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='grow'>
        <MessageThread
          userId={'1'}
          disableEditing
          disableJumpToNewMessageButton
          messages={messages}
          styles={messageStyles}
          onRenderMessage={onRenderMessage}
        />
      </div>

      <SendBox
        styles={{ root: { padding: '10px' } }}
        strings={{ placeholderText: "输入您的问题..." }}
        onSendMessage={handleSend}
        onRenderIcon={() => <IconBrandTelegram stroke={1.5} color="#1877ff"/>}
      />
    </div>
  )
}