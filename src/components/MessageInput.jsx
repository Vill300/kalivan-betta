import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useLang } from '../LangContext'

export default function MessageInput({onSend, placeholder}){
  const [text, setText] = useState('')
  const { user } = useAuth()
  const { t } = useLang()

  function submit(){
    const t = text.trim()
    if(!t) return
    onSend(user?.name || 'You', t)
    setText('')
  }

  function onKey(e){
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault(); submit()
    }
  }

  return (
    <div className="message-input">
      <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={onKey} placeholder={placeholder || 'Message'} />
      <button onClick={submit}>{t('send')}</button>
    </div>
  )
}
