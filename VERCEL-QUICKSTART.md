# 🚀 Deploy Rápido na Vercel

## Opção Mais Fácil: Deploy com 1 Clique

### 1. Crie um Banco PostgreSQL Gratuito

Escolha uma opção:

**Neon (Recomendado):**
1. Acesse: https://neon.tech
2. Clique em "Sign Up"
3. Crie um novo projeto
4. Copie a connection string (algo como: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`)

**Supabase:**
1. Acesse: https://supabase.com
2. Crie um projeto
3. Vá em Settings > Database > Connection String
4. Copie a connection string

### 2. Deploy na Vercel

#### Backend:

1. Acesse: https://vercel.com
2. Clique em "Add New Project"
3. Importe seu repositório GitHub
4. Configure:
   - **Root Directory:** `backend`
   - **Framework Preset:** Other

5. Adicione Variáveis de Ambiente:
   ```
   DATABASE_URL=sua_connection_string_aqui
   JWT_SECRET=qualquer_texto_longo_e_aleatorio
   NODE_ENV=production
   ```

6. Clique em "Deploy"
7. Copie a URL do backend (ex: `https://seu-backend.vercel.app`)

#### Configurar Banco:

Depois que o backend fizer deploy, execute localmente:

```bash
cd backend
DATABASE_URL="sua_connection_string" npx prisma migrate deploy
DATABASE_URL="sua_connection_string" npm run seed
```

#### Frontend:

1. Na Vercel, crie outro projeto
2. Importe o mesmo repositório
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Adicione Variável de Ambiente:
   ```
   VITE_API_URL=https://seu-backend.vercel.app
   ```

5. Clique em "Deploy"

### 3. Pronto! 🎉

Acesse a URL do frontend fornecida pela Vercel!

---

## Alternativa: Deploy via CLI

```bash
# Instalar CLI
npm install -g vercel

# Deploy Backend
cd backend
vercel --prod

# Deploy Frontend
cd ../frontend
vercel --prod
```

---

## Troubleshooting

**Backend não conecta ao banco:**
- Verifique se a `DATABASE_URL` está correta
- Execute as migrations: `npx prisma migrate deploy`

**Frontend não conecta ao backend:**
- Verifique se `VITE_API_URL` está configurada
- Certifique-se que aponta para a URL correta do backend

**Erro de CORS:**
- Adicione a URL do frontend nas configurações de CORS do backend

---

## Links Úteis

- [Neon (PostgreSQL gratuito)](https://neon.tech)
- [Supabase (PostgreSQL gratuito)](https://supabase.com)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
