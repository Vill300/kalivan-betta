import { useState, useEffect } from 'react'
import './App.css'
import ServerList from './components/ServerList'
import ChannelList from './components/ChannelList'
import Chat from './components/Chat'
import AuthPage from './components/AuthPage'
import { useAuth } from './AuthContext'
import { useLang } from './LangContext'
import { supabase } from './supabaseClient'

function App() {
  const { user, logout, loading } = useAuth()
  const { t } = useLang()
  const [channels, setChannels] = useState([])
  const [messages, setMessages] = useState({})
  const [activeChannelId, setActiveChannelId] = useState(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadChannels = async () => {
      const { data: channelsData, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at')

      if (error) {
        console.error('Error loading channels:', error)
        return
      }

      setChannels(channelsData)
      if (channelsData.length > 0 && !activeChannelId) {
        setActiveChannelId(channelsData[0].id)
      }

      // Load messages for all channels
      const messagesData = {}
      for (const channel of channelsData) {
        const { data: msgs, error: msgError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            profiles:user_id (name)
          `)
          .eq('channel_id', channel.id)
          .order('created_at')

        if (!msgError) {
          messagesData[channel.id] = msgs.map(msg => ({
            id: msg.id,
            author: msg.profiles?.name || 'Unknown',
            text: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString()
          }))
        }
      }
      setMessages(messagesData)
      setLoadingData(false)
    }

    loadChannels()

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const newMessage = payload.new
        // Get user profile for the message author
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', newMessage.user_id)
          .single()

        setMessages(prev => ({
          ...prev,
          [newMessage.channel_id]: [
            ...(prev[newMessage.channel_id] || []),
            {
              id: newMessage.id,
              author: profile?.name || 'Unknown',
              text: newMessage.content,
              time: new Date(newMessage.created_at).toLocaleTimeString()
            }
          ]
        }))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  async function deleteChannel(channelId){
    const { error } = await supabase
      .from('channels')
      .delete()
      .eq('id', channelId)

    if (error) {
      console.error('Error deleting channel:', error)
      return
    }

    setChannels(prev => prev.filter(c => c.id !== channelId))
    setMessages(prev => {
      const newMessages = { ...prev }
      delete newMessages[channelId]
      return newMessages
    })
    // if deleted channel was active, switch to first available or null
    setActiveChannelId(prev => (prev === channelId ? (channels.find(c=>c.id!==channelId)?.id || null) : prev))
  }

  async function sendMessage(channelId, author, text) {
    const { error } = await supabase
      .from('messages')
      .insert({
        channel_id: channelId,
        user_id: user.id,
        content: text
      })

    if (error) {
      console.error('Error sending message:', error)
    }
    // Message will be added via realtime subscription
  }

  const activeChannel = channels.find(c => c.id === activeChannelId)
  const activeMessages = messages[activeChannelId] || []

  if(loading || loadingData) return <div>Loading...</div>
  if(!user) return <AuthPage />

  return (
    <div className="app">
      <ServerList />
      <div className="main-area">
        <ChannelList channels={channels} active={activeChannelId} onSelect={setActiveChannelId} onDelete={deleteChannel} />
        <Chat channel={{ ...activeChannel, messages: activeMessages }} onSend={(author, text) => sendMessage(activeChannelId, author, text)} />
      </div>
      <div className="right-panel">
        <div className="brand">Kalivan</div>
        <div className="user-info">{user?.user_metadata?.name || user?.email} — {t('online')}</div>
        <div style={{marginTop:12}}><button onClick={() => logout()} style={{padding:'6px 10px',borderRadius:8,background:'transparent',border:'1px solid rgba(255,255,255,0.04)',color:'var(--muted)'}}>{t('signout')}</button></div>
      </div>
    </div>
  )
}

export default App
