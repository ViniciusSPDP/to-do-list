# TO-DO-LIST - Projeto Completo com Next.js, Node.js, Express, MySQL

Este projeto é uma aplicação completa de lista de tarefas (**TO-DO-LIST**) construída do zero utilizando tecnologias modernas de mercado.

## 🚀 Tecnologias utilizadas

- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend:** Node.js + Express + MySQL + JWT
- **Banco de dados:** MySQL
- **Autenticação:** JSON Web Token (JWT) + BcryptJS
- **Hospedagem:** (preparado para deploy no Vercel e Railway)

## 🎯 Funcionalidades

- Cadastro de novos usuários
- Login seguro com autenticação JWT
- Proteção de rotas no frontend e backend
- CRUD completo de tarefas:
  - Criar nova tarefa
  - Listar tarefas
  - Editar tarefa
  - Concluir/desconcluir tarefa
  - Deletar tarefa
- Filtros de tarefas:
  - Filtrar tarefas pendentes ou concluídas
  - Ordenar tarefas (mais recentes ou mais antigas)
- Interface moderna e responsiva em tons de roxo
- Modais para criação e edição de tarefas
- Confirmação de exclusão de tarefas
- Logout seguro

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos:

- Node.js instalado
- MySQL instalado

### Passos:

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

2. **Instale as dependências do backend e frontend**

```bash
# Acesse o backend
cd backend
npm install

# Acesse o frontend
cd ../frontend
npm install
```
3. **Configure o Banco de Dados**
```bash
 - Crie um banco MySQL.
 - Rode o arquivo setup.sql para criar as tabelas.
 - Configure o .env do backend:

DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=projeto_tarefas
JWT_SECRET=sua_chave_secreta
PORT=5000
```
4. **Inicie o Backend**

```bash
# Dentro da pasta backend
npm run dev
```
```bash
5. **Inicie o Frontend**
# Dentro da pasta frontend
npm run dev
```
Desenvolvido por Vinicius Saraiva🚀
Projeto criado para fins de aprendizado e portfólio.