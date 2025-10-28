# 🚀 Deploy Rápido na Vercel

> ⚠️ **Nota Importante**: Este projeto usa um monorepo. O frontend e backend são implantados juntos em um único deploy!

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

### 2. Deploy na Vercel (Frontend + Backend Juntos)

1. **Acesse:** https://vercel.com
2. **Login/Signup** com sua conta GitHub
3. **Clique em "Add New Project"**
4. **Importe seu repositório:** `felipefigueired44-lab/DIARIO-ALIMENTICIO-`
5. **Configure o Projeto:**
   - **Framework Preset:** Detectará automaticamente (deixe em "Other")
   - **Root Directory:** Deixe vazio (usa a raiz do projeto)
   - ✅ O arquivo `vercel.json` já está configurado para fazer deploy de ambos

6. **Adicione Variáveis de Ambiente:**
   ```
   DATABASE_URL=sua_connection_string_do_neon_ou_supabase
   JWT_SECRET=minha_chave_super_secreta_e_aleatoria_123456789
   NODE_ENV=production
   ```

7. **Clique em "Deploy"** e aguarde (2-3 minutos)

### 3. Configure o Banco de Dados

Após o deploy inicial, execute localmente para criar as tabelas:

```bash
# No seu computador
cd backend
DATABASE_URL="sua_connection_string_aqui" npx prisma migrate deploy
DATABASE_URL="sua_connection_string_aqui" npm run seed
```

### 4. Pronto! 🎉

- **Frontend:** Acesse a URL fornecida pela Vercel (ex: `https://seu-projeto.vercel.app`)
- **API Backend:** Automaticamente disponível em `https://seu-projeto.vercel.app/api`

### 5. (Opcional) Configurar Domínio Personalizado

Na Vercel:
1. Vá em Settings → Domains
2. Adicione seu domínio customizado

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
