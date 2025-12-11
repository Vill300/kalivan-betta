import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useLang } from '../LangContext'

// List of profanities in English, Russian, and Ukrainian
const PROFANITY_LIST = [
  // English profanities
  'damn', 'hell', 'crap', 'ass', 'bitch', 'bastard', 'fuck', 'shit', 'piss', 'dickhead', 'asshole', 'motherfucker',
  // Russian profanities (common mat)
  'бля', 'блять', 'блядь', 'хуй', 'пизда', 'пиздец', 'сука', 'сучка', 'ебать', 'ебу', 'ебёш', 'ебал', 'поебать', 'ебаться', 'нахуй', 'пошел', 'отвали', 'мудак', 'идиот', 'дебил', 'дебилка', 'мудила', 'пиздюк', 'хуйло', 'говно', 'говноед', 'хернею', 'хреню', 'ах', 'бля', 'блин', 'чёрт',
  // Ukrainian profanities
  'бля', 'блять', 'хуй', 'пизда', 'сука', 'ебать', 'нахуй', 'мудак', 'дебил', 'дебилка'
]

function containsProfanity(text) {
  if (!text) return false
  const lowerText = text.toLowerCase().trim()
  return PROFANITY_LIST.some(word => lowerText.includes(word))
}

function isValidPassword(password) {
  // Allow only English letters, numbers, and common special characters
  const englishOnlyRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
  return englishOnlyRegex.test(password)
}

export default function AuthPage(){
  const { login, register } = useAuth()
  const { t, lang, setLang } = useLang()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAuth(){
    setError('')
    setLoading(true)

    try {
      if(!email.trim()){
        setError(t('email') + ' ' + t('required'))
        return
      }

      if(mode === 'login'){
        if(!password.trim()){
          setError(t('password') + ' ' + t('required'))
          return
        }
        // Login logic
        await login(email.trim(), password)
      } else {
        if(!name.trim()){
          setError(t('username') + ' ' + t('required'))
          return
        }
        if(containsProfanity(name)){
          setError(t('profanity_not_allowed'))
          return
        }
        if(!password.trim()){
          setError(t('password') + ' ' + t('required'))
          return
        }
        if(password.length < 8){
          setError(t('password_min_length'))
          return
        }
        if(!isValidPassword(password)){
          setError(t('password_english_only'))
          return
        }
        if(!passwordConfirm.trim()){
          setError(t('confirm_password') + ' ' + t('required'))
          return
        }
        if(password !== passwordConfirm){
          setError(t('passwords_mismatch'))
          return
        }
        // Registration logic
        const result = await register(email.trim(), password, name.trim())
        if (result.user) {
          setError(t('signup_success'))
          setMode('login')
        }
      }
    } catch (err) {
      setError(err.message || t('auth_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">{t('app_name')}</div>
        <div className="auth-subtitle">
          {mode === 'login' ? t('welcome_back') : t('welcome_new')}
        </div>

        <form className="auth-form" onSubmit={(e)=>{ e.preventDefault(); handleAuth() }}>
          {mode === 'register' && (
            <div className="form-group">
              <label>{t('username')}</label>
              <input
                type="text"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder={t('username')}
                autoFocus
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder={t('email')}
              autoFocus={mode === 'login'}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder={t('password')}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label>{t('confirm_password')}</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e)=>setPasswordConfirm(e.target.value)}
                placeholder={t('confirm_password')}
                required
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? t('loading') : (mode === 'login' ? t('signin') : t('signup'))}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'login' ? (
            <>
              {t('no_account')} <button onClick={()=>setMode('register')} className="toggle-btn">{t('signup')}</button>
            </>
          ) : (
            <>
              {t('have_account')} <button onClick={()=>setMode('login')} className="toggle-btn">{t('signin')}</button>
            </>
          )}
        </div>

        {/* Language switcher in bottom-left */}
        <div className="auth-lang-switcher">
          <button className="lang-btn" title="Language" onClick={()=>setShowLangMenu(v=>!v)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              <text x="7" y="9.5" fontSize="5.5" fontWeight="bold" textAnchor="middle" fill="currentColor">A</text>
              <rect x="10" y="10" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor"/>
              <line x1="12" y1="17" x2="18" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="18" y1="17" x2="12" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
          {showLangMenu && (
            <div className="lang-dropdown">
              {['en', 'ru', 'uk'].map(l => (
                <button key={l} onClick={()=>{ setLang(l); setShowLangMenu(false) }} className={`lang-option ${lang === l ? 'active' : ''}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
