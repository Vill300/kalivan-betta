import React, { useEffect, useRef, useState } from 'react'

import { useLang } from '../LangContext'

export default function ChannelList({channels, active, onSelect, onDelete}){
  const { t } = useLang()
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, channelId: null })
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

  function handleDelete(){
    if(menu.channelId && onDelete){
      onDelete(menu.channelId)
    }
    closeMenu()
  }

  return (
    <aside className="channel-list" ref={containerRef}>
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
    </aside>
  )
}
