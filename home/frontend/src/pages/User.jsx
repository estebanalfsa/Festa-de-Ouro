import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function User() {
  const [activeTab, setActiveTab] = useState('publicacoes')

  const userProfile = {
    name: 'Esteban Alfaro',
    username: '@esteban_alfaro',
    bio: 'Organizador de eventos comunitários, churrascos e encontros musicais. Aqui ficam os meus eventos, favoritos e o que estou a acompanhar em Festa de Ouro.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
    city: 'Lisboa, Portugal',
    joinedAt: 'Membro desde Janeiro 2025',
    eventsCreatedCount: 14,
    attendingCount: 32,
    followersCount: 128,
    likesReceived: 246,
    savedEvents: 18
  }

  const stats = [
    { label: 'Eventos criados', value: userProfile.eventsCreatedCount },
    { label: 'Presenças', value: userProfile.attendingCount },
    { label: 'Seguidores', value: userProfile.followersCount },
    { label: 'Gostos recebidos', value: userProfile.likesReceived }
  ]

  const tabs = [
    { id: 'publicacoes', label: 'Publicações' },
    { id: 'eventos', label: 'Meus eventos' },
    { id: 'favoritos', label: 'Favoritos' }
  ]

  const publications = [
    {
      id: 1,
      title: 'Churrasco de Integração no Parque',
      date: 'Hoje',
      time: '12:00',
      summary: 'Preparando o próximo encontro da comunidade com comida, música e muita conversa.',
      likes: 42,
      comments: 9,
      attendees: 27,
      status: 'Publicado'
    },
    {
      id: 2,
      title: 'Noite acústica no centro histórico',
      date: 'Ontem',
      time: '19:30',
      summary: 'Evento com bandas locais e lotação quase completa. Ótima resposta da comunidade.',
      likes: 31,
      comments: 6,
      attendees: 18,
      status: 'Em destaque'
    }
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

              <div className="flex flex-wrap gap-3">
                <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 transition">
                  Editar perfil
                </button>
                <button className="rounded-xl border border-white/20 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-slate-950/60 transition">
                  Partilhar perfil
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-8 pb-8">
            <div className="-mt-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-lg"
                />

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900">{userProfile.name}</h3>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Disponível para eventos
                    </span>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">{userProfile.bio}</p>
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

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[540px]">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <aside className="lg:col-span-4 space-y-6">
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
