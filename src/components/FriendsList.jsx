import React from 'react'
import { useLang } from '../LangContext'

export default function FriendsList({ friends }) {
  const { t } = useLang()
  
  if (!friends || friends.length === 0) {
    return (
      <div className="friends-list">
        <div className="friends-header">{t('friends')}</div>
        <div className="no-friends">{t('no_friends_yet')}</div>
      </div>
    )
  }

  return (
    <div className="friends-list">
      <div className="friends-header">{t('friends')}</div>
      <div className="friends-scroll">
        {friends.map(friend => (
          <div className="friend-item" key={friend.friend_id}>
            <div className="friend-avatar">{friend.profiles?.username?.charAt(0).toUpperCase()}</div>
            <div className="friend-info">
              <div className="friend-name">{friend.profiles?.username}</div>
              {friend.profiles?.status && (
                <div className="friend-status">
                  <span className={`status-indicator ${friend.profiles.status}`}></span>
                  <span className="status-text">
                    {friend.profiles.status === 'online' ? t('online') : (
                      friend.profiles.last_seen ? (
                        t('last_seen') + ' ' + new Date(friend.profiles.last_seen).toLocaleString()
                      ) : t('offline')
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}