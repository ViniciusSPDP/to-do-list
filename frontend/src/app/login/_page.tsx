'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/login', { email, senha });
            const { token } = response.data;

            // Salvar o token no localStorage
            localStorage.setItem('token', token);

            // Redirecionar para a página de tarefas
            router.push('/tasks');
        } catch (err: any) {
            console.error(err);
            // Exibir mensagem de erro
            setError(err.response?.data?.mensagem || "Erro ao fazer login.");
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gray-100">
            <form onSubmit={handleLogin} className='bg-white p-8 rounded shadow-md w-full max-w-md'>
                <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>
                {error && <div className='bg-red-200 text-red-700 p-3 mb-4 rounded'>{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                    required
                />

                <input
                    type="password"
                    placeholder='Senha'
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full p-3 border rounded mb-6"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
                >
                    Entrar
                </button>
            </form>
        </div>
    )

}