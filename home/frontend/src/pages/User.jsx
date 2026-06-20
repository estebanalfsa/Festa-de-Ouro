import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUsers, getAllUsersInfo, getPosts, isAuthenticated, logout, updateUserInfo } from '../services/api'

export default function User() {
  const [activeTab, setActiveTab] = useState('publicacoes')
  const [userProfile, setUserProfile] = useState(null)
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [profileForm, setProfileForm] = useState({ idade: '', apellido2: '' })
  const [profileError, setProfileError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const userId = parseInt(localStorage.getItem('user_id'), 10)

    Promise.all([getUsers(), getAllUsersInfo(), getPosts()])
      .then(([usersRes, infoRes, postsRes]) => {
        const user = usersRes.data.find((u) => u.id === userId)
        if (!user) {
          throw new Error('Usuario no encontrado')
        }
        const info = infoRes.data.find((i) => i.user === user.id)
        const userPosts = postsRes.data.filter((p) => p.user === user.id)

        const needsProfile = info && (!info.idade || !info.apellido2)
        setShowProfileForm(needsProfile)
        setProfileForm({
          idade: info?.idade || '',
          apellido2: info?.apellido2 || '',
        })

        setUserProfile({
          name: info ? `${info.nombre} ${info.apellido1 || ''}`.trim() : user.email,
          surname: info?.apellido2 || '',
          nickname: info?.nombre || '',
          username: `@${user.email.split('@')[0]}`,
          bio: info?.republica
            ? `Membro da ${info.republica}. Organizador de eventos comunitários, churrascos e encontros musicais.`
            : 'Organizador de eventos comunitários e encontros musicais.',
          avatar: 'https://avatars.githubusercontent.com/u/168954266?v=4',
          coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
          city: 'Ouro Preto',
          republic: info?.republica || 'N/A',
          joinedAt: 'Membro desde Janeiro 2026',
          eventsCreatedCount: userPosts.length,
          attendingCount: 32,
          followersCount: 128,
          likesReceived: 246,
          savedEvents: 18,
          idade: info?.idade,
          apellido1: info?.apellido1 || '',
          infoId: info?.user,
        })

        setPublications(
          userPosts.map((p) => ({
            id: p.id,
            title: p.titulo,
            date: p.data ? p.data.split(' ')[0] : '',
            time: p.data ? p.data.split(' ')[1] || '' : '',
            summary: p.com || '',
            likes: 0,
            comments: 0,
            attendees: 0,
            status: p.assunto || 'Publicado',
          }))
        )
      })
      .catch((err) => {
        console.error('Error al cargar perfil:', err)
        setUserProfile(null)
        setPublications([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileError('')
    try {
      const data = {}
      if (profileForm.idade) data.idade = parseInt(profileForm.idade, 10)
      if (profileForm.apellido2) data.apellido2 = profileForm.apellido2
      await updateUserInfo(userProfile.infoId, data)
      setShowProfileForm(false)
      setUserProfile((prev) => ({
        ...prev,
        idade: data.idade || prev.idade,
        surname: data.apellido2 || prev.surname,
      }))
    } catch {
      setProfileError('Erro ao salvar. Tente novamente.')
    }
  }

  const tabs = [
    { id: 'publicacoes', label: 'Publicações' },
    { id: 'eventos', label: 'Meus eventos' },
    { id: 'favoritos', label: 'Favoritos' }
  ]

  const favoriteEvents = [
    {
      id: 1,
      title: 'Festival de Rock Acústico',
      category: 'Shows & Festas',
      date: '29 de Maio',
      likes: 188,
      location: 'Vintage Café & Bistrô'
    },
    {
      id: 2,
      title: 'Churrasco de Integração',
      category: 'Churrascos',
      date: '30 de Maio',
      likes: 124,
      location: 'Parque da Cidade'
    },
    {
      id: 3,
      title: 'Torneio de Futebol Amador',
      category: 'Esportes',
      date: '1 de Junho',
      likes: 86,
      location: 'Complexo Desportivo Municipal'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex items-center justify-center">
        <p className="text-slate-400">Carregando perfil...</p>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex items-center justify-center">
        <p className="text-slate-400">Erro ao carregar perfil.</p>
      </div>
    )
  }

  const stats = [
    { label: 'Eventos criados', value: userProfile.eventsCreatedCount },
    { label: 'Presenças', value: userProfile.attendingCount },
    { label: 'Seguidores', value: userProfile.followersCount },
    { label: 'Gostos recebidos', value: userProfile.likesReceived }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl">
              F
            </div>
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">Festa de <span className="text-amber-400">Ouro</span></h1>
              <p className="text-slate-400 text-xs hidden sm:block">Perfil pessoal e atividade da comunidade</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao feed
            </Link>
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/70 px-3 py-2">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-8 h-8 rounded-lg object-cover ring-2 ring-amber-500" />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-100 leading-tight">{userProfile.name}</p>
                <p className="text-xs text-slate-400">Perfil ativo</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/home') }}
              className="text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-56 sm:h-72 bg-slate-900 relative">
            <img
              src={userProfile.coverImage}
              alt="Cover do perfil"
              className="absolute inset-0 h-full w-full object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-950">
                  Conta pessoal
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">{userProfile.name}</h2>
                <p className="mt-1 text-sm sm:text-base text-slate-200">{userProfile.username} · {userProfile.city}</p>
              </div>

            </div>
          </div>

          <div className="px-5 sm:px-8 pb-8">
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-lg"
                  />

                  <div className="pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-black text-slate-900">{userProfile.name} {userProfile.surname}</h3>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Disponível para eventos
                      </span>
                    </div>
                    <p className="mt-1 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">{userProfile.bio}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">Apodo: {userProfile.nickname}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">Apellidos: {userProfile.surname}</span>
                      <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">{userProfile.republic}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {userProfile.city}
                      </span>
                      <span className="hidden sm:inline text-slate-300">•</span>
                      <span>{userProfile.joinedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                      <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Ações do perfil</p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      aria-label="Editar perfil"
                      title="Editar perfil"
                      onClick={() => setShowProfileForm((v) => !v)}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm transition hover:bg-slate-800"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L7.31 19.342a4.5 4.5 0 01-1.897 1.13l-3.12.781.782-3.121a4.5 4.5 0 011.13-1.897l12.656-12.748z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 7.5l-3-3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Partilhar perfil"
                      title="Partilhar perfil"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.5 12.75l9-5.25M7.5 11.25l9 5.25" />
                        <circle cx="6" cy="12" r="2" strokeWidth="2" />
                        <circle cx="18" cy="6" r="2" strokeWidth="2" />
                        <circle cx="18" cy="18" r="2" strokeWidth="2" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Mais opções"
                      title="Mais opções"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-transparent text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-800"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.8" />
                        <circle cx="12" cy="12" r="1.8" />
                        <circle cx="12" cy="19" r="1.8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 shadow-sm text-white">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-bold">Resumo rápido</h4>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">Perfil</span>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-300">Estado</p>
                      <p className="mt-1 text-sm font-semibold text-white">Disponível para eventos</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-300">Cidade</p>
                      <p className="mt-1 text-sm font-semibold text-white">{userProfile.city}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-300">República</p>
                      <p className="mt-1 text-sm font-semibold text-white">{userProfile.republic}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-300">Membro desde</p>
                      <p className="mt-1 text-sm font-semibold text-white">{userProfile.joinedAt}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-900">Resumo do perfil</h4>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">Ativo</span>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span>Eventos salvos</span>
                      <strong className="text-slate-900">{userProfile.savedEvents}</strong>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span>Gostos recebidos</span>
                      <strong className="text-slate-900">{userProfile.likesReceived}</strong>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span>Taxa de engajamento</span>
                      <strong className="text-emerald-600">84%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <aside className="lg:col-span-4 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 shadow-sm text-white">
                  <h4 className="text-lg font-bold">Próximo passo sugerido</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Complete o seu perfil com interesses e confirme os eventos que quer acompanhar para melhorar recomendações futuras.
                  </p>
                  <button className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition">
                    Completar agora
                  </button>
                </div>
              </aside>

              <section className="lg:col-span-8 space-y-6">
                {showProfileForm && (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-lg font-bold text-amber-900">Complete seu perfil</h4>
                      <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">Pendente</span>
                    </div>
                    <p className="mt-2 text-sm text-amber-700">
                      Adicione mais informações para que outros membros possam conhecer você.
                    </p>
                    <form onSubmit={handleProfileUpdate} className="mt-4 flex flex-wrap items-end gap-3">
                      <div>
                        <label className="block text-xs font-medium text-amber-800 mb-1">Idade</label>
                        <input
                          type="number"
                          value={profileForm.idade}
                          onChange={(e) => setProfileForm((p) => ({ ...p, idade: e.target.value }))}
                          placeholder="Ex: 24"
                          className="w-24 rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-amber-800 mb-1">Segundo sobrenome</label>
                        <input
                          type="text"
                          value={profileForm.apellido2}
                          onChange={(e) => setProfileForm((p) => ({ ...p, apellido2: e.target.value }))}
                          placeholder="Ex: Silva"
                          className="w-40 rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition"
                      >
                        Salvar
                      </button>
                      {profileError && (
                        <p className="w-full text-xs text-red-600">{profileError}</p>
                      )}
                    </form>
                  </div>
                )}

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'publicacoes' && (
                  <div className="space-y-4">
                    {publications.map((publication) => (
                      <article key={publication.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">{publication.status}</span>
                              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{publication.date} · {publication.time}</span>
                            </div>
                            <h5 className="text-xl font-extrabold text-slate-900">{publication.title}</h5>
                            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{publication.summary}</p>
                          </div>

                          <div className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-center sm:min-w-[180px] sm:flex-col">
                            <div>
                              <div className="text-lg font-black text-slate-900">{publication.likes}</div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gostos</div>
                            </div>
                            <div>
                              <div className="text-lg font-black text-slate-900">{publication.comments}</div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Comentários</div>
                            </div>
                            <div>
                              <div className="text-lg font-black text-slate-900">{publication.attendees}</div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confirmados</div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {activeTab === 'eventos' && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Meus eventos recentes</h4>
                        <p className="mt-1 text-sm text-slate-500">Eventos criados e atualizados por você.</p>
                      </div>
                      <Link to="/home" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                        Ver feed completo
                      </Link>
                    </div>

                    <div className="mt-5 grid gap-4">
                      {publications.map((publication) => (
                        <div key={publication.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h5 className="font-bold text-slate-900">{publication.title}</h5>
                              <p className="mt-1 text-sm text-slate-500">{publication.summary}</p>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{publication.attendees} confirmados</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'favoritos' && (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {favoriteEvents.map((event) => (
                      <article key={event.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{event.category}</span>
                          <span className="text-xs font-semibold text-slate-400">{event.date}</span>
                        </div>
                        <h5 className="mt-4 text-lg font-extrabold text-slate-900">{event.title}</h5>
                        <p className="mt-2 text-sm text-slate-600">{event.location}</p>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                          <div className="text-sm text-slate-500">
                            <span className="font-bold text-slate-900">{event.likes}</span> me interessa
                          </div>
                          <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                            Abrir
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
