import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { useLang } from '../LangContext'

export default function SettingsModal({ onClose, initialTab }){
  const { user, login, logout } = useAuth()
  const [tab, setTab] = useState(initialTab || 'account')
  const [name, setName] = useState(user?.name || '')
  const { t, lang, setLang } = useLang()

  useEffect(()=>{
    setName(user?.name || '')
    const onKey = (e)=>{ if(e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [user, onClose])

  function saveAccount(){
    const n = name.trim()
    if(n) login(n)
  }

  function saveApp(){
    try{ localStorage.setItem('kalivan_lang', lang) }catch(e){}
    try{ window.dispatchEvent(new CustomEvent('kalivan:lang', { detail: lang })) }catch(e){}
    onClose()
  }

  function doSignOut(){
    logout()
    onClose()
  }

  return (
    <div className="settings-overlay" onMouseDown={onClose}>
      <div className="settings-modal" onMouseDown={e=>e.stopPropagation()} role="dialog" aria-modal="true">
          <div className="settings-header">
            <h3>{t('settings')}</h3>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        <div className="settings-body">
          <aside className="settings-nav">
            <div className="nav-group">
              <div className="nav-title">{t('settings')}</div>
              <button className={tab==='account'? 'active':''} onClick={()=>setTab('account')}>{t('account')}</button>
              <button className={tab==='language'? 'active':''} onClick={()=>setTab('language')}>{t('language')}</button>
              <button className={tab==='appearance'? '':null} onClick={()=>setTab('appearance')}>{t('appearance')}</button>
              <button className={tab==='voice'? '':null} onClick={()=>setTab('voice')}>{t('voice_video')}</button>
              <button className={tab==='chat'? '':null} onClick={()=>setTab('chat')}>{t('chat')}</button>
              <button className={tab==='notifications'? '':null} onClick={()=>setTab('notifications')}>{t('notifications')}</button>
            </div>
          </aside>
          <div className="settings-panel">
            {tab === 'account' && (
              <div>
                <div className="profile-card">
                  <div className="profile-banner" />
                  <div className="profile-top">
                    <div className="profile-avatar">{(user?.name||'U').slice(0,1)}</div>
                    <div style={{marginLeft:12,flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{fontWeight:800,fontSize:16}}> {user?.name || 'KALIVAN'}</div>
                        <button className="small-btn">{t('edit_profile')}</button>
                      </div>
                      <div style={{color:'var(--muted)',fontSize:13,marginTop:6}}>{user?.name ? user.name.toLowerCase() : 'guest'}</div>
                    </div>
                  </div>

                  <div className="profile-fields">
                    <div className="profile-row">
                      <div>
                        <div className="field-label">{t('display_name')}</div>
                        <div className="field-value">{user?.name || 'KALIVAN'}</div>
                      </div>
                      <div className="field-actions"><button className="tiny">{t('change')}</button></div>
                    </div>

                    <div className="profile-row">
                      <div>
                        <div className="field-label">{t('username_label')}</div>
                        <div className="field-value">{(user?.name||'kalivan').toLowerCase()}</div>
                      </div>
                      <div className="field-actions"><button className="tiny">{t('change')}</button></div>
                    </div>

                    <div className="profile-row">
                      <div>
                        <div className="field-label">{t('email')}</div>
                        <div className="field-value">***********@example.com</div>
                      </div>
                      <div className="field-actions"><button className="tiny">{t('change')}</button></div>
                    </div>

                    
                  </div>
                </div>
              </div>
            )}

            {tab === 'language' && (
              <div>
                <label>{t('language')}</label>
                <select value={lang} onChange={e=>setLang(e.target.value)} style={{width:220,padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'rgba(255,255,255,0.02)',color:'var(--white)'}}>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="uk">Українська</option>
                </select>
                <div style={{marginTop:12}}>
                  <button onClick={saveApp}>{t('save')}</button>
                </div>
              </div>
            )}
            {tab === 'appearance' && (
              <div>{t('appearance')} settings placeholder</div>
            )}
            {tab === 'voice' && (
              <div>{t('voice_video')} settings placeholder</div>
            )}
            {tab === 'chat' && (
              <div>{t('chat')} settings placeholder</div>
            )}
            {tab === 'notifications' && (
              <div>{t('notifications')} settings placeholder</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
