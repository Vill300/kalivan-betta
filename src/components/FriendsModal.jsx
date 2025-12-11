// FriendsModal.jsx
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabaseClient'

export default function FriendsModal({ onClose }) {
  const { user } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const modalRef = useRef(null)

  const addFriend = async () => {
    setError('')
    if (!inputValue.trim()) {
      setError('Введите username#discriminator')
      return
    }
    const match = inputValue.trim().match(/^(.+)#(\d{4})$/)
    if (!match) {
      setError('Неверный формат. Используйте Username#0000')
      return
    }
    const username = match[1]
    const discriminator = parseInt(match[2])
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .eq('discriminator', discriminator)
        .single()
      if (profileError || !profile) {
        setError('Пользователь не найден')
        return
      }
      if (profile.id === user.id) {
        setError('Нельзя добавить себя в друзья')
        return
      }
      const { data: existing } = await supabase
        .from('friends')
        .select('id')
        .or(`user_id.eq.${user.id}.and.friend_id.eq.${profile.id},user_id.eq.${profile.id}.and.friend_id.eq.${user.id}`)
        .single()
      if (existing) {
        setError('Запрос уже отправлен или вы уже друзья')
        return
      }
      const { error: insertError } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: profile.id,
          status: 'pending'
        })
      if (insertError) {
        setError('Ошибка при отправке запроса')
        return
      }
      setInputValue('')
      alert('Запрос на дружбу отправлен!')
    } catch (err) {
      setError('Неизвестная ошибка')
    }
  }

  useEffect(() => {
    // поставить фокус на модалку для клавиатурной доступности
    modalRef.current?.focus()

    // запретить скролл бэкграунда (опционально)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // модалка — разметка
  const modal = (
    <div
      className="settings-overlay"
      // overlay это full-screen фон, закрываем только если кликнули по самому overlay
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483000, // очень высокий z-index чтобы перекрыть всё
        pointerEvents: 'auto'
      }}
      onMouseDown={(e) => {
        // закрываем только при клике по самому overlay
        if (e.target === e.currentTarget) {
          console.log('overlay onMouseDown -> onClose()')
          onClose?.()
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          console.log('overlay onClick -> onClose()')
          onClose?.()
        }
      }}
    >
      <div
        className="friends-modal settings-modal"
        ref={modalRef}
        tabIndex={-1}
        style={{
          zIndex: 2147483001,
          background: '#0f1113',
          color: '#fff',
          padding: 16,
          borderRadius: 8,
          width: 360,
          boxSizing: 'border-box',
          pointerEvents: 'auto'
        }}
        // стопаем в capture-фазе, чтобы перехватить глобальные capture-listeners
        onMouseDownCapture={(e) => {
          // лог для отладки
          // console.log('modal onMouseDownCapture', e.target)
          e.stopPropagation()
        }}
        onClickCapture={(e) => {
          // console.log('modal onClickCapture', e.target)
          e.stopPropagation()
        }}
        // а так же в bubble — для надежности
        onMouseDown={(e) => {
          // console.log('modal onMouseDown', e.target)
          e.stopPropagation()
        }}
        onClick={(e) => {
          // console.log('modal onClick', e.target)
          e.stopPropagation()
        }}
      >
        <div className="settings-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Друзья</h3>
          <button
            className="close-btn"
            onClick={() => {
              console.log('close button -> onClose()')
              onClose?.()
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="settings-body" style={{ marginTop: 12 }}>
          <div className="settings-panel">
            <div style={{ marginBottom: 12 }} onClick={(e) => e.stopPropagation()}>
              <label style={{ display: 'block', marginBottom: 6 }}>Добавить друга</label>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Username#0000"
                style={{ width: '100%', padding: 8, borderRadius: 6 }}
                onMouseDown={(e) => {
                  console.log('input onMouseDown')
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  console.log('input onClick')
                  e.stopPropagation()
                }}
                onFocus={() => console.log('input onFocus')}
                onBlur={() => console.log('input onBlur')}
              />
              {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
              <div style={{ marginTop: 8 }}>
                <button onClick={addFriend}>Добавить</button>
              </div>
            </div>

            <div className="incoming-requests" style={{ marginTop: 12 }}>
              <strong>Incoming Requests</strong>
              {/* ... */}
            </div>

            <div className="friends-list" style={{ marginTop: 12 }}>
              <strong>Friends</strong>
              {/* ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // рендерим портал в body
  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null
}