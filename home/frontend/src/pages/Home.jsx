import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Home() {
  const { isGuest, logout, token } = useAuth()
  const navigate = useNavigate()
  const [nomeUsuario, setNomeUsuario] = useState('')

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
    navigate('/register')
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
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition"
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
    </div>
  )
}