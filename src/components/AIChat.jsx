import { Image, ActionIcon  } from '@mantine/core'
import { IconAdjustmentsHorizontal } from '@tabler/icons-react'

function Navbar({ setOpenSettings }) {
  return (
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
  )
}

export default function AIChat({ children, setOpenSettings }) {
  return (
    <div className='flex flex-col h-full'>
      <Navbar setOpenSettings={setOpenSettings} />

      {children}
    </div>
  )
}