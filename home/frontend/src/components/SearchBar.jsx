import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8000/api'

// Barra de búsqueda de usuarios
// Funciona tanto para invitados como para usuarios logueados
// Los invitados pueden buscar y ver perfiles, pero no pueden seguir/interactuar
export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const wrapperRef = useRef(null)
  const timerRef = useRef(null)

  // Cierra el dropdown al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Maneja la entrada de texto con debounce (300ms)
  // Envía la petición con token si existe, o sin autenticación si es invitado
  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (timerRef.current) clearTimeout(timerRef.current)

    if (val.trim().length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('access_token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await axios.get(`${API}/buscar/?q=${encodeURIComponent(val)}`, { headers })
        setResults(res.data)
        setShowDropdown(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const handleSelect = (userId) => {
    setQuery('')
    setResults([])
    setShowDropdown(false)
    navigate(`/perfil/${userId}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setShowDropdown(false)
  }

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-xs">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Buscar pessoas..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
          {results.map((user) => (
            <button
              key={user.userId}
              onClick={() => handleSelect(user.userId)}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 transition text-left"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {(user.nome?.[0] || '?').toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.nome} {user.sobrenome}</p>
                <p className="text-xs text-slate-400">
                  {user.republica && <>{user.republica} · </>}
                  {user.seguidores_count} seguidores
                </p>
              </div>
              {user.is_following && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Seguindo</span>
              )}
            </button>
          ))}
        </div>
      )}

      {showDropdown && query.trim().length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
          <p className="text-sm text-slate-400 text-center py-4">Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  )
}
