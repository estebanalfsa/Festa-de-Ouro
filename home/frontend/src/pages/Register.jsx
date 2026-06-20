import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

import img1 from '../assets/img_reg1.jpeg'
import img2 from '../assets/img_reg2.jpeg'
import img3 from '../assets/img_reg3.jpg'
import img4 from '../assets/img_reg4.jpeg'
import img5 from '../assets/img_reg5.jpg'
import img6 from '../assets/img_reg6.jpg'
import img7 from '../assets/img_reg7.jpg'

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    republica: '',
    senha: '',
    confirmarSenha: '',
  })
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTelefone = (e) => {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length <= 11) {
      v = v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
    }
    setFormData(prev => ({ ...prev, telefone: v }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }
    try {
      const res = await api.post('/users/', {
        email: formData.email,
        password: formData.senha,
      })
      const userId = res.data.id
      await api.post('/users-info/', {
        nombre: formData.nome,
        apellido1: formData.sobrenome,
        republica: formData.republica,
        user: userId,
      })
      const loginRes = await api.post('/token/', {
        email: formData.email,
        password: formData.senha,
      })
      localStorage.setItem('access_token', loginRes.data.access)
      localStorage.setItem('refresh_token', loginRes.data.refresh)
      localStorage.setItem('user_id', loginRes.data.user_id)
      localStorage.setItem('user_email', loginRes.data.email)
      setSuccess(true)
      setTimeout(() => navigate('/user'), 2000)
    } catch {
      setError('Erro ao registrar. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* COLUNA ESQUERDA */}
      <div className="hidden md:flex w-1/2 bg-slate-900 flex-col justify-between py-10 px-8">

        {/* Título centrado arriba */}
        <div className="text-center">
          <h1 className="text-white font-bold tracking-tight w-full" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Festa de <span className="text-amber-400">Ouro</span>
          </h1>
          <p className="text-slate-300 mt-2 text-lg">A sua plataforma de eventos</p>
        </div>

        {/* Imágenes en 3 columnas escalonadas y más compactas */}
        <div className="flex-1 relative mt-4">

          {/* COLUMNA IZQUIERDA */}
          <img src={img1} alt="" className="absolute w-40 h-26 object-cover rounded-xl shadow-lg"
            style={{ top: '4%', left: '1%', transform: 'rotate(-3deg)', height: '10rem' }} />
          <img src={img2} alt="" className="absolute w-40 object-cover rounded-xl shadow-lg"
            style={{ top: '50%', left: '1%', transform: 'rotate(-2deg)', height: '10rem' }} />

          {/* COLUMNA CENTRAL */}
          <img src={img3} alt="" className="absolute w-40 object-cover rounded-xl shadow-lg"
            style={{ top: '18%', left: '32%', transform: 'rotate(2deg)', height: '10rem' }} />
          <img src={img4} alt="" className="absolute w-40 object-cover rounded-xl shadow-lg"
            style={{ top: '70%', left: '32%', transform: 'rotate(2.5deg)', height: '10rem' }} />

          {/* COLUMNA DERECHA */}
          <img src={img5} alt="" className="absolute w-40 object-cover rounded-xl shadow-lg"
            style={{ top: '4%', left: '76%', transform: 'rotate(-2.5deg)', height: '10rem' }} />
          <img src={img6} alt="" className="absolute w-40 object-cover rounded-xl shadow-lg"
            style={{ top: '34%', left: '60%', transform: 'rotate(1.5deg)', height: '10rem' }} />
          <img src={img7} alt="" className="absolute w-40 object-cover rounded-xl shadow-lg"
            style={{ top: '64%', left: '76%', transform: 'rotate(-2deg)', height: '10rem' }} />

        </div>

        {/* Copyright abajo */}
        <p className="text-slate-400 text-sm text-center">© 2026 Festa de Ouro · Todos os direitos reservados</p>

      </div>

      {/* COLUNA DIREITA */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Crie sua conta</h2>
            <p className="text-gray-500 mt-2">Junte-se à comunidade de eventos de Ouro Preto</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange}
                  placeholder="João" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                <input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange}
                  placeholder="Silva" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="seu@email.com" required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleTelefone}
                  placeholder="(31) 9 9999-9999" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">República</label>
                <input type="text" name="republica" value={formData.republica} onChange={handleChange}
                  placeholder="Ex: NosTravamus" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <input type={showSenha ? 'text' : 'password'} name="senha" value={formData.senha} onChange={handleChange}
                  placeholder="Mínimo 8 caracteres" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition pr-12" />
                <button type="button" onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showSenha ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
              <div className="relative">
                <input type={showConfirmar ? 'text' : 'password'} name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange}
                  placeholder="Repita sua senha" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition pr-12" />
                <button type="button" onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showSenha ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}

                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
                Conta criada com sucesso! Redirecionando...
              </div>
            )}

            <button type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200 text-lg shadow-md">
              Criar conta
            </button>

          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <p className="text-center text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-orange-500 font-semibold hover:underline">Entrar aqui</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Register