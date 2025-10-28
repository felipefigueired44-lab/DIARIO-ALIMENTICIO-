# 🚀 Guia de Deploy na Vercel - NutriDiário BR

## Opção 1: Deploy Automático (Recomendado)

### 1️⃣ Faça Login na Vercel

Acesse: https://vercel.com

### 2️⃣ Importe o Projeto

1. Clique em **"Add New Project"**
2. Importe seu repositório do GitHub
3. A Vercel detectará automaticamente a configuração

### 3️⃣ Configure as Variáveis de Ambiente

**Para o Backend:**

Na Vercel, adicione estas variáveis de ambiente:

```
DATABASE_URL=postgresql://seu_usuario:sua_senha@seu_host/seu_banco
JWT_SECRET=um_secret_super_seguro_e_aleatorio_aqui
NODE_ENV=production
```

**IMPORTANTE:** Você precisa de um banco PostgreSQL. Opções gratuitas:

#### Opção A: Neon (Recomendado - Gratuito)
1. Acesse: https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string
5. Use como `DATABASE_URL`

#### Opção B: Supabase (Gratuito)
1. Acesse: https://supabase.com
2. Crie um projeto
3. Vá em Settings > Database
4. Copie a connection string
5. Use como `DATABASE_URL`

#### Opção C: Railway (Gratuito)
1. Acesse: https://railway.app
2. Crie um PostgreSQL
3. Copie a connection string

### 4️⃣ Ajuste o Schema do Prisma

Antes de fazer deploy, atualize o arquivo `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Mudar de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5️⃣ Adicione Scripts de Build

O arquivo `package.json` raiz precisa ter:

```json
{
  "scripts": {
    "vercel-build": "npm run build --workspace=frontend && npm run build --workspace=backend"
  }
}
```

### 6️⃣ Deploy!

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. Seu app estará no ar! 🎉

---

## Opção 2: Deploy Separado (Backend + Frontend)

### Backend na Vercel

1. Crie um novo projeto na Vercel
2. Selecione apenas a pasta `backend`
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy!
5. Copie a URL do backend (ex: `https://seu-backend.vercel.app`)

### Frontend na Vercel

1. Crie outro projeto na Vercel
2. Selecione apenas a pasta `frontend`
3. Configure a variável:
   - `VITE_API_URL=https://seu-backend.vercel.app`
4. Em Settings > Build:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Deploy!

---

## Opção 3: Deploy Manual via CLI

### Instale a CLI da Vercel

```bash
npm install -g vercel
```

### Deploy do Backend

```bash
cd backend
vercel --prod
```

Siga os prompts e configure as variáveis de ambiente.

### Deploy do Frontend

```bash
cd frontend
vercel --prod
```

---

## 🗄️ Configurar Banco de Dados

Após obter a connection string do PostgreSQL:

### 1. Atualize o schema

```bash
# No arquivo backend/prisma/schema.prisma
# Mude o provider de "sqlite" para "postgresql"
```

### 2. Execute as migrations

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
npm run seed
```

---

## ⚙️ Configurações Importantes

### CORS

O backend já está configurado com CORS habilitado. Se precisar ajustar:

```typescript
// backend/src/server.ts
app.use(cors({
  origin: ['https://seu-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Variáveis de Ambiente no Frontend

Atualize `frontend/src/lib/api.ts` para usar variáveis de ambiente:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## 🔧 Troubleshooting

### Erro de Conexão com Banco

- Verifique se a `DATABASE_URL` está correta
- Certifique-se que o provider no schema.prisma é "postgresql"
- Execute as migrations: `npx prisma migrate deploy`

### Erro 404 nas Rotas

- Verifique o arquivo `vercel.json`
- Certifique-se que as rotas estão configuradas corretamente

### Build Falha

- Verifique os logs na Vercel
- Certifique-se que todas as dependências estão no `package.json`
- Teste o build localmente: `npm run build`

### CORS Errors

- Adicione a URL do frontend nas configurações de CORS do backend
- Verifique se `credentials: true` está configurado

---

## 📱 Após o Deploy

1. Acesse a URL fornecida pela Vercel
2. Crie sua conta
3. Complete seu perfil
4. Comece a usar!

### URLs Exemplo

- Frontend: `https://nutridiario-br.vercel.app`
- Backend: `https://nutridiario-br-api.vercel.app`

---

## 🎯 Deploy One-Click (Mais Fácil)

### Deploy com um clique:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU_USUARIO/DIARIO-ALIMENTICIO-)

**Depois do deploy:**
1. Configure as variáveis de ambiente na Vercel
2. Crie um banco PostgreSQL (Neon, Supabase, etc.)
3. Execute as migrations
4. Pronto!

---

## 💡 Dicas

- Use o plano gratuito da Vercel (suficiente para começar)
- Configure um domínio customizado (opcional)
- Ative HTTPS automático (já vem habilitado)
- Configure alertas de erro
- Use o Vercel Analytics para monitorar uso

---

## 🆘 Precisa de Ajuda?

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- Abra uma issue no GitHub
