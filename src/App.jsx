import { useState } from "react"
import { MantineProvider } from "@mantine/core"
import Chat, { Bubble, useMessages } from '@chatui/core'
import { Slider, Text, Modal } from '@mantine/core';
import "@mantine/core/styles.css"
import '@chatui/core/dist/index.css'
import './app.css'

const user = {
  avatar: '/avator.png'
}

const initialMessages = [
  {
    type: 'text',
    content: { text: '您好，我是智能助理，您的生活顾问~' },
    user,
  }
];

function App() {
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);
  const { questionResult, setQuestionResult } = useState('')

  async function askQuestion(data = {}) {
    const response = await fetch("http://119.3.52.11:8066/", {
      method: 'POST',
      mode: 'no-cors',
      headers: {
      'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('result', result)
      setQuestionResult(result)
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
      await askQuestion()

      console.log(questionResult)

      appendMsg({
        type: 'text',
        content: { text: '拿去撸！' },
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

  const [openSettings, setOpenSettings] = useState(false)
  const [temperature, setTemperature] = useState(40);
  return (
    <MantineProvider >
      <Chat
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
          desc: '您的生活顾问',
          align: 'left',
          logo: '/logo.png'
        }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
      />

      <Modal centered opened={openSettings} onClose={handleCloseSettings} title="设置客服系统参数">
        <div className="p-10">
          <Text size="sm" className="mb-2">回答多样性 (数值越大，多样性越大)</Text>
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
    </MantineProvider>
  )
}

export default App
