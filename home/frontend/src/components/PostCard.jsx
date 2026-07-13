import React from 'react'

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

export default function PostCard({ post }) {
  const nome = post.author_nome || ''
  const sobrenome = post.author_sobrenome || ''
  const nomeCompleto = `${nome} ${sobrenome}`.trim() || 'Anônimo'
  const iniciais = nomeCompleto
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const eventDate = new Date(post.date)
  const dia = eventDate.getDate()
  const mes = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  const hora = eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {iniciais}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{nomeCompleto}</p>
              <p className="text-xs text-slate-400">{timeAgo(post.created_at)}</p>
            </div>
          </div>
          {post.category_name && (
            <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full shrink-0">
              {post.category_name}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 leading-snug">{post.title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">{post.description}</p>

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
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}
    </article>
  )
}
