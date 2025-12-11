
import React from 'react'
import MessageInput from './MessageInput'
import { useLang } from '../LangContext'

export default function Chat({channel, onSend, userName}){
  const { t } = useLang()
  if(!channel) return <div className="chat"><div className="chat-header">{t('no_channel')}</div></div>

  return (
    <section className="chat">
      <div className="chat-header"># {channel.name}</div>
      <div className="messages">
        {channel.messages.map(m=> (
          <div className="message" key={m.id}>
            <div className="author">{m.author === 'You' ? userName : m.author}</div>
            <div className="text">{m.text}</div>
          </div>
        ))}
      </div>
      <MessageInput placeholder={t('message_placeholder', { channel: channel.name })} onSend={(author, text)=> onSend(author, text)} userName={userName} />
    </section>
  )
}
