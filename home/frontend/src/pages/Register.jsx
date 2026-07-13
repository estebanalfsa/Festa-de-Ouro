import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'

import img2 from '../assets/img_reg2.jpeg'
import img3 from '../assets/img_reg3.jpg'
import img4 from '../assets/img_reg4.jpeg'
import img5 from '../assets/img_reg5.jpg'
import img6 from '../assets/img_reg6.jpg'
import img7 from '../assets/img_reg1.jpeg'

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    republica: '',
    senha: '',
    confirmarSenha: '',
  })
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTelefone = (e) => {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length <= 11) {
      v = v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
    }
    setFormData(prev => ({ ...prev, telefone: v }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setErro('')

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem')
      return
    }
    if (formData.senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres')
      return
    }

    setCarregando(true)
    try {
      await axios.post('http://localhost:8000/api/register/', {
        first_name: formData.nome,
        sobrenome: formData.sobrenome,
        email: formData.email,
        telefone: formData.telefone,
        republica: formData.republica,
        password: formData.senha,
        confirmarSenha: formData.confirmarSenha,
      })
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (data) {
        const primeiraChave = Object.keys(data)[0]
        setErro(Array.isArray(data[primeiraChave]) ? data[primeiraChave][0] : String(data[primeiraChave]))
      } else {
        setErro('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* COLUNA ESQUERDA */}
      <div className="hidden md:flex w-1/2 bg-slate-900 flex-col justify-between py-10 px-8">

        <div className="text-center">
          <h1 className="text-white font-bold tracking-tight w-full" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Festa de <span className="text-amber-400">Ouro</span>
          </h1>
          <p className="text-slate-300 mt-2 text-lg">A sua plataforma de eventos</p>
        </div>

        {/* Collage tipo poster: fotos con bordes blancos individuales */}
        <div className="flex-1 mt-6 flex items-center justify-center">
          <div className="w-full max-w-[1700px] rounded-md overflow-hidden shadow-2xl">
            <div className="grid grid-cols-3 grid-rows-2 gap-px bg-white">
              <img src={img2} alt="" className="w-full aspect-[6/4] object-cover border-2 border-white" />
              <img src={img3} alt="" className="w-full aspect-[6/4] object-cover border-2 border-white" />
              <img src={img4} alt="" className="w-full aspect-[6/4] object-cover border-2 border-white" />
              <img src={img5} alt="" className="w-full aspect-[6/4] object-cover border-2 border-white" />
              <img src={img6} alt="" className="w-full aspect-[6/4] object-cover border-2 border-white" />
              <img src={img7} alt="" className="w-full aspect-[6/4] object-cover border-2 border-white" />
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-sm text-center">© 2026 Festa de Ouro · Todos os direitos reservados</p>

      </div>

      {/* COLUNA DIREITA */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Crie sua conta</h2>
            <p className="text-gray-500 mt-2">Junte-se à comunidade de eventos de Ouro Preto</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange}
                  placeholder="João" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                <input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange}
                  placeholder="Silva" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="seu@email.com" required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleTelefone}
                  placeholder="(31) 9 9999-9999" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">República</label>
                <input type="text" name="republica" value={formData.republica} onChange={handleChange}
                  placeholder="Ex: NosTravamus" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <input type={showSenha ? 'text' : 'password'} name="senha" value={formData.senha} onChange={handleChange}
                  placeholder="Mínimo 8 caracteres" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition pr-12" />
                <button type="button" onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
              <div className="relative">
                <input type={showConfirmar ? 'text' : 'password'} name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange}
                  placeholder="Repita sua senha" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition pr-12" />
                <button type="button" onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-red-500 text-sm text-center">{erro}</p>
            )}

            <button type="submit" disabled={carregando}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200 text-lg shadow-md disabled:opacity-60">
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>

          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <p className="text-center text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-orange-500 font-semibold hover:underline">Entrar aqui</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Register