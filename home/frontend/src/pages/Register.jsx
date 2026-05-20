import { useState } from 'react'
import axios from 'axios'
import './Register.css'

function Register({ onGoLogin }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await axios.post('http://localhost:8001/api/auth/register/', form)
      setSuccess('Conta criada! Faça login.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao cadastrar.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">🎉 Festa de Ouro</h1>
        <p className="login-subtitle">Crie sua conta</p>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <div className="form-group">
          <label>Nome de usuário</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="seunome"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
          />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          Cadastrar
        </button>

        <p className="login-footer">
          Já tem conta?{' '}
          <span className="link" onClick={onGoLogin}>
            Entrar
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register
