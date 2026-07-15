import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8000/api'

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'agora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  const weeks = Math.floor(days / 7)
  return `${weeks}sem`
}

function authHeader() {
  const t = localStorage.getItem('access_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// Componente que renderiza una tarjeta de post/evento
// Muestra: foto del autor (o iniciales si no tiene), título, descripción, fecha, ubicación,
// imagen del evento, botones de like y comentarios
export default function PostCard({ post, editable, onEdit, onDelete, onUpdate }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(post.is_liked ?? false)
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0)
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [sendingComment, setSendingComment] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState(null)
  const inputRef = useRef(null)
  const token = localStorage.getItem('access_token')

  const nome = post.author_nome || ''
  const sobrenome = post.author_sobrenome || ''
  const nomeCompleto = `${nome} ${sobrenome}`.trim() || 'Anônimo'
  const iniciais = nomeCompleto.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()

  const eventDate = new Date(post.date)
  const dia = eventDate.getDate()
  const mes = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  const hora = eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  // Maneja el like: si es invitado redirige a /register
  // Si está logueado, envía POST al backend y optimiza el cambio en UI
  const handleLike = async () => {
    if (!token) {
      navigate('/register')
      return
    }
    const prevLiked = liked
    const prevCount = likesCount
    setLiked(!liked)
    setLikesCount(c => liked ? c - 1 : c + 1)
    try {
      const res = await axios.post(`${API}/posts/${post.id}/like/`, {}, { headers: authHeader() })
      setLiked(res.data.liked)
      setLikesCount(res.data.likes_count)
    } catch {
      setLiked(prevLiked)
      setLikesCount(prevCount)
    }
  }

  const fetchComments = async () => {
    setLoadingComments(true)
    try {
      const res = await axios.get(`${API}/posts/${post.id}/comments/`)
      setComments(res.data.results || res.data)
    } catch {
      // ignore
    } finally {
      setLoadingComments(false)
    }
  }

  const toggleComments = () => {
    if (!showComments && comments.length === 0) fetchComments()
    setShowComments(!showComments)
  }

  // Maneja el envío de comentarios: si es invitado redirige a /register
  const handleSendComment = async (e) => {
    e.preventDefault()
    if (!token) { navigate('/register'); return }
    if (!commentText.trim()) return
    setSendingComment(true)
    try {
      const res = await axios.post(`${API}/posts/${post.id}/comments/`,
        { content: commentText },
        { headers: authHeader() }
      )
      setComments(prev => [...prev, res.data])
      setCommentText('')
      if (onUpdate) onUpdate()
    } catch {
      // ignore
    } finally {
      setSendingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    setDeletingCommentId(commentId)
    try {
      await axios.delete(`${API}/comments/${commentId}/`, { headers: authHeader() })
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch {
      // ignore
    } finally {
      setDeletingCommentId(null)
    }
  }

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Foto del autor: si tiene foto la muestra, si no, iniciales */}
            {post.author_foto ? (
              <img src={post.author_foto} alt={nomeCompleto} className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                {iniciais}
              </div>
            )}
            <div className="min-w-0">
              <button onClick={() => navigate(`/perfil/${post.author}`)} className="text-sm font-semibold text-slate-800 truncate hover:text-blue-600 transition text-left">{nomeCompleto}</button>
              <p className="text-xs text-slate-400">{timeAgo(post.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {post.category_name && (
              <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                {post.category_name}
              </span>
            )}
            {editable && (
              <div className="flex items-center gap-1">
                <button onClick={() => onEdit?.(post)} title="Editar" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => onDelete?.(post)} title="Excluir" className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="mt-4 text-xl font-extrabold text-slate-900 leading-snug">{post.title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{post.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{dia} {mes} · {hora}</span>
          </div>
          {post.location && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{post.location}</span>
            </div>
          )}
        </div>
      </div>

      {post.image && (
        <div className="border-t border-slate-100">
          <img
            src={post.image.startsWith('http') ? post.image : `${API.replace('/api', '')}${post.image}`}
            alt={post.title}
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>
      )}

      <div className="border-t border-slate-100 px-5 sm:px-6 py-3 flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition cursor-pointer ${
            liked ? 'text-red-500' : 'text-slate-500 hover:text-red-400'
          }`}
        >
          {liked ? (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          )}
          <span>{likesCount}</span>
        </button>

        <button
          onClick={toggleComments}
          className={`flex items-center gap-1.5 text-sm font-medium transition cursor-pointer ${
            showComments ? 'text-blue-500' : 'text-slate-500 hover:text-blue-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span>{post.comments_count ?? comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t border-slate-100 px-5 sm:px-6 py-4 bg-slate-50/50">
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-2">Nenhum comentário ainda. Seja o primeiro!</p>
              ) : comments.map(comment => {
                const isMine = comment.author_id === parseInt(localStorage.getItem('user_id'))
                return (
                  <div key={comment.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {(comment.author_nome?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-700">
                            {comment.author_nome} {comment.author_sobrenome}
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">{timeAgo(comment.created_at)}</span>
                            {isMine && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deletingCommentId === comment.id}
                                className="text-slate-300 hover:text-red-500 transition p-0.5"
                                title="Excluir"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-0.5">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <form onSubmit={handleSendComment} className="mt-3 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
              disabled={sendingComment}
            />
            <button
              type="submit"
              disabled={sendingComment || !commentText.trim()}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-1"
            >
              {sendingComment ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              )}
            </button>
          </form>
        </div>
      )}
    </article>
  )
}
