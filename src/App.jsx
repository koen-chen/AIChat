import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import Chat, { Bubble, useMessages } from '@chatui/core';
import '@chatui/core/dist/index.css';

const imgList = [
  "https://img.3dmgame.com/uploads/images2/news/20230721/1689923603_802737.jpg",
  "https://img.3dmgame.com/uploads/images2/news/20230721/1689923616_645981.jpg",
  "https://img.3dmgame.com/uploads/images2/news/20230721/1689923616_974072.jpg",
  "https://img.3dmgame.com/uploads/images2/news/20230721/1689923602_213816.jpg",
  "https://img.3dmgame.com/uploads/images2/news/20230721/1689923492_327460.jpg"
]
const initialMessages = [
  {
    type: 'text',
    content: { text: '主人好，我是智能助理，你的贴心小助手~' },
    user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
  },
  {
    type: 'text',
    content: { text: '半夜给小主发福利！' },
    user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
  },
  {
    type: 'image',
    content: {
      picUrl: 'https://img.3dmgame.com/uploads/images2/news/20230721/1689923473_350301.jpg',
    },
    user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
  },
  {
    type: 'image',
    content: {
      picUrl: 'https://img.3dmgame.com/uploads/images2/news/20230721/1689923475_114422.jpg',
    },
    user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
  },
  {
    type: 'image',
    content: {
      picUrl: 'https://img.3dmgame.com/uploads/images2/news/20230721/1689923495_334377.jpg',
    },
    user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
  },
];

function App() {
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);

  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      // TODO: 发送请求
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      setTyping(true);

      // 模拟回复消息
      setTimeout(() => {
        const index = Math.floor((Math.random()* imgList.length))
        appendMsg({
          type: 'text',
          content: { text: '拿去撸！' },
          user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
        });
        appendMsg({
          type: 'image',
          content: {
            picUrl: imgList[index],
          },
          user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
        });
      }, 1000);
    }
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content.text} />;
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      default:
        return null;
    }
  }
  return (
    <MantineProvider >
      <Chat
        navbar={{ title: '智能助理' }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
      />
    </MantineProvider>
  )
}

export default App
