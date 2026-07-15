import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

// Página de restablecimiento de contraseña
// FLUJO:
// 1. El usuario llega aquí desde el link del email: /resetar-senha/<código>
// 2. Ingresa su nueva contraseña y la confirmación
// 3. Se envía POST /api/senha/confirmar/ con código + nueva contraseña
// 4. El backend valida el código y cambia la contraseña
// 5. El código se elimina (uso único)
export default function ResetSenha() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (password !== confirmar) {
      setErro('As senhas não coincidem')
      return
    }
    if (password.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres')
      return
    }

    setCarregando(true)
    try {
      await axios.post(`${API}/senha/confirmar/`, {
        code,
        password,
        confirmarSenha: confirmar,
      })
      setSucesso(true)
      // Redirige al login después de 3 segundos
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      const data = err.response?.data
      setErro(data?.error || 'Erro ao redefinir senha. O link pode ter expirado.')
    } finally {
      setCarregando(false)
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Senha redefinida!</h2>
          <p className="text-gray-500 mt-3">Sua senha foi alterada com sucesso. Você será redirecionado para o login.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div>
          <h1 className="text-white text-4xl font-bold">Festa de <span className="text-amber-400">Ouro</span></h1>
          <p className="text-slate-300 mt-2 text-lg">A sua plataforma de eventos</p>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-white font-semibold text-xl">Crie uma nova senha</h3>
            <p className="text-slate-300 mt-1">Escolha uma senha forte e não a compartilhe com ninguém.</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm">© 2026 Festa de Ouro · Todos os direitos reservados</p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Redefinir senha</h2>
            <p className="text-gray-500 mt-2">Digite sua nova senha.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
              <div className="relative">
                <input
                  type={showConfirmar ? 'text' : 'password'}
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition pr-12"
                />
                <button type="button" onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition text-lg shadow-md"
            >
              {carregando ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            <Link to="/login" className="text-orange-500 font-semibold hover:underline">Voltar ao login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
