import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'

const servers = [ 'K' ]

function initials(name){
  if(!name) return 'U'
  return name.split(' ').map(s=>s[0]?.toUpperCase()).slice(0,2).join('')
}

export default function ServerList(){
  const { user } = useAuth()
  const [muted, setMuted] = useState(()=>{ try { return JSON.parse(localStorage.getItem('kalivan_muted')) } catch(e){ return false } })
  const [deaf, setDeaf] = useState(()=>{ try { return JSON.parse(localStorage.getItem('kalivan_deaf')) } catch(e){ return false } })

  useEffect(()=>{ localStorage.setItem('kalivan_muted', JSON.stringify(muted)) }, [muted])
  useEffect(()=>{ localStorage.setItem('kalivan_deaf', JSON.stringify(deaf)) }, [deaf])

  return (
    <>
      <div className="server-list">
        {servers.map((s, i) => (
          <div key={i} className={`server ${i===0? 'active':''}`} title={`Kalivan`}>
            {s}
          </div>
        ))}
        <div className="server-add" title="Add" onClick={()=>{ console.log('Add server clicked') }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div className="left-bottom-panel" role="region" aria-label="User controls">
        <div className="lb-item lb-avatar" title={user?.name || 'You'}>{initials(user?.name)}</div>
        <div className="lb-meta">
          <div className="lb-name">{(user?.name || 'You').toUpperCase()}</div>
          <div className="lb-handle">{user?.name ? user.name.toLowerCase() : 'guest'}</div>
        </div>
        <div className="lb-actions">
          <button className={`lb-btn ${muted? 'active':''}`} title={muted? 'Unmute' : 'Mute'} onClick={()=>setMuted(v=>!v)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className={`lb-btn ${deaf? 'active':''}`} title={deaf? 'Undeafen' : 'Deafen'} onClick={()=>setDeaf(v=>!v)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13v-1a9 9 0 0 1 18 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 13a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a2 2 0 0 0-2-2zM21 13a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      
      </div>
    </>
  )
}
