'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

interface Tarefa {
    id: number;
    titulo: string;
    descricao: string;
    concluido: boolean;
}

export default function TasksPage() {
    const router = useRouter();
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTarefas = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await api.get('/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTarefas(response.data);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        } finally {
            setLoading(false);
        }
    };

    const alternarConclusao = async (id: number) => {
        const token = localStorage.getItem('token');

        try {
            await api.patch(`/tasks/${id}/alternar`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            // Atualiza o estado local para refletir a mudança
            fetchTarefas();
        } catch (error) {
            console.error('Erro ao alternar conclusão:', error);
        }
    }

    useEffect(() => {
        fetchTarefas();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen justify-center items-center bg-purple-100">
                <p className='text-purple-700 text-xl'>Carregando Tarefas...</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-6">
            <h1 className='text-3xl font-bold text-purple-700 mb-8 text-center'>Minhas Tarefas</h1>

            <div className='grid gap-4 max-w-3xl mx-auto'>
                {tarefas.length === 0 ? (
                    <p className='text-center text-gray-600'>Nenhuma Tarefa Encontrada</p>
                ) : (
                    tarefas.map((tarefa) => (
                        <div
                            key={tarefa.id}
                            className={`p-4 rounded-lg shadow-md flex justify-between items-center ${tarefa.concluido ? 'bg-purple-300' : 'bg-white'}`}
                        >
                            <div>
                                <h2 className={`text-lg font-semibold ${tarefa.concluido} ? 'line-through text-gray-700' : text-purple-700`}>
                                    {tarefa.titulo}
                                </h2>
                                {tarefa.descricao && (
                                    <p className='text-sm text-gray-600'>{tarefa.descricao}</p>
                                )}
                            </div>
                            <button
                                onClick={() => alternarConclusao(tarefa.id)}
                                className='bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition duration-200'
                            >
                                {tarefa.concluido ? 'Desfazer' : 'Concluir'}

                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}


