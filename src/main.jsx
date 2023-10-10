import React from 'react'
import ReactDOM from 'react-dom/client'
import Chat from './Chat.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className='h-full w-full flex flex-col py-10'>
      <div className="text-center mb-5 w-full h-20">
        <img
          className="h-full inline-block"
          src="/ai.jpg"
        />
      </div>

      <div className='px-5 lg:px-10 w-full h-full'>
         <Chat />
      </div>
    </div>
  </React.StrictMode>
)
