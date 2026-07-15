import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import PostCard from '../components/PostCard'

const API = 'http://localhost:8000/api'
const MEDIA_BASE = 'http://localhost:8000'

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
}

const emptyForm = { title: '', description: '', date: '', location: '' }

export default function User() {
  const [activeTab, setActiveTab] = useState('publicacoes')
  const [userProfile, setUserProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [formImage, setFormImage] = useState(null)
  const [formImagePreview, setFormImagePreview] = useState('')
  const [formErro, setFormErro] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileFoto, setProfileFoto] = useState(null)
  const [profileFotoPreview, setProfileFotoPreview] = useState('')
  const [profileBanner, setProfileBanner] = useState(null)
  const [profileBannerPreview, setProfileBannerPreview] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileErro, setProfileErro] = useState('')

  const loadProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/perfil/`, { headers: authHeader() })
      const d = res.data
      const fotoUrl = d.foto ? (d.foto.startsWith('http') ? d.foto : `${MEDIA_BASE}${d.foto}`) : null
      const bannerUrl = d.banner ? (d.banner.startsWith('http') ? d.banner : `${MEDIA_BASE}${d.banner}`) : null
      setUserProfile({
        userId: d.userId,
        name: d.nome,
        surname: d.sobrenome,
        username: `@${d.username}`,
        foto: fotoUrl,
        banner: bannerUrl,
        avatar: fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.nome + ' ' + d.sobrenome)}&background=334155&color=fff`,
        coverImage: bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
        republic: d.republica,
        joinedAt: new Date(d.dataJuncao).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        seguidores: d.seguidores_count ?? 0,
        seguindo: d.seguindo_count ?? 0,
      })
      localStorage.setItem('user_id', d.userId)
      return d.userId
    } catch {
      setErro('Não foi possível carregar o perfil')
      return null
    }
  }, [])

  const loadPosts = useCallback(async (userId) => {
    try {
      const res = await axios.get(`${API}/posts/?author=${userId}`, { headers: authHeader() })
      setUserPosts(res.data.results || res.data)
    } catch {
      setErro('Não foi possível carregar os eventos.')
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setCarregando(true)
      const userId = await loadProfile()
      if (userId) await loadPosts(userId)
      setCarregando(false)
    }
    init()
  }, [loadProfile, loadPosts])

  const openCreate = () => {
    setEditingPost(null)
    setForm({ ...emptyForm })
    setFormImage(null)
    setFormImagePreview('')
    setFormErro('')
    setShowModal(true)
  }

  const openEdit = (post) => {
    setEditingPost(post)
    setForm({
      title: post.title,
      description: post.description,
      date: post.date ? post.date.slice(0, 16) : '',
      location: post.location || '',
    })
    setFormImage(null)
    setFormImagePreview('')
    setFormErro('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPost(null)
    setForm({ ...emptyForm })
    setFormImage(null)
    setFormImagePreview('')
    setFormErro('')
  }

  const handleFormImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setFormImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErro('')
    setFormLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('date', form.date)
      if (form.location) fd.append('location', form.location)
      if (formImage) fd.append('image', formImage)

      if (editingPost) {
        await axios.put(`${API}/posts/${editingPost.id}/`, fd, { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } })
      } else {
        await axios.post(`${API}/posts/`, fd, { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } })
      }
      closeModal()
      if (userProfile) await loadPosts(userProfile.userId)
    } catch {
      setFormErro('Erro ao salvar evento. Verifique os dados.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await axios.delete(`${API}/posts/${deleteTarget.id}/`, { headers: authHeader() })
      setDeleteTarget(null)
      if (userProfile) await loadPosts(userProfile.userId)
    } catch {
      setErro('Erro ao excluir evento.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileFoto(file)
      const reader = new FileReader()
      reader.onloadend = () => setProfileFotoPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileBanner(file)
      const reader = new FileReader()
      reader.onloadend = () => setProfileBannerPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileErro('')
    setProfileLoading(true)
    try {
      const fd = new FormData()
      if (profileFoto) fd.append('foto', profileFoto)
      if (profileBanner) fd.append('banner', profileBanner)
      await axios.patch(`${API}/perfil/`, fd, { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } })
      setShowProfileModal(false)
      setProfileFoto(null)
      setProfileFotoPreview('')
      setProfileBanner(null)
      setProfileBannerPreview('')
      await loadProfile()
    } catch {
      setProfileErro('Erro ao atualizar perfil.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePostUpdate = () => {
    if (userProfile) loadPosts(userProfile.userId)
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (erro && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500">{erro}</p>
      </div>
    )
  }

  const stats = [
    { label: 'Eventos criados', value: userPosts.length },
    { label: 'Seguidores', value: userProfile?.seguidores ?? 0 },
    { label: 'Seguindo', value: userProfile?.seguindo ?? 0 },
    { label: 'Gostos recebidos', value: 0 }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl">F</div>
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">Festa de <span className="text-amber-400">Ouro</span></h1>
              <p className="text-slate-400 text-xs hidden sm:block">Perfil pessoal e atividade da comunidade</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/home" className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
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
          <div className="h-56 sm:h-72 bg-slate-900 relative group">
            <img src={userProfile.coverImage} alt="Cover" className="absolute inset-0 h-full w-full object-cover opacity-65" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
            <button
              onClick={() => setShowProfileModal(true)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              title="Alterar banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-950">Conta pessoal</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">{userProfile.name}</h2>
                <p className="mt-1 text-sm sm:text-base text-slate-200">{userProfile.username}</p>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-8 pb-8">
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="relative group">
                    <img src={userProfile.avatar} alt={userProfile.name} className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-lg" />
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center text-white"
                      title="Alterar foto"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
                  <div className="pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-black text-slate-900">{userProfile.name} {userProfile.surname}</h3>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Disponível para eventos</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">{userProfile.republic}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
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
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 shadow-sm text-white">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-bold">Resumo rápido</h4>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">Perfil</span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-300">República</p>
                      <p className="mt-1 text-sm font-semibold text-white">{userProfile.republic || '—'}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-300">Membro desde</p>
                      <p className="mt-1 text-sm font-semibold text-white">{userProfile.joinedAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {['publicacoes', 'eventos'].map((tabId) => (
                      <button
                        key={tabId}
                        onClick={() => setActiveTab(tabId)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tabId ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                      >
                        {tabId === 'publicacoes' ? 'Publicações' : 'Meus eventos'}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={openCreate}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition text-sm shadow-md flex items-center gap-2 shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    Criar Evento
                  </button>
                </div>

                {activeTab === 'publicacoes' && (
                  <div className="space-y-4">
                    {userPosts.length === 0 ? (
                      <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500">Nenhuma publicação ainda.</p>
                        <button onClick={openCreate} className="mt-3 text-sm font-semibold text-orange-500 hover:text-orange-600">Criar primeiro evento</button>
                      </div>
                    ) : userPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        editable
                        onEdit={openEdit}
                        onDelete={(p) => setDeleteTarget(p)}
                        onUpdate={handlePostUpdate}
                      />
                    ))}
                  </div>
                )}

                {activeTab === 'eventos' && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-900">Meus eventos</h4>
                    <p className="mt-1 text-sm text-slate-500">Eventos que você criou.</p>
                    <div className="mt-5 grid gap-3">
                      {userPosts.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">Nenhum evento criado ainda.</p>
                      ) : userPosts.map((post) => (
                        <div key={post.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-slate-900">{post.title}</h5>
                            <p className="mt-1 text-sm text-slate-500 line-clamp-2">{post.description}</p>
                            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                              {post.location && <span>{post.location}</span>}
                              <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => openEdit(post)} title="Editar" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => setDeleteTarget(post)} title="Excluir" className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-800">{editingPost ? 'Editar Evento' : 'Criar Evento'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input type="text" value={form.title} onChange={handleField('title')} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea value={form.description} onChange={handleField('description')} required rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm resize-none" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e hora</label>
                  <input type="datetime-local" value={form.date} onChange={handleField('date')} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                  <input type="text" value={form.location} onChange={handleField('location')} placeholder="Opcional" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem (opcional)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Escolher imagem
                    <input type="file" accept="image/*" onChange={handleFormImageChange} className="hidden" />
                  </label>
                  {formImage && (
                    <button type="button" onClick={() => { setFormImage(null); setFormImagePreview('') }} className="text-sm text-red-500 hover:text-red-600">Remover</button>
                  )}
                </div>
                {formImagePreview && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                    <img src={formImagePreview} alt="Preview" className="w-full h-40 object-cover" />
                  </div>
                )}
              </div>
              {formErro && <p className="text-red-500 text-sm text-center">{formErro}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm">Cancelar</button>
                <button type="submit" disabled={formLoading} className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition text-sm">
                  {formLoading ? 'Salvando...' : editingPost ? 'Salvar Alterações' : 'Criar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleteLoading && setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-800">Excluir evento</h3>
            <p className="mt-2 text-sm text-slate-600">Tem certeza que deseja excluir <strong>{deleteTarget.title}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} disabled={deleteLoading} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm">Cancelar</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition text-sm">
                {deleteLoading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { if (!profileLoading) { setShowProfileModal(false); setProfileFoto(null); setProfileFotoPreview(''); setProfileBanner(null); setProfileBannerPreview('') } }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-800">Editar Perfil</h2>
              <button onClick={() => { setShowProfileModal(false); setProfileFoto(null); setProfileFotoPreview(''); setProfileBanner(null); setProfileBannerPreview('') }} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto de perfil</label>
                <div className="flex items-center gap-4">
                  <img
                    src={profileFotoPreview || userProfile.avatar}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-200"
                  />
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Trocar foto
                    <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto de banner</label>
                <div className="space-y-2">
                  <div className="h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={profileBannerPreview || userProfile.coverImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Trocar banner
                    <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                  </label>
                </div>
              </div>
              {profileErro && <p className="text-red-500 text-sm text-center">{profileErro}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowProfileModal(false); setProfileFoto(null); setProfileFotoPreview(''); setProfileBanner(null); setProfileBannerPreview('') }} disabled={profileLoading} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={profileLoading || (!profileFoto && !profileBanner)} className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition text-sm">
                  {profileLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
