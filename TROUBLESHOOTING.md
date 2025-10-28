# 🛠️ Troubleshooting - NutriDiário BR

## Erros Comuns e Soluções

### ❌ Erro de Content Security Policy (CSP)

**Erro:**
```
Refused to load the stylesheet because it violates the following Content Security Policy directive
```

**Causa:**
- Extensões do navegador (Google Translate, tradutores automáticos)
- Configurações de CSP muito restritivas no navegador ou CDN

**Soluções:**

#### Solução 1: Desabilitar Tradução Automática (Mais Comum)
O erro geralmente ocorre por causa de extensões de tradução do navegador:

1. **Chrome/Edge:**
   - Clique com botão direito → Traduzir → "Nunca traduzir este site"
   - Ou desabilite a tradução automática: Settings → Languages → Desabilitar "Offer to translate"

2. **Firefox:**
   - Vá em about:preferences#general
   - Em "Language", desabilite ofertas de tradução

3. **Desabilite extensões de tradução temporariamente**

4. **Recarregue a página** (Ctrl+Shift+R / Cmd+Shift+R)

#### Solução 2: Usar Modo Desenvolvimento
Se o erro acontecer em desenvolvimento local, use:

```bash
npm run dev
```

Acesse: http://localhost:5173

O Vite não aplica CSP restritivo em desenvolvimento.

#### Solução 3: Configuração de Segurança (Produção)
O projeto já está configurado com headers de segurança apropriados no `vercel.json`:

```json
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ..."
```

Se você modificou a configuração e o app não funciona, verifique:
- A CSP permite recursos necessários (scripts, styles, imagens)
- O domínio da API está em `connect-src`
- Fontes externas estão em `font-src` e `style-src`

#### Nota sobre Segurança
⚠️ A configuração atual usa `'unsafe-inline'` e `'unsafe-eval'` para compatibilidade com React/Vite. Para produção de alta segurança, considere:
- Usar nonces para scripts inline
- Remover `'unsafe-eval'` se possível
- Implementar CSP mais restritivo após análise dos recursos necessários

---

### ❌ Erro: "Cannot connect to API"

**Causa:** Backend não está rodando ou URL incorreta

**Soluções:**

1. **Desenvolvimento Local:**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

2. **Produção (Vercel):**
- Verifique se `VITE_API_URL` está configurada nas variáveis de ambiente
- Certifique-se que o backend está online

---

### ❌ Erro: "Database connection failed"

**Causa:** Banco de dados não configurado ou connection string incorreta

**Soluções:**

1. **Desenvolvimento Local:**
```bash
cd backend
cp .env.example .env
npm run migrate
npm run seed
```

2. **Produção:**
- Verifique a `DATABASE_URL` nas variáveis de ambiente da Vercel
- Certifique-se que o banco PostgreSQL está acessível
- Execute as migrations:
```bash
DATABASE_URL="sua_url" npx prisma migrate deploy
DATABASE_URL="sua_url" npm run seed
```

---

### ❌ Erro: "JWT malformed" ou "Token inválido"

**Causa:** Token JWT expirado ou inválido

**Solução:**
1. Faça logout
2. Limpe o localStorage:
   - Abra DevTools (F12)
   - Console → digite: `localStorage.clear()`
   - Recarregue a página
3. Faça login novamente

---

### ❌ Erro: "Port 3000 already in use"

**Causa:** Outra aplicação está usando a porta

**Solução:**

1. **Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill -9
```

2. **Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID [numero_do_processo] /F
```

3. **Ou mude a porta:**
```bash
# No arquivo backend/.env
PORT=3001
```

---

### ❌ Erro: "Module not found" ou "Cannot find package"

**Causa:** Dependências não instaladas

**Solução:**
```bash
# Limpar e reinstalar tudo
rm -rf node_modules backend/node_modules frontend/node_modules
rm package-lock.json backend/package-lock.json frontend/package-lock.json
npm install
```

---

### ❌ Frontend não atualiza após mudanças

**Causa:** Cache do navegador ou Vite

**Solução:**
1. Limpe o cache: Ctrl + Shift + R (ou Cmd + Shift + R no Mac)
2. Pare e reinicie o servidor de desenvolvimento
3. Limpe o cache do Vite:
```bash
rm -rf frontend/.vite frontend/dist
npm run dev
```

---

### ❌ Erro de CORS

**Erro:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solução:**

1. **Desenvolvimento:** O proxy do Vite deve resolver. Verifique `vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

2. **Produção:** Configure CORS no backend para aceitar o domínio do frontend:
```typescript
// backend/src/server.ts
app.use(cors({
  origin: ['https://seu-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

### ❌ Build falha na Vercel

**Causa:** Erro de TypeScript ou falta de variáveis de ambiente

**Solução:**

1. **Teste o build localmente primeiro:**
```bash
npm run build
```

2. **Verifique os logs na Vercel:**
- Dashboard → Seu projeto → Deployments → Clique no deployment falhado → View Build Logs

3. **Variáveis de ambiente faltando:**
- Certifique-se que configurou todas as variáveis necessárias

---

### ❌ Prisma: "Table not found"

**Causa:** Migrations não foram executadas

**Solução:**
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
npm run seed
```

---

### ❌ Dados não persistem após reload

**Causa:** Usando SQLite em ambiente efêmero (Vercel)

**Solução:**
- Use PostgreSQL (Neon, Supabase, Railway)
- SQLite não persiste dados na Vercel (filesystem efêmero)

---

## 🆘 Precisa de Mais Ajuda?

1. **Verifique os logs:**
   - Backend: Terminal onde rodou `npm run dev:backend`
   - Frontend: Console do navegador (F12)
   - Vercel: Dashboard → Deployments → Logs

2. **Issues comuns no GitHub:**
   - [Link para issues]

3. **Documentação:**
   - [Prisma Docs](https://www.prisma.io/docs)
   - [Vite Docs](https://vitejs.dev)
   - [Vercel Docs](https://vercel.com/docs)

4. **Abra uma issue:**
   - Descreva o erro
   - Inclua logs completos
   - Sistema operacional e versão do Node.js
