import './App.css'
import { AppRouter } from '@/app/AppRouter'
import { useEffect, useState } from 'react'

function getSystemTheme(): 'dark' | 'light' {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || saved === 'light' ? saved : getSystemTheme();
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      <button
        style={{
          position: 'fixed', right: 24, bottom: 18, zIndex: 1000,
          background: 'var(--card-bg)', color: 'var(--main-text)', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002', fontSize: '1rem', transition: 'background 0.2s, color 0.2s',
        }}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Переключить тему"
      >
        {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      </button>
      <AppRouter />
    </>
  )
}

export default App
