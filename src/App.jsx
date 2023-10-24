import { useState } from 'react'
import { MantineProvider } from '@mantine/core'
import AIMessages from '@/components/AIMessage'
import AIChat from '@/components/AIChat'
import Settings from '@/components/Settings'

import "@mantine/core/styles.css"
import '@/styles/app.css'

export default function App() {
  const [openSettings, setOpenSettings] = useState(false)

  function handleCloseSettings() {
    setOpenSettings(false)
  }

  return (
    <div className='app-box h-full'>
      <MantineProvider theme={{ fontFamily: "Helvetica, 'Microsoft YaHei', Arial, sans-serif" }}>

        <AIChat setOpenSettings={setOpenSettings}>
          <AIMessages />
        </AIChat>

        <Settings
          openSettings={openSettings}
          handleCloseSettings={handleCloseSettings}
        />
      </MantineProvider>
    </div>
  )
}