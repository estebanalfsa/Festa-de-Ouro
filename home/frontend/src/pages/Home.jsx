import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import PostCard from '../components/PostCard'

export default function Home() {
  const { isGuest, logout, token, login } = useAuth()
  const navigate = useNavigate()
  const [nomeUsuario, setNomeUsuario] = useState('')

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState('login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [erroLogin, setErroLogin] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)

  const [regNome, setRegNome] = useState('')
  const [regSobrenome, setRegSobrenome] = useState('')
  const [regTelefone, setRegTelefone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [erroRegister, setErroRegister] = useState('')
  const [loadingRegister, setLoadingRegister] = useState(false)

  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [erroPosts, setErroPosts] = useState('')

  useEffect(() => {
    setLoadingPosts(true)
    axios.get('http://localhost:8000/api/posts/')
      .then(res => setPosts(res.data.results || res.data))
      .catch(() => setErroPosts('Não foi possível carregar os eventos.'))
      .finally(() => setLoadingPosts(false))
  }, [])

  useEffect(() => {
    if (!isGuest) {
      axios.get('http://localhost:8000/api/perfil/', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setNomeUsuario(`${res.data.nome} ${res.data.sobrenome}`.trim()))
        .catch(() => setNomeUsuario(''))
    }
  }, [isGuest, token])

  const iniciais = nomeUsuario
    ? nomeUsuario.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : ''

  const handleCriarEvento = () => {
    console.log('Criar Evento clicado')
  }

  const handleCriarEventoConvidado = () => {
    setAuthTab('login')
    setShowAuthModal(true)
  }

  const handleAbrirLogin = () => {
    setAuthTab('login')
    setShowAuthModal(true)
  }

  const handleModalLogin = async (e) => {
    e.preventDefault()
    setErroLogin('')
    setLoadingLogin(true)
    try {
      const res = await axios.post('http://localhost:8000/api/login/', {
        username: loginEmail,
        password: loginPassword,
      })
      login(res.data.access, res.data.refresh)
      setShowAuthModal(false)
      setLoginEmail('')
      setLoginPassword('')
    } catch {
      setErroLogin('Email ou senha inválidos')
    } finally {
      setLoadingLogin(false)
    }
  }

  const handleModalRegister = async (e) => {
    e.preventDefault()
    setErroRegister('')
    setLoadingRegister(true)
    try {
      await axios.post('http://localhost:8000/api/register/', {
        nome: regNome,
        sobrenome: regSobrenome,
        telefone: regTelefone,
        email: regEmail,
        password: regPassword,
      })
      const res = await axios.post('http://localhost:8000/api/login/', {
        username: regEmail,
        password: regPassword,
      })
      login(res.data.access, res.data.refresh)
      setShowAuthModal(false)
      setRegNome('')
      setRegSobrenome('')
      setRegTelefone('')
      setRegEmail('')
      setRegPassword('')
    } catch {
      setErroRegister('Erro ao cadastrar. Verifique os dados.')
    } finally {
      setLoadingRegister(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* HEADER*/}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo y título */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xl">
              F
            </div>
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">
                Festa de <span className="text-amber-400">Ouro</span>
              </h1>
              <p className="text-slate-400 text-xs hidden sm:block">A rede dos seus eventos favoritos</p>
            </div>
          </div>

          {/* Botones de acción y perfil en el Header*/}
          <div className="flex items-center gap-4">

            {isGuest ? (
              <>
                <button
                  onClick={handleCriarEventoConvidado}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-150 flex items-center gap-2 text-sm shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Criar Evento</span>
                </button>

                <div className="h-8 w-px bg-slate-800"></div>

                <Link
                  onClick={handleAbrirLogin}
                  className="text-sm font-medium text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Entrar
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleCriarEvento}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-150 flex items-center gap-2 text-sm shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Criar Evento</span>
                </button>

                <div className="h-8 w-px bg-slate-800"></div>

                <Link to="/user" className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer select-none">
                  <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-sm ring-2 ring-amber-500">
                    {iniciais}
                  </div>
                  <span className="text-sm font-medium text-slate-200 hidden md:block">{nomeUsuario}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-white text-sm transition"
                  title="Sair"
                >
                  Sair
                </button>
              </>
            )}

          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {loadingPosts ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : erroPosts ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">{erroPosts}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Nenhum evento ainda</p>
            <p className="text-slate-400 text-sm mt-1">
              {isGuest ? 'Entre ou cadastre-se para criar o primeiro evento.' : 'Seja o primeiro a criar um evento!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex border-b border-gray-200">
              <button
                onClick={() => { setAuthTab('login'); setErroLogin('') }}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  authTab === 'login'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Iniciar sessão
              </button>
              <button
                onClick={() => { setAuthTab('register'); setErroRegister('') }}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  authTab === 'register'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Cadastrar-se
              </button>
            </div>

            <div className="p-6">
              {authTab === 'login' ? (
                <form onSubmit={handleModalLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                    />
                  </div>

                  {erroLogin && <p className="text-red-500 text-sm text-center">{erroLogin}</p>}

                  <button
                    type="submit"
                    disabled={loadingLogin}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                  >
                    {loadingLogin ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleModalRegister} className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input
                        type="text"
                        value={regNome}
                        onChange={(e) => setRegNome(e.target.value)}
                        placeholder="João"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                      <input
                        type="text"
                        value={regSobrenome}
                        onChange={(e) => setRegSobrenome(e.target.value)}
                        placeholder="Silva"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      value={regTelefone}
                      onChange={(e) => setRegTelefone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                    />
                  </div>

                  {erroRegister && <p className="text-red-500 text-sm text-center">{erroRegister}</p>}

                  <button
                    type="submit"
                    disabled={loadingRegister}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                  >
                    {loadingRegister ? 'Cadastrando...' : 'Cadastrar-se'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}