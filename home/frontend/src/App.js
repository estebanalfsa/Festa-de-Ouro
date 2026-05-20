import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [page, setPage] = useState('login')

  return page === 'login'
    ? <Login onGoRegister={() => setPage('register')} />
    : <Register onGoLogin={() => setPage('login')} />
}

export default App