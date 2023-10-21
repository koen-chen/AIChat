import { useState } from 'react'
import { MessageThread, SendBox } from '@azure/communication-react'
import { MantineProvider, Image } from '@mantine/core'
import { IconBrandTelegram } from '@tabler/icons-react'
import AIMessage, { AIAccount } from './components/AIMessage'
import Navbar from './components/Navbar'
import Settings from './components/Settings'

import "@mantine/core/styles.css"
import './app.css'

const fontTheme = {
  fontFamily: "'Helvetica Neue', Helvetica, 'Microsoft YaHei', '微软雅黑', Arial, sans-serif"
}

const chatStyles = {
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

const initMessages =  [
  {
    messageType: 'AI',
    typing: true,
    senderName: '小智',
    messageId: Math.random().toString(),
    content: "您好，我是智能客服，能帮您解答任何政务问题~",
    createdOn: new Date()
  }
]

function MessageLoading() {
  return <div style={{ width: 50, padding: "0 10px" }}><Image src='/loading-2.svg' fit="contain" /></div>
}

function SendButton() {
  return <IconBrandTelegram stroke={1.5} color="#1877ff"/>
}

export default function Chat() {
  const [messages, setMessages] = useState(initMessages)
  const [openSettings, setOpenSettings] = useState(false)
  const [temperature, setTemperature] = useState(1)

  async function askQuestion(data) {
    const response = await fetch("https://xiongda.mynatapp.cc/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const result = await response.json()
      return result.response.choices[0].message.content.replace(/(^\\")|(\\"$)/g, "").replace(/^\"|\"$/g, '').replace(/\\n/g, '\n')
    } else {
      return "我不懂您的问题，请换一个问题～"
    }
  }

  async function handleSend(msg) {
    const msgId = Math.random().toString()

    setMessages((messages) => [...messages, {
      messageType: 'chat',
      senderId: 'me',
      messageId: Math.random().toString(),
      content: msg,
      createdOn: new Date(),
      mine: true,
      attached: false,
      contentType: 'text',
    }, {
      messageType: 'AI',
      senderName: '小智',
      typing: false,
      messageId: msgId,
      content: <MessageLoading />,
      createdOn: new Date()
    }])

    const content = await askQuestion({
      model: "chatglm2-6b",
      messages: [
        { role: "user", content: msg }
      ]
    })

    setMessages((messages) => messages.map(item => {
      if (item.messageId == msgId) {
        return {
          messageType: 'AI',
          senderName: '小智',
          typing: true,
          messageId: Math.random().toString(),
          content: content,
          createdOn: new Date()
        }
      } else {
        return item
      }
    }))
  }

  function handleCloseSettings() {
    setOpenSettings(false)
  }

  function onRenderMessage(messageProps, defaultOnRender) {
    const msg = messageProps.message
    if (msg.messageType === 'AI') {
      return <AIMessage typing={msg.typing} message={msg.content} name={msg.senderName} time={msg.createdOn} />
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>
  }

  return (
    <div className='chat-box h-full'>
      <MantineProvider theme={fontTheme}>
        <div className='flex flex-col h-full'>
         <Navbar setOpenSettings={setOpenSettings} />

          <div className='grow'>
            <MessageThread
              userId={'1'}
              disableEditing
              disableJumpToNewMessageButton
              messages={messages}
              styles={chatStyles}
              onRenderMessage={onRenderMessage}
              onRenderAvatar={() => (<AIAccount />)}
            />
          </div>

          <SendBox
            styles={{ root: { padding: '10px' } }}
            strings={{ placeholderText: "输入您的问题..." }}
            onSendMessage={handleSend}
            onRenderIcon={() => <SendButton />}
          />
        </div>

        <Settings
          openSettings={openSettings}
          handleCloseSettings={handleCloseSettings}
          temperature={temperature}
          setTemperature={setTemperature}
        />
      </MantineProvider>
    </div>
  )
}