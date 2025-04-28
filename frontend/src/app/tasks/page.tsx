'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';

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
  const nomeUsuario = typeof window !== 'undefined' ? localStorage.getItem('nomeUsuario') || '' : '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [ordemFiltro, setOrdemFiltro] = useState('desc');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tarefaDeletando, setTarefaDeletando] = useState<number | null>(null);


  const closeModal = () => {
    setIsModalOpen(false);
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  }

  const abrirModalEditar = (tarefa: Tarefa) => {
    setTarefaEditando(tarefa);
    setEditTitulo(tarefa.titulo);
    setEditDescricao(tarefa.descricao || '');
    setIsEditModalOpen(true);
  };

  const handleEditarTarefa = async () => {
    const token = localStorage.getItem('token');

    if (!editTitulo.trim() || !tarefaEditando) {
      alert('Título obrigatório!');
      return;
    }

    try {
      setIsEditing(true);
      await api.put(`/tasks/${tarefaEditando.id}`, {
        titulo: editTitulo,
        descricao: editDescricao,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEditModalOpen(false);
      setTarefaEditando(null);
      setEditTitulo('');
      setEditDescricao('');
      fetchTarefas();
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
    } finally {
      setIsEditing(false);
    }
  };

  const fetchTarefas = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      let url = '/tasks';

      const params = [];
      if (statusFiltro !== 'todos') {
        params.push(`status=${statusFiltro}`);
      }
      if (ordemFiltro) {
        params.push(`order=${ordemFiltro}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await api.get(url, {
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

  const handleAdicionarTarefa = async () => {
    const token = localStorage.getItem('token');

    if (!titulo) {
      alert('Por favor, insira um título para a tarefa.');
      return;
    }

    try {
      setIsAdding(true);
      await api.post('/tasks', {
        titulo,
        descricao
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTitulo('');
      setDescricao('');
      setIsModalOpen(false);
      fetchTarefas();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    } finally {
      setIsAdding(false);
    }
  }

  const alternarConclusao = async (id: number) => {
    const token = localStorage.getItem('token');

    try {
      await api.patch(`/tasks/${id}/alternar`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Atualiza o estado local para refletir a mudança
      fetchTarefas();
    } catch (error) {
      console.error('Erro ao alternar conclusão:', error);
    }
  };

  const confirmarDeletar = (id: number) => {
    setTarefaDeletando(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeletarTarefa = async () => {
    if (tarefaDeletando === null) return;

    const token = localStorage.getItem('token');

    try {
      await api.delete(`/tasks/${tarefaDeletando}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTarefas();
      setIsDeleteModalOpen(false);
      setTarefaDeletando(null);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }
    fetchTarefas();
  }, [statusFiltro, ordemFiltro]);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gradient-to-br from-purple-50 to-purple-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700 mx-auto mb-6"></div>
          <p className="text-purple-700 text-2xl font-medium">Carregando Tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-200">
      <Header nomeUsuario={nomeUsuario} />
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-purple-800 mb-10 text-center drop-shadow-sm"
          >
            Minhas Tarefas
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Tarefa
            </button>
          </motion.div>

          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                style={{ backdropFilter: "blur(5px)" }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">Nova Tarefa</h2>

                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 outline-none text-gray-700 transition-all duration-300"
                  />

                  <textarea
                    placeholder="Descrição (opcional)"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-purple-400 outline-none text-gray-700 transition-all duration-300"
                    rows={4}
                  ></textarea>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={closeModal}
                      className="cursor-pointer	 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAdicionarTarefa}
                      disabled={isAdding}
                      className="px-6 py-2 cursor-pointer	 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {isAdding ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adicionando...
                        </span>
                      ) : 'Adicionar'}
                    </button>
                  </div>

                  <button
                    onClick={closeModal}
                    className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isEditModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeEditModal}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                style={{ backdropFilter: "blur(5px)" }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">Editar Tarefa</h2>

                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    className="w-full p-3 border text-gray-700 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-300"
                  />

                  <textarea
                    placeholder="Descrição (opcional)"
                    value={editDescricao}
                    onChange={(e) => setEditDescricao(e.target.value)}
                    className="w-full p-3 border text-gray-700 border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-300"
                    rows={4}
                  ></textarea>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={closeEditModal}
                      className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleEditarTarefa}
                      disabled={isEditing}
                      className="cursor-pointer	px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {isEditing ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </span>
                      ) : 'Salvar'}
                    </button>
                  </div>

                  <button
                    onClick={closeEditModal}
                    className="cursor-pointer	absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isDeleteModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDeleteModalOpen(false)}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                style={{ backdropFilter: "blur(5px)" }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 relative border border-gray-100"
                >
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>

                  <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">Excluir Tarefa</h2>

                  <p className="text-gray-600 text-center mb-6">
                    Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                  </p>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105 font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeletarTarefa}
                      className="cursor-pointer px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>


          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/30 backdrop-blur-md p-4 rounded-2xl shadow-lg mb-8 border border-white/50"
          >
            <div className="flex flex-wrap justify-center gap-4 mb-2">
              <div className="space-x-2">
                <button
                  onClick={() => setStatusFiltro('todos')}
                  className={`cursor-pointer px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${statusFiltro === 'todos'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-105'
                    : 'bg-white/80 text-purple-800 hover:bg-white'
                    }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFiltro('pendente')}
                  className={`cursor-pointer	px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${statusFiltro === 'pendente'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-105'
                    : 'bg-white/80 text-purple-800 hover:bg-white'
                    }`}
                >
                  Pendentes
                </button>
                <button
                  onClick={() => setStatusFiltro('concluido')}
                  className={`cursor-pointer	px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${statusFiltro === 'concluido'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-105'
                    : 'bg-white/80 text-purple-800 hover:bg-white'
                    }`}
                >
                  Concluídas
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-3 gap-4">
              <button
                onClick={() => setOrdemFiltro('desc')}
                className={`cursor-pointer	px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm flex items-center gap-1 ${ordemFiltro === 'desc'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-105'
                  : 'bg-white/80 text-purple-800 hover:bg-white'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Mais recentes
              </button>
              <button
                onClick={() => setOrdemFiltro('asc')}
                className={`cursor-pointer	px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm flex items-center gap-1 ${ordemFiltro === 'asc'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-105'
                  : 'bg-white/80 text-purple-800 hover:bg-white'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Mais antigas
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid gap-5 mb-8"
          >
            {tarefas.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-md text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-purple-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 text-lg">Nenhuma Tarefa Encontrada</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer	mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Criar Primeira Tarefa
                </button>
              </motion.div>
            ) : (
              tarefas.map((tarefa, index) => (
                <motion.div
                  key={tarefa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-5 rounded-xl shadow-md transition-all duration-300 ${tarefa.concluido
                    ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500'
                    : 'bg-white border-l-4 border-purple-300 hover:border-purple-500'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-grow pr-4">
                      <h2
                        className={`text-xl font-semibold mb-1 ${tarefa.concluido
                          ? 'line-through text-gray-500'
                          : 'text-purple-800'
                          }`}
                      >
                        {tarefa.titulo}
                      </h2>
                      {tarefa.descricao && (
                        <p
                          className={`text-sm ${tarefa.concluido ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                          {tarefa.descricao}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmarDeletar(tarefa.id)}
                        className="cursor-pointer	p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-all duration-300 hover:scale-110"
                        title="Excluir"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      <button
                        onClick={() => abrirModalEditar(tarefa)}
                        className="cursor-pointer	p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-full transition-all duration-300 hover:scale-110"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => alternarConclusao(tarefa.id)}
                        className={`cursor-pointer	p-2 rounded-full transition-all duration-300 hover:scale-110 ${tarefa.concluido
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          : 'bg-green-100 hover:bg-green-200 text-green-600'
                          }`}
                        title={tarefa.concluido ? 'Desfazer' : 'Concluir'}
                      >
                        {tarefa.concluido ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}