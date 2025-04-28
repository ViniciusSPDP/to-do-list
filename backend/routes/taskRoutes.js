import express from 'express';
import { criarTarefa, listarTarefas, editarTarefa, deletarTarefa, alternarConclusao } from '../controllers/taskController.js';
import { proteger } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota para criar uma nova tarefa: Protegida
router.post('/tasks', proteger, criarTarefa);

// Rota para listar todas as tarefas: Protegida
router.get('/tasks', proteger, listarTarefas)

// Rota para editar uma tarefa: Protegida
router.put('/tasks/:id', proteger, editarTarefa);

// Rota para deletar uma tarefa: Protegida
router.delete('/tasks/:id', proteger, deletarTarefa);   

// Rota para alterar a tarefa: Protegida
router.patch('/tasks/:id/alternar', proteger, alternarConclusao);


export default router;