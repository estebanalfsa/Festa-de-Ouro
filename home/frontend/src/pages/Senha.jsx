import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8000/api'

// Página de solicitud de recuperación de contraseña
// FLUJO:
// 1. El usuario ingresa su email
// 2. Se envía POST /api/senha/ con el email
// 3. El backend genera un código y envía un email con un link
// 4. El usuario hace clic en el link y es redirigido a /resetar-senha/<código>
export default function Senha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')
    try {
      await axios.post(`${API}/senha/`, { email })
      setEnviado(true)
    } catch (err) {
      const data = err.response?.data
      setErro(data?.error || data?.message || 'Erro ao enviar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div>
          <h1 className="text-white text-4xl font-bold">Festa de <span className="text-amber-400">Ouro</span></h1>
          <p className="text-slate-300 mt-2 text-lg">A sua plataforma de eventos</p>
        </div>
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-white font-semibold text-xl">Segurança em primeiro lugar</h3>
              <p className="text-slate-300 mt-1">Sua conta está protegida. Recupere o acesso de forma rápida e segura.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-white font-semibold text-xl">Verifique seu e-mail</h3>
              <p className="text-slate-300 mt-1">Enviaremos um link de recuperação diretamente para o seu e-mail cadastrado.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-white font-semibold text-xl">Volte aos eventos</h3>
              <p className="text-slate-300 mt-1">Recupere sua senha e não perca nenhum evento da comunidade de Ouro Preto.</p>
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-sm">© 2026 Festa de Ouro · Todos os direitos reservados</p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          {!enviado ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Esqueceu a senha?</h2>
                <p className="text-gray-500 mt-2">
                  Informe seu e-mail cadastrado e enviaremos um link para criar uma nova senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>

                {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition text-lg shadow-md"
                >
                  {carregando ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>
            </>
          ) : (
            // Mensaje de éxito después de enviar el email
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✉️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">E-mail enviado!</h2>
              <p className="text-gray-500 mt-3">
                Se o endereço <span className="font-semibold text-gray-700">{email}</span> estiver cadastrado,
                você receberá um link para redefinir sua senha.
              </p>
              <p className="text-gray-400 text-sm mt-4">
                Não recebeu? Verifique sua caixa de spam ou tente novamente.
              </p>
              <button
                onClick={() => setEnviado(false)}
                className="mt-6 text-orange-500 font-semibold hover:underline"
              >
                Tentar com outro e-mail
              </button>
            </div>
          )}

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <p className="text-center text-gray-600">
            Lembrou a senha?{' '}
            <Link to="/" className="text-orange-500 font-semibold hover:underline">Entrar aqui</Link>
          </p>
          <p className="text-center text-gray-600 mt-3">
            Não tem conta?{' '}
            <Link to="/register" className="text-orange-500 font-semibold hover:underline">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
