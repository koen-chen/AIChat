import { useEffect, useState } from "react"
import { MantineProvider } from "@mantine/core"
import Chat, { Bubble, useMessages } from '@chatui/core'
import "@mantine/core/styles.css"
import '@chatui/core/dist/index.css'

const user = {
  avatar: '/avator.png'
}

const initialMessages = [
  {
    type: 'text',
    content: { text: '您好，我是智能助理，您的贴心小助手~' },
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
      // headers: {
      // 'Content-Type': 'application/json;charset=utf-8'
      // },
      // body: JSON.stringify(data)
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

  return (
    <MantineProvider >
      <Chat
        navbar={{ title: '智能客服' }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
      />
    </MantineProvider>
  )
}

export default App
