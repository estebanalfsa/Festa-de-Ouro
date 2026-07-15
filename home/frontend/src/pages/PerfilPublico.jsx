import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import PostCard from '../components/PostCard'

const API = 'http://localhost:8000/api'
const MEDIA_BASE = 'http://localhost:8000'

function authHeader() {
  const t = localStorage.getItem('access_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// Página de perfil público de un usuario
// Accesible sin autenticación (invitados pueden ver perfiles y posts)
// Las acciones de seguir redirigen a /register si el usuario es invitado
export default function PerfilPublico() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [following, setFollowing] = useState(false)
  const [seguidoresCount, setSeguidoresCount] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')

  const loadProfile = useCallback(async () => {
    try {
      const headers = token ? authHeader() : {}
      const res = await axios.get(`${API}/perfil/${id}/`, { headers })
      const d = res.data
      const fotoUrl = d.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.nome + ' ' + d.sobrenome)}&background=334155&color=fff`
      const bannerUrl = d.banner || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80'
      setProfile({
        userId: d.userId,
        name: d.nome,
        surname: d.sobrenome,
        username: d.username ? `@${d.username}` : '',
        foto: fotoUrl,
        banner: bannerUrl,
        republic: d.republica || '',
        joinedAt: new Date(d.dataJuncao).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        seguidores: d.seguidores_count ?? 0,
        seguindo: d.seguindo_count ?? 0,
      })
      setFollowing(d.is_following ?? false)
      setSeguidoresCount(d.seguidores_count ?? 0)
    } catch {
      setErro('Não foi possível carregar o perfil')
    }
  }, [id, token])

  const loadPosts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/posts/?author=${id}`)
      setPosts(res.data.results || res.data)
    } catch {
      // ignore
    }
  }, [id])

  useEffect(() => {
    const init = async () => {
      setCarregando(true)
      await loadProfile()
      await loadPosts()
      setCarregando(false)
    }
    init()
  }, [loadProfile, loadPosts])

  // Maneja el follow: si es invitado redirige a /register
  const handleFollow = async () => {
    if (!token) { navigate('/register'); return }
    const prevFollowing = following
    const prevCount = seguidoresCount
    setFollowing(!following)
    setSeguidoresCount(c => following ? c - 1 : c + 1)
    try {
      const res = await axios.post(`${API}/seguir/${id}/`, {}, { headers: authHeader() })
      setFollowing(res.data.following)
      setSeguidoresCount(res.data.seguidores_count)
    } catch {
      setFollowing(prevFollowing)
      setSeguidoresCount(prevCount)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (erro && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500">{erro}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl">F</div>
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">Festa de <span className="text-amber-400">Ouro</span></h1>
            </div>
          </div>
          <Link to="/home" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-56 sm:h-72 bg-slate-900 relative">
            <img src={profile.banner} alt="Cover" className="absolute inset-0 h-full w-full object-cover opacity-65" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-950">Perfil</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">{profile.name}</h2>
                <p className="mt-1 text-sm sm:text-base text-slate-200">{profile.username}</p>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-8 pb-8">
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <img src={profile.foto} alt={profile.name} className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-lg" />
                  <div className="pb-1 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">{profile.name} {profile.surname}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          {profile.republic && (
                            <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">{profile.republic}</span>
                          )}
                          <span>{profile.joinedAt}</span>
                        </div>
                      </div>
                      {/* Botón de seguir visible para todos (invitados y logueados)
                          Los invitados son redirigidos a /register al hacer clic */}
                      <button
                        onClick={handleFollow}
                        className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                          following
                            ? 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
                        }`}
                      >
                        {following ? 'Seguindo' : 'Seguir'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <div className="text-2xl font-black text-slate-900">{posts.length}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Eventos</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <div className="text-2xl font-black text-slate-900">{seguidoresCount}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Seguidores</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <div className="text-2xl font-black text-slate-900">{profile.seguindo}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Seguindo</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <div className="text-2xl font-black text-slate-900">0</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Presenças</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 shadow-sm text-white">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-bold">Resumo</h4>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">Perfil</span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-300">República</p>
                      <p className="mt-1 text-sm font-semibold text-white">{profile.republic || '—'}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-300">Membro desde</p>
                      <p className="mt-1 text-sm font-semibold text-white">{profile.joinedAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Eventos de {profile.name}</h4>
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500">Nenhum evento publicado ainda.</p>
                  </div>
                ) : posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
