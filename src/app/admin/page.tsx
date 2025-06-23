import React from 'react'
import Chat from '@/components/Admin/Chat'

const page = () => {
  return (
    <div className='h-full w-full flex flex-col rounded-xl bg-gradient-to-br from-indigo-50 to-teal-50 dark:bg-[#121212] shadow-lg overflow-hidden'>
      <Chat />
    </div>
  )
}

export default page
