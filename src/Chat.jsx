/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FluentThemeProvider, MessageThread, SendBox } from '@azure/communication-react';
import { MantineProvider, Avatar, Image, Modal, Slider, Text, ActionIcon } from '@mantine/core';
import { IconBrandTelegram, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import "@mantine/core/styles.css"
import './app.css'

const initMessages =  [
  {
    messageType: 'chat',
    senderId: 'ai',
    senderDisplayName: '小智',
    messageId: Math.random().toString(),
    content: '您好，我是智能客服，能帮您解答任何政务问题~',
    createdOn: new Date(),
    mine: false,
    attached: false,
    contentType: 'html'
  }
]

function AIAccount() {
  return <Avatar variant="filled" radius="sm" src="/avator.png" />
}

function Typing() {
  return <div style={{ width: 50, padding: "0 10px" }}><Image src='/loading-2.svg' fit="contain" /></div>
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
  return <IconBrandTelegram stroke={1.5} color="var(--mantine-color-blue-filled)" />
}

export default function Chat() {
  const [messages, setMessages] = useState(initMessages)
  const [openSettings, setOpenSettings] = useState(false)
  const [temperature, setTemperature] = useState(1);

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
      return result.response.data.choices[0].content
    } else {
      console.log("HTTP-Error: " + response.status)
    }
  }

  async function handleSend(msg) {
    const aiId = Math.random().toString()

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
      messageType: 'chat',
      senderId: 'ai',
      senderDisplayName: '小智',
      messageId: aiId,
      content: <Typing />,
      createdOn: new Date(),
      mine: false,
      attached: false,
      contentType: 'html',
    }])

    const content = await askQuestion({
      ask: msg,
      temperature
    })

    setMessages((messages) => messages.map(item => {
      if (item.messageId == aiId) {
        return {
          messageType: 'chat',
          senderId: 'ai',
          senderDisplayName: '小智',
          messageId: Math.random().toString(),
          content: content,
          createdOn: new Date(),
          mine: false,
          attached: false,
          contentType: 'html',
        }
      } else {
        return item
      }
    }))
  }

  function handleCloseSettings() {
    setOpenSettings(false)
  }

  return (
    <div className='chat-box h-full'>
      <FluentThemeProvider>
        <MantineProvider>
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
                messages={messages}
                styles={{
                  chatContainer: {
                    backgroundColor: '#ebf3f8',
                    maxWidth: '100%',
                    padding: '30px',
                  }
                }}
                onRenderAvatar={() => {
                  return (
                    <AIAccount />
                  );
                }}
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
      </FluentThemeProvider>
    </div>
  )
}