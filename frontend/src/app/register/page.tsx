'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/register', { nome, email, senha });

      router.push('/login');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.mensagem || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gradient-to-br from-purple-100 to-purple-200">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-purple-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
            <p className="text-purple-200 mt-2">Preencha os dados para se cadastrar</p>
          </div>

          <form onSubmit={handleRegister} className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <div className="px-8 pb-6 text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <a href="/login" className="text-purple-600 hover:text-purple-800 font-medium">
                Faça login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
