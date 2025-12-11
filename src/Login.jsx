import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { useLang } from './LangContext'

export default function Login(){
  const [name, setName] = useState('')
  const { login } = useAuth()
  const { t } = useLang()

  function submit(e){
    e?.preventDefault()
    const n = name.trim()
    if(!n) return
    login(n)
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <form onSubmit={submit} style={{background:'#0b0f12',padding:24,borderRadius:12,width:360,boxShadow:'0 6px 18px rgba(0,0,0,0.6)'}}>
        <h2 style={{margin:0,marginBottom:12}}>{t('signin_title')}</h2>
        <label style={{display:'block',color:'#9aa4b2',marginBottom:8,fontSize:13}}>{t('username')}</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'rgba(255,255,255,0.02)',color:'#e6eef6'}} />
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
          <button type="submit" style={{background:'#5865f2',color:'white',padding:'8px 12px',borderRadius:8,border:'none'}}>{t('signin')}</button>
        </div>
      </form>
    </div>
  )
}
