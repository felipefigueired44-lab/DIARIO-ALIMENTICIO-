# NutriDiário BR 🇧🇷

Aplicativo de diário alimentício desenvolvido especialmente para o mercado brasileiro.

## 🎯 Funcionalidades

- 📊 **Rastreamento de Calorias e Macros**: Acompanhe sua ingestão diária de calorias, proteínas, carboidratos e gorduras
- 🍽️ **Banco de Alimentos Brasileiros**: Base de dados com alimentos típicos brasileiros
- 📱 **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- 📈 **Gráficos de Progresso**: Visualize sua evolução ao longo do tempo
- 🎯 **Metas Personalizadas**: Defina e acompanhe suas metas nutricionais
- 💧 **Diário de Água**: Controle sua hidratação diária
- 👤 **Perfil Personalizado**: Calcule suas necessidades calóricas baseadas em seus dados
- 🔐 **Sistema de Autenticação**: Seus dados seguros e privados

## 🍕 Diferenciais para o Mercado Brasileiro

- Alimentos brasileiros populares (pão de queijo, feijoada, açaí, etc.)
- Medidas em gramas, ml e porções brasileiras
- Refeições típicas brasileiras
- Interface 100% em português
- Receitas brasileiras saudáveis

## 🚀 Tecnologias

### Backend
- Node.js + Express
- TypeScript
- SQLite/PostgreSQL
- JWT Authentication
- Prisma ORM

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Recharts (gráficos)
- React Router
- Axios

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp backend/.env.example backend/.env

# Executar migrações do banco
npm run migrate --workspace=backend

# Iniciar em modo desenvolvimento
npm run dev
```

## 🏃 Como Usar

1. Acesse http://localhost:5173
2. Crie sua conta
3. Complete seu perfil (altura, peso, idade, objetivo)
4. Comece a registrar suas refeições!

## 📱 Progressive Web App (PWA)

Este aplicativo pode ser instalado no seu celular como um app nativo!

## ☁️ Deploy na Vercel

### Deploy Rápido (5 minutos)

1. **Crie um banco PostgreSQL gratuito:** [Neon.tech](https://neon.tech) ou [Supabase](https://supabase.com)
2. **Deploy na Vercel:** Importe o repositório e configure as variáveis de ambiente
3. **Pronto!** Seu app estará online

📚 Guia completo: [VERCEL-QUICKSTART.md](./VERCEL-QUICKSTART.md)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

MIT
