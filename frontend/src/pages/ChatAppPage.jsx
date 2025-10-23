import Logout from '@/components/auth/Logout'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'
import React from 'react'
import { toast } from 'sonner'

const ChatAppPage = () => {
  const hanldeOnClick = async () => {
  try {
    await api.get("/users/test", {withCredentials: true})
    toast.success("ok")
  } catch (error) {
    toast.error("thất bại")
    console.log(error);
    
  }
  }
  return (
    <div>
      <Logout />
      <Button onClick={hanldeOnClick}>test</Button>
    </div>
  )
}

export default ChatAppPage