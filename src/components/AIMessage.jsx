import { TypeAnimation } from 'react-type-animation'
import dayjs from 'dayjs'
import { Avatar } from '@mantine/core'

export function AIAccount() {
  return <Avatar variant="filled" radius="sm" src="/avator.png" />
}

export default function AIMessage({ typing, message, name, time }) {
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
