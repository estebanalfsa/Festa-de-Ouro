import { useState } from 'react'

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)

  const handleLike = () => {
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-500 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 truncate">{post.author.name}</h3>
              <span className="text-xs text-slate-400">· {post.timestamp}</span>
              {post.author.republic && (
                <span className="text-xs text-slate-400">· {post.author.republic}</span>
              )}
            </div>
            <p className="text-xs text-slate-500">@{post.author.username}</p>
          </div>
          {post.status && (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 shrink-0">
              {post.status}
            </span>
          )}
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line">
            {post.content}
          </p>

          {post.image && (
            <img
              src={post.image}
              alt="Imagem do post"
              className="w-full rounded-2xl object-cover max-h-96"
            />
          )}

          {post.event && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                E
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{post.event.title}</p>
                <p className="text-xs text-slate-500">{post.event.date} · {post.event.location}</p>
              </div>
              <span className="text-xs font-semibold text-orange-600 shrink-0">Participar</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-semibold text-slate-900">{likesCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-semibold text-slate-900">{post.comments}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="font-semibold text-slate-900">{post.shares || 0}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 sm:px-6 py-3 flex items-center justify-around">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-semibold transition cursor-pointer py-1 px-3 rounded-xl ${
            liked
              ? 'text-rose-600 bg-rose-50'
              : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Gosto
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer py-1 px-3 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comentar
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer py-1 px-3 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Partilhar
        </button>
      </div>
    </article>
  )
}
