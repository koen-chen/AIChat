import { useState, useRef } from "react"
import { MantineProvider } from "@mantine/core"
import Chat, { Bubble, useMessages } from '@chatui/core'
import { Slider, Text, Modal } from '@mantine/core';
import "@mantine/core/styles.css"
import '@chatui/core/dist/index.css'
import './app.css'

const user = {
  avatar: '/avator.png',
  name: '小爱'
}

const initialMessages = [
  {
    key: 1,
    type: 'text',
    content: { text: '您好，我是智能客服，能帮您解答任何政务问题~' },
    user,
    createdAt: Date.now(),
    hasTime: true,
  }
];

function App() {
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);
  const [openSettings, setOpenSettings] = useState(false)
  const [temperature, setTemperature] = useState(1);
  const msgRef = useRef(null);

  window.appendMsg = appendMsg;
  window.msgRef = msgRef;

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

  async function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      })

      setTyping(true)

      const content = await askQuestion({
        ask: val,
        temperature
      })

      setTyping(false)

      appendMsg({
        type: 'text',
        content: { text: content },
        user,
      })
    }
  }

  function renderMessageContent(msg) {
    const { type, content } = msg

    switch (type) {
      case 'text':
        return <Bubble content={content.text} />
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        )
      default:
        return null
    }
  }

  function handleCloseSettings() {
    setOpenSettings(false)
  }

  return (
    <MantineProvider>
      <div className="grow px-5 lg:px-10">
        <Chat
          elderMode
          navbar={{
            rightContent: [
              {
                img: "/adjustments-horizontal.svg",
                title: 'Applications',
                size: 'lg',
                onClick() {
                  setOpenSettings(true)
                }
              }
            ],
            title: '智能客服',
            desc: '政务系统专家',
            align: 'left',
            logo: '/logo.png'
          }}
          messages={messages}
          renderMessageContent={renderMessageContent}
          onSend={handleSend}
          placeholder="请输入您的问题..."
        />

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
      </div>
    </MantineProvider>
  )
}

export default App
