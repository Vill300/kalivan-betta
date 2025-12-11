import React, { useEffect, useRef, useState } from 'react'

import { useLang } from '../LangContext'
import FriendsModal from './FriendsModal'


export default function ChannelList({channels, active, onSelect, onDelete}){
  const { t } = useLang()
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, channelId: null })
  const [friendsModalOpen, setFriendsModalOpen] = useState(false)

  const containerRef = useRef()

  useEffect(()=>{
    function onKey(e){ if(e.key === 'Escape') setMenu({ visible:false, x:0, y:0, channelId:null }) }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [])

  function openMenu(e, ch){
    e.preventDefault()
    setMenu({ visible: true, x: e.clientX, y: e.clientY, channelId: ch.id })
  }

  function closeMenu(){ setMenu({ visible:false, x:0, y:0, channelId:null }) }

  function openFriendsModal(){
    setFriendsModalOpen(true)
  }

  function handleDelete(){
    if(menu.channelId && onDelete){
      onDelete(menu.channelId)
    }
    closeMenu()
  }

  return (
    <aside className="channel-list" ref={containerRef}>
      <div className="channel-top">
        <div className="top-item" onClick={openFriendsModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {t('friends')}
        </div>
      </div>
      <div className="channels-header">{t('channels')}</div>
      <div className="channels">
        {channels.map(ch => (
          <div key={ch.id}
            className={`channel ${ch.id===active? 'active':''}`}
            onClick={()=>onSelect(ch.id)}
            onContextMenu={(e)=>openMenu(e, ch)}>
            # {ch.name}
          </div>
        ))}
      </div>

      <div className="channel-footer">
        <button className="footer-add" title="Add">+</button>
      </div>

      {menu.visible && (
        <>
          <div className="context-overlay" onClick={closeMenu} />
          <div className="channel-context-menu" style={{top: menu.y, left: menu.x}}>
            <button onClick={handleDelete}>{t('delete_channel')}</button>
          </div>
        </>
      )}

      {friendsModalOpen && <FriendsModal onClose={() => setFriendsModalOpen(false)} />}
    </aside>
  )
}
