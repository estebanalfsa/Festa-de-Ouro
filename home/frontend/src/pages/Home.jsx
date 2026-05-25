import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
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

            {/* Botón de Generar Evento */}
            <button
              onClick={() => console.log('Criar Evento clicado')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-150 flex items-center gap-2 text-sm shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Criar Evento</span>
            </button>

            <div className="h-8 w-px bg-slate-800"></div>

            {/* Espacio para el perfil en el Header (Vinculado a /user) */}
            <Link to="/user" className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer select-none">
              <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-sm ring-2 ring-amber-500">
                EA
              </div>
              <span className="text-sm font-medium text-slate-200 hidden md:block">Esteban Alfaro</span>
            </Link>

          </div>
        </div>
      </header>
    </div>
  )
}
