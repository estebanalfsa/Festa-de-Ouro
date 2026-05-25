import { useState } from 'react'
import { Link } from 'react-router-dom'

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

  const handleRegister = (e) => {
    e.preventDefault()
    console.log('Registro:', formData)
  }

  return (
    <div className="min-h-screen flex">

      {/* COLUNA ESQUERDA */}
      <div className="hidden md:flex w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div>
          <h1 className="text-white text-4xl font-bold">Festa de <span className="text-amber-400">Ouro</span></h1>
          <p className="text-slate-300 mt-2 text-lg">A sua plataforma de eventos</p>
        </div>
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl"></span>
            <div>
              <h3 className="text-white font-semibold text-xl">Publique seus eventos</h3>
              <p className="text-slate-300 mt-1">Compartilhe festas, churrascos, aniversários e muito mais com a comunidade.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-4xl"></span>
            <div>
              <h3 className="text-white font-semibold text-xl">Filtre por categoria</h3>
              <p className="text-slate-300 mt-1">Encontre eventos esportivos, sociais, culturais e gastronômicos perto de você.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-4xl"></span>
            <div>
              <h3 className="text-white font-semibold text-xl">Conecte-se com pessoas</h3>
              <p className="text-slate-300 mt-1">Comente, demonstre interesse e participe dos eventos da sua comunidade.</p>
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-sm">© 2026 Festa de Ouro · Todos os direitos reservados</p>
      </div>

      {/* COLUNA DIREITA */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Crie sua conta </h2>
            <p className="text-gray-500 mt-2">Junte-se à comunidade de eventos de Ouro Preto</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange}
                  placeholder="João"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                <input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange}
                  placeholder="Silva"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleTelefone}
                  placeholder="(31) 9 9999-9999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  República
                </label>

                <input
                  type="text"
                  name="republica"
                  value={formData.republica}
                  onChange={handleChange}
                  placeholder="Ex: NosTravamus"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <input type={showSenha ? 'text' : 'password'} name="senha" value={formData.senha} onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition pr-12" />
                <button type="button" onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showSenha ? '🔓' : '🔒'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
              <div className="relative">
                <input type={showConfirmar ? 'text' : 'password'} name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange}
                  placeholder="Repita sua senha"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition pr-12" />
                <button type="button" onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showConfirmar ? '🔓' : '🔒'}
                </button>
              </div>
            </div>

            <button type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200 text-lg shadow-md">
              Criar conta
            </button>

          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <p className="text-center text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/" className="text-orange-500 font-semibold hover:underline">Entrar aqui</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Register