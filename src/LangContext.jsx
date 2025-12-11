import React, { createContext, useContext, useEffect, useState } from 'react'

const translations = {
  en: {
    signin_title: 'Sign in to Kalivan',
    username: 'Username',
    signin: 'Sign in',
    channels: 'Direct Messages',
    no_channel: 'No channel selected',
    message_placeholder: 'Message #{channel}',
    settings: 'Settings',
    account: 'Account',
    app: 'App',
    save: 'Save',
    signout: 'Sign out',
    online: 'Online',
    send: 'Send'
    ,friends: 'Friends'
    ,language: 'Language'
    ,delete_channel: 'Delete channel'
    ,edit_profile: 'Edit profile'
    ,display_name: 'Display name'
    ,username_label: 'Username'
    ,email: 'Email'
    ,change: 'Change'
    ,delete: 'Delete'
    ,appearance: 'Appearance'
    ,voice_video: 'Voice & Video'
    ,chat: 'Chat'
    ,notifications: 'Notifications'
    
    
    ,app_name: 'Kalivan'
    ,welcome_back: 'Welcome back to Kalivan'
    ,welcome_new: 'Create your account'
    ,password: 'Password'
    ,signup: 'Sign up'
    ,no_account: 'Don\'t have an account?'
    ,have_account: 'Already have an account?'
    ,required: 'is required'
    ,confirm_password: 'Confirm password'
    ,passwords_mismatch: 'Passwords do not match'
    ,profanity_not_allowed: 'Username contains inappropriate language'
    ,password_english_only: 'Password must contain only English characters and numbers'
    ,password_min_length: 'Password must be at least 8 characters'
    ,loading: 'Loading...'
    ,auth_error: 'Authentication error'
    ,signup_success: 'Registration successful, please sign in'
    ,email_already_exists: 'Email already exists'
  },
  ru: {
    signin_title: 'Войдите в Kalivan',
    username: 'Имя пользователя',
    signin: 'Войти',
    channels: 'Личные сообщения',
    no_channel: 'Канал не выбран',
    message_placeholder: 'Сообщение #{channel}',
    settings: 'Настройки',
    account: 'Аккаунт',
    app: 'Приложение',
    save: 'Сохранить',
    signout: 'Выйти',
    online: 'В сети',
    send: 'Отправить'
    ,friends: 'Друзья'
    ,language: 'Язык'
    ,delete_channel: 'Удалить канал'
    ,edit_profile: 'Редактировать профиль'
    ,display_name: 'Отображаемое имя'
    ,username_label: 'Имя пользователя'
    ,email: 'Электронная почта'
    ,change: 'Изменить'
    ,delete: 'Удалить'
    ,appearance: 'Внешний вид'
    ,voice_video: 'Голос и видео'
    ,chat: 'Чат'
    ,notifications: 'Уведомления'
    
    
    ,app_name: 'Kalivan'
    ,welcome_back: 'Добро пожаловать в Kalivan'
    ,welcome_new: 'Создайте свой аккаунт'
    ,password: 'Пароль'
    ,signup: 'Зарегистрироваться'
    ,no_account: 'Нет аккаунта?'
    ,have_account: 'Уже есть аккаунт?'
    ,required: 'обязательно'
    ,confirm_password: 'Повторите пароль'
    ,passwords_mismatch: 'Пароли не совпадают'
    ,profanity_not_allowed: 'Имя пользователя содержит ненормативную лексику'
    ,password_english_only: 'Пароль должен содержать только английские символы и цифры'
    ,password_min_length: 'Пароль должен содержать минимум 8 символов'
    ,loading: 'Загрузка...'
    ,auth_error: 'Ошибка аутентификации'
    ,signup_success: 'Регистрация успешна, войдите в систему'
    ,email_already_exists: 'Электронная почта уже используется'
  },
  uk: {
    signin_title: 'Увійдіть в Kalivan',
    username: 'Ім’я користувача',
    signin: 'Увійти',
    channels: 'Особисті повідомлення',
    no_channel: 'Канал не вибрано',
    message_placeholder: 'Повідомлення #{channel}',
    settings: 'Налаштування',
    account: 'Акаунт',
    app: 'Додаток',
    save: 'Зберегти',
    signout: 'Вийти',
    online: 'Онлайн',
    send: 'Відправити'
    ,friends: 'Друзья'
    ,language: 'Мова'
    ,delete_channel: 'Видалити канал'
    ,edit_profile: 'Редагувати профіль'
    ,display_name: 'Відображуване ім’я'
    ,username_label: 'Ім’я користувача'
    ,email: 'Електронна пошта'
    ,change: 'Змінити'
    ,delete: 'Видалити'
    ,appearance: 'Зовнішній вигляд'
    ,voice_video: 'Голос і відео'
    ,chat: 'Чат'
    ,notifications: 'Сповіщення'
    
    
    ,app_name: 'Kalivan'
    ,welcome_back: 'З поверненням до Kalivan'
    ,welcome_new: 'Створіть свій акаунт'
    ,password: 'Пароль'
    ,signup: 'Зареєструватися'
    ,no_account: 'Немає акаунту?'
    ,have_account: 'Вже маєте акаунт?'
    ,required: 'необхідно'
    ,confirm_password: 'Повторіть пароль'
    ,passwords_mismatch: 'Паролі не збігаються'
    ,profanity_not_allowed: 'Ім\'я користувача містить ненормативну лексику'
    ,password_english_only: 'Пароль має містити лише англійські символи та цифри'
    ,password_min_length: 'Пароль повинен містити мінімум 8 символів'
    ,loading: 'Завантаження...'
    ,auth_error: 'Помилка аутентифікації'
    ,signup_success: 'Реєстрація успішна, увійдіть в систему'
    ,email_already_exists: 'Електронна пошта вже використовується'
  }
}

const LangContext = createContext(null)

export function LangProvider({ children }){
  const [lang, setLang] = useState(()=>{
    try{ return localStorage.getItem('kalivan_lang') || 'ru' }catch(e){ return 'ru' }
  })

  useEffect(()=>{
    try{ localStorage.setItem('kalivan_lang', lang) }catch(e){}
  }, [lang])

  useEffect(()=>{
    // listen for external language change events (e.g., SettingsModal)
    const onLang = (e)=>{
      const d = e?.detail || (e?.value) || null
      if(d && d !== lang) setLang(d)
    }
    window.addEventListener('kalivan:lang', onLang)
    return ()=> window.removeEventListener('kalivan:lang', onLang)
  }, [lang])

  function t(key, vars){
    const dict = translations[lang] || translations.ru
    let val = dict[key] || key
    if(vars){
      Object.keys(vars).forEach(k=>{ val = val.replace(new RegExp(`\\{\\{${k}\\}\\}|\\#\\{${k}\\}`,'g'), vars[k]) })
    }
    return val
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang(){
  return useContext(LangContext)
}
