import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className='h-full w-full flex flex-col py-10'>
      <div className="text-center mb-5 w-full h-20">
        <img
          className="h-full inline-block"
          src="/ai.jpg"
        />
      </div>

      <App />
    </div>
  </React.StrictMode>
)
