import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { getPosts, isAuthenticated, logout } from '../services/api'

const avatars = [
  'https://avatars.githubusercontent.com/u/168954266?v=4',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
]

function mapPost(apiPost, index) {
  const info = apiPost.author?.info
  const fullName = [info?.nombre, info?.apellido1, info?.apellido2].filter(Boolean).join(' ')
  const username = apiPost.author?.email?.split('@')[0] || 'user'
  const avatar = avatars[index % avatars.length]

  return {
    id: apiPost.id,
    author: {
      name: fullName,
      username,
      avatar,
      republic: info?.republica || '',
    },
    content: apiPost.titulo && apiPost.titulo !== apiPost.com ? `${apiPost.titulo}\n\n${apiPost.com}` : apiPost.com,
    image: apiPost.photo || '',
    timestamp: apiPost.data,
    likes: 0,
    comments: 0,
    shares: 0,
    status: apiPost.assunto || '',
  }
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(isAuthenticated())
  const navigate = useNavigate()

  useEffect(() => {
    getPosts()
      .then((res) => setPosts(res.data.map(mapPost)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

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

          <div className="flex items-center gap-4">
            {loggedIn ? (
              <>
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

                <Link to="/user" className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer select-none">
                  <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-sm ring-2 ring-amber-500">
                    EA
                  </div>
                  <span className="text-sm font-medium text-slate-200 hidden md:block">Esteban Alfaro</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-lg transition duration-150 flex items-center gap-2 text-sm shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
        {loggedIn ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center text-white font-bold text-sm ring-2 ring-amber-500 shrink-0">
                EA
              </div>
              <button
                onClick={() => console.log('Nova publicação')}
                className="flex-1 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-500 transition cursor-pointer"
              >
                No que você está pensando?
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 rounded-2xl text-sm transition cursor-pointer">
                Publicar
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-sm shrink-0">
                ?
              </div>
              <p className="flex-1 text-sm text-slate-500">
                <Link to="/login" className="text-amber-600 font-semibold hover:underline">Entre</Link> ou{' '}
                <Link to="/register" className="text-amber-600 font-semibold hover:underline">cadastre-se</Link> para publicar
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-400">Carregando publicações...</div>
        ) : (
          <section className="space-y-5">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
