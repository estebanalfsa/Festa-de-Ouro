import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        console.log('Login:', email, password)
        navigate('/home')
    }

    return (
        <div className="min-h-screen flex">

            {/* COLUMNA IZQUIERDA */}
            <div className="hidden md:flex w-1/2 bg-slate-900 flex-col justify-between p-12">

                {/* LOGO PS  */}
                <div>
                    <h1 className="text-white text-4xl font-bold">Festa de <span className="text-amber-400">Ouro</span></h1>
                    <p className="text-slate-300 mt-2 text-lg">A sua plataforma de eventos</p>
                </div>

                {/* INFORMACION CENTRAl */}
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

                {/* Footer izquierdo */}
                <p className="text-slate-400 text-sm">© 2026 Festa de Ouro · Todos os direitos reservados</p>
            </div>

            {/* COLUMNA DERECHA EL Login */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
                <div className="w-full max-w-md">

                    {/* Título */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Bem-vindo de volta</h2>
                        <p className="text-gray-500 mt-2">Entre na sua conta para continuar</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleLogin} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                <a href="#" className="text-sm text-orange-500 hover:underline">
                                    Esqueceu a senha?
                                </a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200 text-lg shadow-md"
                        >
                            Entrar
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-400 text-sm">ou</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Registro */}
                    <p className="text-center text-gray-600">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-orange-500 font-semibold hover:underline">
                            Cadastre-se grátis
                        </Link>
                    </p>

                </div>
            </div>

        </div>
    )
}

export default Login