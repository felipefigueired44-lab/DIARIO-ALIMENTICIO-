# 🚀 Guia de Instalação - NutriDiário BR

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## 📦 Instalação

### 1. Clone o repositório e instale as dependências

```bash
# Instalar todas as dependências (backend e frontend)
npm install
```

### 2. Configure o Backend

```bash
# Copiar arquivo de exemplo de variáveis de ambiente
cp backend/.env.example backend/.env

# Edite backend/.env se necessário (valores padrão já funcionam para desenvolvimento)
```

### 3. Configure o Banco de Dados

```bash
# Gerar o Prisma Client
npm run prisma:generate --workspace=backend

# Executar migrations
npm run migrate --workspace=backend

# Popular banco com alimentos brasileiros
npm run seed --workspace=backend
```

## ▶️ Executar o Aplicativo

### Modo Desenvolvimento (Backend + Frontend)

```bash
npm run dev
```

Isso irá iniciar:
- Backend na porta 3000 (http://localhost:3000)
- Frontend na porta 5173 (http://localhost:5173)

### Executar separadamente

```bash
# Apenas Backend
npm run dev:backend

# Apenas Frontend
npm run dev:frontend
```

## 🏗️ Build para Produção

```bash
# Build completo
npm run build

# Iniciar em produção
npm start
```

## 📱 Acesso

Abra seu navegador em: **http://localhost:5173**

1. Crie sua conta
2. Complete seu perfil
3. Comece a rastrear suas refeições!

## 🗄️ Banco de Dados

O aplicativo usa SQLite por padrão (arquivo `backend/dev.db`), perfeito para desenvolvimento.

Para usar PostgreSQL em produção, altere a `DATABASE_URL` no arquivo `backend/.env`:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nutridiario"
```

E atualize o `provider` no arquivo `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Mudar de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🔐 Segurança

**IMPORTANTE:** Em produção, altere o `JWT_SECRET` no arquivo `backend/.env` para um valor seguro e aleatório!

## 🛠️ Troubleshooting

### Erro de porta em uso
Se as portas 3000 ou 5173 estiverem em uso, você pode alterá-las:
- Backend: Edite `PORT` no arquivo `backend/.env`
- Frontend: Edite `server.port` no arquivo `frontend/vite.config.ts`

### Erro ao executar migrations
Certifique-se de que o diretório `backend` existe e que você executou `npm install` corretamente.

### Banco de dados travado
Se encontrar erro de "database is locked", feche todos os processos que estão usando o banco e tente novamente.

## 📞 Suporte

Se encontrar problemas, abra uma issue no GitHub com:
- Descrição do erro
- Logs do console
- Sistema operacional
- Versão do Node.js
