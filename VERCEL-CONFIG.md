# 🔧 Configuração Correta da Vercel

## ⚠️ IMPORTANTE: Reconfigurar o Projeto na Vercel

O erro "Não é possível OBTER /" acontece porque as configurações do projeto na Vercel estão incorretas.

## 📋 Passo a Passo COMPLETO:

### 1. Deletar o Projeto Atual (se existir)

1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto
3. Settings → Clique em **"Delete Project"** no final da página
4. Confirme a exclusão

### 2. Criar Novo Projeto com Configurações Corretas

1. **Volte ao Dashboard:** https://vercel.com/dashboard
2. **Clique em "Add New Project"**
3. **Importe o repositório:** `felipefigueired44-lab/DIARIO-ALIMENTICIO-`

### 3. CONFIGURAÇÃO CRUCIAL - Root Directory

⚠️ **Esta é a parte mais importante!**

Na tela de configuração do projeto:

1. **Framework Preset:** Selecione **"Vite"**
2. **Root Directory:** Clique em **"Edit"** e digite: `frontend`
3. **Build Command:** (deixe em branco, usará o padrão: `npm run build`)
4. **Output Directory:** (deixe em branco, usará o padrão: `dist`)
5. **Install Command:** (deixe em branco, usará o padrão: `npm install`)

### 4. Variáveis de Ambiente (Opcional por enquanto)

Se você tiver um backend configurado, adicione:
```
VITE_API_URL=https://seu-backend.vercel.app
```

Se não tiver backend ainda, **pule esta etapa**.

### 5. Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. Pronto! ✅

## 📸 Exemplo Visual das Configurações

```
┌─────────────────────────────────────┐
│ Configure Project                    │
├─────────────────────────────────────┤
│ Framework Preset:    Vite           │
│ Root Directory:      frontend    ← IMPORTANTE!│
│ Build Command:       (auto)          │
│ Output Directory:    (auto)          │
│ Install Command:     (auto)          │
└─────────────────────────────────────┘
```

## ✅ Verificação

Após o deploy:
- Acesse a URL fornecida pela Vercel
- Deve aparecer a página de login/registro do NutriDiário BR
- Se aparecer "Não é possível OBTER /", revise o **Root Directory**

## 🆘 Se Ainda Não Funcionar

1. **Verifique os logs:**
   - Dashboard → Projeto → Deployments → Último deploy → "View Function Logs"

2. **Cheque o Root Directory:**
   - Settings → General → Root Directory deve estar: `frontend`

3. **Force um novo deploy:**
   - Deployments → Três pontos → "Redeploy"

## 📚 Arquivos do Projeto

A estrutura correta é:
```
DIARIO-ALIMENTICIO-/
├── frontend/          ← Root Directory na Vercel
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── backend/
├── vercel.json        ← Configuração mínima (rewrites + headers)
└── package.json
```

## 💡 Dica

O `vercel.json` na raiz agora só contém:
- `rewrites`: Para o SPA funcionar (todas rotas → index.html)
- `headers`: CSP e segurança

A Vercel detecta automaticamente que é um projeto Vite quando você configura o Root Directory!
