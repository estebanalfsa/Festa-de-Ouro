import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login({ onGoRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post('http://localhost:8001/api/auth/login/', { email, password })
      localStorage.setItem('token', res.data.access)
      alert('Login bem-sucedido!')
    } catch (err) {
      setError('Email ou senha incorretos.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">🎉 Festa de Ouro</h1>
        <p className="login-subtitle">Entra na sua conta</p>

        {error && <p className="error-msg">{error}</p>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          Entrar
        </button>

        <p className="login-footer">
          Não tem conta?{' '}
          <span className="link" onClick={onGoRegister}>
            Cadastre-se
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
