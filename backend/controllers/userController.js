import db from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Função para cadastrar um novo usuário
export const registerUser = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Verifica se o usuário já existe
        const [existingUser] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        // Criptografa a senha
        //const hashedPassword = await bcrypt.hash(password, 10);
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // Insere o novo usuário no banco de dados
        await db.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senhaCriptografada]);

        return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({ message: "Erro ao cadastrar usuário" });
    }
}

// Função para fazer login do usuário
export const loginUser = async (req, res) => {

    try {
        const { email, senha } = req.body;

        // Verifica se o usuário existe
        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        // Busca o usuário no banco de dados
        const [user] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (user.length === 0) {
            return res.status(401).json({ message: "Usuario não encontrado" });
        }

        const usuario = user[0];

        //Compara a senha digitada com a senha armazenada
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ message: "Senha incorreta" });
        }

        // Gera um token JWT
        const token = jwt.sign(
            { id: usuario.id},
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        //Responder com sucesso
        res.status(200).json({
            mensagem: "Login realizado com sucesso",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error("Erro ao logar usuário:", error);
        return res.status(500).json({ message: "Erro ao logar usuário" });
    };
}