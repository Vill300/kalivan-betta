import React from 'react'
import { useLang } from '../LangContext'

export default function FriendsModal({ onClose }){
  const { t } = useLang()

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-modal">
        <div className="settings-header">
          <h3>{t('friends')}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="settings-body">
          <div className="settings-panel">
            <p>Список друзей будет здесь.</p>
            {/* Здесь можно добавить логику для списка друзей */}
          </div>
        </div>
      </div>
    </>
  )
}