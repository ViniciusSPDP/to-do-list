import db from "../database.js";

export const criarTarefa = async (req, res) => {
    try {
        const { titulo, descricao } = req.body;

        //Verifica se o título
        if (!titulo) {
            return res.status(400).json({ message: "Título da tarefa é obrigatório" });
        }

        //Iserir a nova tarefa no banco de dados
        await db.query("INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES (?, ?, ?)",
            [
                titulo,
                descricao || null,
                req.usuarioId
            ]
        );

        res.status(201).json({ message: "Tarefa criada com sucesso" });

    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        return res.status(500).json({ message: "Erro ao criar tarefa" });
    }
}

export const listarTarefas = async (req, res) => {
    try {

        const { status, order } = req.query; //Status da tarefa (concluida ou pendente)

        let query = "SELECT * FROM tarefas WHERE usuario_id = ?";
        let params = [req.usuarioId];

        //Verifica se o usuario quer filtrar as tarefas por status
        if (status === 'pendente') {
            query += " AND concluido = false";
        }else if (status === 'concluido') {
            query += " AND concluido = true";
        }

        //Ordenação
        if (order && order.toLowerCase() === 'asc') {
            query += " ORDER BY id ASC";
        }else{
            query += " ORDER BY id DESC";
        }

        //Busca as tarefas do banco de dados do usuario logado
        const [tarefas] = await db.query(query, params);


        res.status(200).json(tarefas);
    } catch (error) {
        console.error("Erro ao listar tarefas:", error);
        return res.status(500).json({ message: "Erro ao listar tarefas" });
    }

}

export const editarTarefa = async (req, res) => {
    try {
        const { id } = req.params; // ID da tarefa a ser editada da URL
        const { titulo, descricao } = req.body; //Ddados atualizados da tarefa

        //Verifica se a tarefa pertence ao usuario logado
        const [tarefa] = await db.query(
            "SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?",
            [id, req.usuarioId]
        );

        if (tarefa.length === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }

        //Atualiza a tarefa no banco de dados
        await db.query(
            "UPDATE tarefas SET titulo = ?, descricao = ? WHERE id = ? AND usuario_id = ?",
            [
                titulo,
                descricao,
                id,
                req.usuarioId
            ]
        );

        return res.status(200).json({ message: "Tarefa atualizada com sucesso" });


    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        return res.status(500).json({ message: "Erro ao atualizar tarefa" });
    }
}

export const deletarTarefa = async (req, res) => {

    try{
        const { id } = req.params; // ID da tarefa a ser deletada da URL

        //Verifica se a tarefa pertence ao usuario logado
        const [tarefa] = await db.query(
            "SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?",
            [id, req.usuarioId]
        );

        if (tarefa.length === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }

        //Deleta a tarefa no banco de dados
        await db.query(
            "DELETE FROM tarefas WHERE id = ? AND usuario_id = ?",
            [
                id,
                req.usuarioId
            ]
        );

        return res.status(200).json({ message: "Tarefa deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        return res.status(500).json({ message: "Erro ao deletar tarefa" });
    }

}

export const alternarConclusao = async (req, res) => {

    try{
        const { id } = req.params; // ID da tarefa a ser editada da URL

        //Verifica se a tarefa pertence ao usuario logado
        const [tarefas] = await db.query(
            "SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?",
            [id, req.usuarioId]
        );

        if (tarefas.length === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }

        const tarefaAtual = tarefas[0];

        //Inverter o valor da coluna "concluido"
        const novoStatus = !tarefaAtual.concluido;


        //Atualiza a tarefa no banco de dados
        await db.query(
            "UPDATE tarefas SET concluido = ? WHERE id = ? AND usuario_id = ?",
            [
                novoStatus,
                id,
                req.usuarioId
            ]
        );

        const mensagem = novoStatus 
        ? "Tarefa concluída com sucesso" 
        : "Tarefa marcada como pendente";

        return res.status(200).json({ message: mensagem });

    }catch (error) {
        console.error("Erro ao alternar conclusão da tarefa:", error);
        return res.status(500).json({ message: "Erro ao alternar conclusão da tarefa" });
    }

}