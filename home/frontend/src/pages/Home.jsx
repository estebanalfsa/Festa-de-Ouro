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

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createTitle, setCreateTitle] = useState('')
  const [createDesc, setCreateDesc] = useState('')
  const [createDate, setCreateDate] = useState('')
  const [createLocation, setCreateLocation] = useState('')
  const [erroCreate, setErroCreate] = useState('')
  const [loadingCreate, setLoadingCreate] = useState(false)

  const fetchPosts = () => {
    setLoadingPosts(true)
    axios.get('http://localhost:8000/api/posts/')
      .then(res => setPosts(res.data.results || res.data))
      .catch(() => setErroPosts('Não foi possível carregar os eventos.'))
      .finally(() => setLoadingPosts(false))
  }

  useEffect(() => { fetchPosts() }, [])

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
    setShowCreateModal(true)
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

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    setErroCreate('')
    setLoadingCreate(true)
    try {
      await axios.post('http://localhost:8000/api/posts/', {
        title: createTitle,
        description: createDesc,
        date: createDate,
        location: createLocation,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowCreateModal(false)
      setCreateTitle('')
      setCreateDesc('')
      setCreateDate('')
      setCreateLocation('')
      fetchPosts()
    } catch {
      setErroCreate('Erro ao criar evento. Verifique os dados.')
    } finally {
      setLoadingCreate(false)
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
                <Link
                  to="/login"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-150 flex items-center gap-2 text-sm shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Entrar</span>
                </Link>

                <Link
                  to="/register"
                  className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-semibold px-4 py-2 rounded-lg transition duration-150 flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Cadastrar</span>
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

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-800">Criar Evento</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="Nome do evento"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  placeholder="Descreva o evento..."
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm resize-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e hora</label>
                  <input
                    type="datetime-local"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                  <input
                    type="text"
                    value={createLocation}
                    onChange={(e) => setCreateLocation(e.target.value)}
                    placeholder="Endereço ou local"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                  />
                </div>
              </div>

              {erroCreate && <p className="text-red-500 text-sm text-center">{erroCreate}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingCreate}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                >
                  {loadingCreate ? 'Criando...' : 'Criar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}