import { useEffect, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import dayjs from 'dayjs'
import { MessageThread, SendBox } from '@azure/communication-react'
import { MantineProvider, Avatar, Image, Modal, Slider, Text, ActionIcon } from '@mantine/core'
import { IconBrandTelegram, IconAdjustmentsHorizontal } from '@tabler/icons-react'
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

function AIAccount() {
  return <Avatar variant="filled" radius="sm" src="/avator.png" />
}

function MessageLoading() {
  return <div style={{ width: 50, padding: "0 10px" }}><Image src='/loading-2.svg' fit="contain" /></div>
}

function AIMessage({ typing, message, name, time }) {
  return (
    <div className='flex items-center'>
      <div className='avator'>
        <AIAccount />
      </div>
      <div
        className='lg:max-w-3xl content p-4 bg-white ml-2'
        style={{
          borderRadius: '10px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
          lineHeight: '1.6rem',
          fontFamily: "'Helvetica Neue', Helvetica, 'Microsoft YaHei', '微软雅黑', Arial, sans-serif"
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

function Settings({ openSettings, handleCloseSettings, temperature, setTemperature }) {
  return (
   <Modal centered opened={openSettings} onClose={handleCloseSettings} title="设置客服系统参数">
    <div className="p-10">
      <Text size="sm" className="mb-2">回答多样性 (数值越大，多样性越高)</Text>
      <Slider
        value={temperature}
        onChange={setTemperature}
        color="blue"
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  </Modal>
  )
}

function SendButton() {
  return <IconBrandTelegram stroke={1.5} color="#1877ff"/>
}

export default function Chat() {
  const [messages, setMessages] = useState(initMessages)
  const [openSettings, setOpenSettings] = useState(false)
  const [temperature, setTemperature] = useState(1)

  async function askQuestion(data) {
    const response = await fetch("http://119.3.52.11:8066/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const result = await response.json()
      return result.response.data.choices[0].content.replace(/(^\\")|(\\"$)/g, "").replace(/^\"|\"$/g, '').replace(/\\n/g, '\n')
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
      ask: msg,
      temperature
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
          <div className='navbar'>
            <div className='flex items-center'>
              <div className='h-10 w-10 mr-2'><Image src="/ai.png" fit='contain' /></div>
              <div>
                <h1 className='text-sm font-bold'>智能客服</h1>
                <h2 className='text-xs'>政务系统专家</h2>
              </div>
            </div>
            <div>
              <ActionIcon variant="light" onClick={() => setOpenSettings(true)}>
                <IconAdjustmentsHorizontal stroke={1.5} />
              </ActionIcon>
            </div>
          </div>

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