import React from 'react'
import ReactDOM from 'react-dom/client'
import Chat from './Chat.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className='h-full w-full flex flex-col'>
      <div className="text-center mb-5 mt-10 w-full h-20">
        <img
          className="h-full inline-block"
          src="/logo.jpg"
        />
      </div>

      <div className='lg:px-20 lg:pb-20 w-full h-full'>
         <Chat />
      </div>
    </div>
  </React.StrictMode>
)
