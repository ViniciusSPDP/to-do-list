'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/login', { email, senha });
            const { token, usuario } = response.data;

            // Salvar o token no localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('nomeUsuario', usuario.nome);

            // Redirecionar para a página de tarefas
            router.push('/tasks');
        } catch (err: any) {
            console.error(err);
            // Exibir mensagem de erro
            setError(err.response?.data?.mensagem || "Credenciais inválidas. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gradient-to-br from-purple-100 to-purple-200">
            <div className="w-full max-w-md p-8">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-purple-600 p-6 text-center">
                        <h1 className="text-3xl font-bold text-white">Bem-vindo</h1>
                        <p className="text-purple-200 mt-2">Entre para acessar sua conta</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="p-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200 text-gray-950"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
                                <a href="#" className="text-sm text-purple-600 hover:text-purple-800">Esqueceu a senha?</a>
                            </div>
                            <input
                                id="senha"
                                type="password"
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200 text-gray-950"
                                required
                            />
                        </div>

                        <div className="flex items-center mb-6">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" 
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                Lembrar-me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 flex justify-center items-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="px-8 pb-6 text-center border-t border-gray-200 pt-6">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta? <a href="/register" className="text-purple-600 hover:text-purple-800 font-medium">Registre-se</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}