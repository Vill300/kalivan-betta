import React, { useState, useEffect } from 'react'
import { useLang } from '../LangContext'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabaseClient'

export default function FriendsModal({ onClose }){
  const { t } = useLang()
  const { user } = useAuth()
  const [friendUsername, setFriendUsername] = useState('')
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFriends()
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

    if (error) {
      console.error('Error loading friends:', error)
      return
    }

    setFriends(data)
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

    const { error } = await supabase
      .from('friends')
      .insert({
        user_id: user.id,
        friend_id: profile.id
      })

    if (error) {
      console.error('Error adding friend:', error)
      alert('Error adding friend')
    } else {
      setFriendUsername('')
      loadFriends()
    }
    setLoading(false)
  }

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="friends-modal settings-modal">
        <div className="settings-header">
          <h3>{t('friends')}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="settings-body">
          <div className="settings-panel">
            <div style={{marginBottom: '16px'}}>
              <label>{t('add_friend')}</label>
              <input 
                type="text" 
                placeholder="Username#0000" 
                style={{width: '100%', marginTop: '6px'}} 
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
              />
              <button style={{marginTop: '8px'}} onClick={addFriend} disabled={loading}>
                {loading ? 'Adding...' : t('add')}
              </button>
            </div>
            <div>
              <h4>Friends List:</h4>
              {friends.map(friend => (
                <div key={friend.id}>
                  {friend.friend.name}#{friend.friend.discriminator.toString().padStart(4, '0')} - {friend.status}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}