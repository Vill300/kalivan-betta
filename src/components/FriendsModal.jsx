import React, { useState, useEffect } from 'react'
import { useLang } from '../LangContext'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabaseClient'

export default function FriendsModal({ onClose }){
  const { t } = useLang()
  const { user } = useAuth()
  const [friendUsername, setFriendUsername] = useState('')
  const [friends, setFriends] = useState([])
  const [incomingRequests, setIncomingRequests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFriends()
    loadIncomingRequests()
  }, [])

  async function loadFriends() {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        status,
        friend:friend_id (name, discriminator)
      `)
      .eq('user_id', user.id)
      .eq('status', 'accepted')

    if (error) {
      console.error('Error loading friends:', error)
      return
    }

    setFriends(data)
  }

  async function loadIncomingRequests() {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        status,
        sender:profiles!friends_user_id_fkey (name, discriminator)
      `)
      .eq('friend_id', user.id)
      .eq('status', 'pending')

    if (error) {
      console.error('Error loading incoming requests:', error)
      return
    }

    setIncomingRequests(data)
  }

  async function addFriend() {
    if (!friendUsername.trim()) return

    setLoading(true)
    const [name, disc] = friendUsername.split('#')
    if (!name || !disc) {
      alert('Invalid username format. Use Name#0000')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('name', name)
      .eq('discriminator', parseInt(disc))
      .single()

    if (profileError || !profile) {
      alert('User not found')
      setLoading(false)
      return
    }

    if (profile.id === user.id) {
      alert('You cannot add yourself as a friend')
      setLoading(false)
      return
    }

    // Check if already friends or pending
    const { data: existing } = await supabase
      .from('friends')
      .select('id, status')
      .or(`and(user_id.eq.${user.id},friend_id.eq.${profile.id}),and(user_id.eq.${profile.id},friend_id.eq.${user.id})`)
      .maybeSingle()

    if (existing) {
      if (existing.status === 'accepted') {
        alert('Already friends')
      } else {
        alert('Friend request already sent or pending')
      }
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('friends')
      .insert({
        user_id: user.id,
        friend_id: profile.id,
        status: 'pending'
      })

    if (error) {
      console.error('Error sending friend request:', error)
      alert('Error sending friend request')
    } else {
      setFriendUsername('')
      loadFriends()
    }
    setLoading(false)
  }

  async function acceptRequest(id) {
    const { error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', id)

    if (error) {
      console.error('Error accepting request:', error)
      alert('Error accepting request')
    } else {
      loadFriends()
      loadIncomingRequests()
    }
  }

  async function declineRequest(id) {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error declining request:', error)
      alert('Error declining request')
    } else {
      loadIncomingRequests()
    }
  }

  return (
    <>
      <div className="settings-overlay" onClick={() => { console.log('overlay click'); onClose(); }} />
      <div className="friends-modal settings-modal" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>{t('friends')}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="settings-body">
          <div className="settings-panel">
            <div style={{marginBottom: '16px'}} onClick={(e) => e.stopPropagation()}>
              <label>{t('add_friend')}</label>
              <input onClick={(e) => { console.log('input click'); e.stopPropagation(); }} onMouseDown={(e) => { console.log('input mousedown'); e.stopPropagation(); }} 
                type="text" 
                placeholder="Username#0000" 
                style={{width: '100%', marginTop: '6px'}} 
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
              />
              <button style={{marginTop: '8px'}} onClick={addFriend} disabled={loading}>
                {loading ? 'Sending...' : t('add')}
              </button>
            </div>
            <div style={{marginBottom: '16px'}}>
              <h4>Incoming Requests:</h4>
              {incomingRequests.map(request => (
                <div key={request.id} style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                  <span>{request.sender.name}#{request.sender.discriminator.toString().padStart(4, '0')}</span>
                  <button onClick={() => acceptRequest(request.id)} style={{marginLeft: '8px'}}>Accept</button>
                  <button onClick={() => declineRequest(request.id)} style={{marginLeft: '4px'}}>Decline</button>
                </div>
              ))}
            </div>
            <div>
              <h4>Friends:</h4>
              {friends.map(friend => (
                <div key={friend.id}>
                  {friend.friend.name}#{friend.friend.discriminator.toString().padStart(4, '0')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}