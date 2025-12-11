import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { useLang } from '../LangContext'
import { supabase } from '../supabaseClient'

export default function FriendsModal({ onClose }){
  const { user } = useAuth()
  const { t } = useLang()
  const [friendSearch, setFriendSearch] = useState('')
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(()=>{
    loadFriends()
    const onKey = (e)=>{ if(e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [user, onClose])

  async function loadFriends() {
    // Load accepted friends
    const { data: friendsData } = await supabase
      .from('friends')
      .select(`
        id,
        requester:requester_id (name, discriminator),
        addressee:addressee_id (name, discriminator)
      `)
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .eq('status', 'accepted')

    const friendsList = friendsData?.map(f => ({
      id: f.id,
      name: f.requester_id === user.id ? f.addressee.name + '#' + f.addressee.discriminator.toString().padStart(4, '0') : f.requester.name + '#' + f.requester.discriminator.toString().padStart(4, '0')
    })) || []

    setFriends(friendsList)

    // Load pending requests
    const { data: requestsData } = await supabase
      .from('friends')
      .select(`
        id,
        requester:requester_id (name, discriminator),
        addressee:addressee_id (name, discriminator)
      `)
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .eq('status', 'pending')

    const requestsList = requestsData?.map(r => ({
      id: r.id,
      name: r.requester_id === user.id ? r.addressee.name + '#' + r.addressee.discriminator.toString().padStart(4, '0') : r.requester.name + '#' + r.requester.discriminator.toString().padStart(4, '0'),
      outgoing: r.requester_id === user.id
    })) || []

    setRequests(requestsList)
  }

  async function sendFriendRequest() {
    const search = friendSearch.trim()
    if (!search) return

    // Parse name#discriminator
    const match = search.match(/^(.+)#(\d{4})$/)
    if (!match) return alert('Invalid format. Use name#0001')

    const name = match[1]
    const discriminator = parseInt(match[2])

    // Find user
    const { data: userData } = await supabase
      .from('profiles')
      .select('id')
      .eq('name', name)
      .eq('discriminator', discriminator)
      .single()

    if (!userData) return alert('User not found')

    // Check if already friends or requested
    const { data: existing } = await supabase
      .from('friends')
      .select('id')
      .or(`and(requester_id.eq.${user.id},addressee_id.eq.${userData.id}),and(requester_id.eq.${userData.id},addressee_id.eq.${user.id})`)

    if (existing && existing.length > 0) return alert('Already friends or request exists')

    // Send request
    await supabase
      .from('friends')
      .insert({
        requester_id: user.id,
        addressee_id: userData.id,
        status: 'pending'
      })

    setFriendSearch('')
    loadFriends()
  }

  async function acceptRequest(id) {
    await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', id)
    loadFriends()
  }

  async function declineRequest(id) {
    await supabase
      .from('friends')
      .update({ status: 'declined' })
      .eq('id', id)
    loadFriends()
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onMouseDown={e=>e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="settings-header">
          <h3>{t('friends')}</h3>
          <button type="button" className="close-btn" onMouseDown={onClose}>✕</button>
        </div>
        <div className="settings-body">
          <div className="settings-panel" style={{padding:20}}>
            <div style={{marginBottom:16}}>
              <input
                type="text"
                placeholder="name#0001"
                value={friendSearch}
                onChange={e => setFriendSearch(e.target.value)}
                style={{width:200,padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'rgba(255,255,255,0.02)',color:'var(--white)'}}
              />
              <button onClick={sendFriendRequest} style={{marginLeft:8}}>Add Friend</button>
            </div>

            <div>
              <h4>{t('friends')}</h4>
              {friends.map(f => (
                <div key={f.id} style={{padding:8, border:'1px solid rgba(255,255,255,0.04)', borderRadius:8, marginBottom:8}}>
                  {f.name}
                </div>
              ))}
            </div>

            <div style={{marginTop:16}}>
              <h4>{t('requests')}</h4>
              {requests.map(r => (
                <div key={r.id} style={{padding:8, border:'1px solid rgba(255,255,255,0.04)', borderRadius:8, marginBottom:8, display:'flex', justifyContent:'space-between'}}>
                  <span>{r.name}</span>
                  {!r.outgoing && (
                    <div>
                      <button onClick={() => acceptRequest(r.id)}>Accept</button>
                      <button onClick={() => declineRequest(r.id)} style={{marginLeft:8}}>Decline</button>
                    </div>
                  )}
                  {r.outgoing && <span>Pending</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}