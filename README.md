# 💰 WealthyBoard

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

**Sistema completo de acompanhamento de investimentos** para gerenciar sua carteira de ações, FIIs, BDRs e criptomoedas com cálculo automático de lucro realizado e não realizado, visualização detalhada do desempenho e gestão completa de transações.

> 📊 Acompanhe seus trades, entenda seus lucros e tome decisões informadas sobre seus investimentos.

## 📑 Índice

- [Destaques](#-destaques)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução](#-instalação-e-execução)
- [API Endpoints](#-api-endpoints)
- [Como Usar](#-como-usar)
- [Métricas Calculadas](#-métricas-calculadas)
- [Interface](#-interface)
- [Próximas Funcionalidades](#-próximas-funcionalidades)
- [Segurança](#-segurança)
- [Testando o Sistema](#-testando-o-sistema)
- [Contribuições](#-contribuições)

## ✨ Destaques

- 💹 **Lucro Realizado vs Não Realizado**: Diferenciação clara entre ganhos efetivos e potenciais
- 🎯 **Gestão Completa**: Crie, edite e delete transações com atualização em tempo real
- 🤖 **Preço Automático**: Sistema define preço atual automaticamente ao adicionar transação
- 📈 **9 Métricas por Ativo**: Análise profunda de cada investimento
- 🎨 **Interface Moderna**: Design dark profissional com animações suaves
- ⚡ **Performance**: Cálculos instantâneos e interface responsiva

## 🚀 Tecnologias

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- CORS
- dotenv

**Frontend:**
- React 18
- React Router DOM
- Axios
- Recharts (gráficos)
- Lucide React (ícones)

## 📋 Funcionalidades

✅ **Cadastro de Transações**: Registre compras e vendas de ativos com cálculo automático do valor total  
✅ **Edição e Exclusão**: Edite ou delete transações diretamente na página do ativo  
✅ **Múltiplas Categorias**: Ações, BDRs, FIIs e Criptomoedas  
✅ **Preço Automático**: Ao adicionar transação, o preço atual é definido automaticamente  
✅ **Lucro Realizado**: Acompanhe lucro/prejuízo de trades fechados (compra + venda)  
✅ **Lucro Não Realizado**: Veja ganhos/perdas das posições ainda abertas  
✅ **Cálculo Automático**: Preço médio, rentabilidade e métricas detalhadas  
✅ **Visualização Segmentada**: Por ativo, categoria ou carteira total  
✅ **Dashboard Interativo**: Gráficos e múltiplas métricas em tempo real  
✅ **Gestão de Preços**: Atualize preços manualmente para cada ativo  
✅ **Histórico Completo**: Visualize e gerencie todas as transações de cada ativo  

## 📁 Estrutura do Projeto

```
wealthyBoard/
├── backend/                 # API Node.js
│   ├── models/             # Modelos MongoDB
│   │   ├── Transaction.js  # Modelo de transações
│   │   └── CurrentPrice.js # Modelo de preços atuais
│   ├── routes/             # Rotas da API
│   │   ├── transactions.js # CRUD de transações
│   │   ├── prices.js       # Gestão de preços
│   │   └── portfolio.js    # Cálculos e resumos
│   ├── server.js           # Servidor Express
│   ├── package.json
│   └── .env.example
│
└── frontend/               # Interface React
    ├── public/
    ├── src/
    │   ├── components/     # Componentes reutilizáveis
    │   │   ├── Layout.js   # Layout com menu lateral
    │   │   ├── Card.js     # Card genérico
    │   │   ├── StatCard.js # Card de estatísticas
    │   │   ├── TransactionModal.js # Modal para criar transações
    │   │   └── EditTransactionModal.js # Modal para editar transações
    │   ├── pages/          # Páginas principais
    │   │   ├── Dashboard.js    # Dashboard geral
    │   │   ├── Stocks.js       # Ações e BDRs
    │   │   ├── FIIs.js         # Fundos Imobiliários
    │   │   ├── Crypto.js       # Criptomoedas
    │   │   └── AssetDetails.js # Detalhes do ativo
    │   ├── services/
    │   │   └── api.js      # Chamadas à API
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js (v16 ou superior)
- MongoDB Atlas (cloud - recomendado) ou MongoDB local

### 🌐 Configurar MongoDB

**Opção 1: MongoDB Atlas (Cloud - Recomendado)**
1. Crie uma conta gratuita em https://www.mongodb.com/cloud/atlas
2. Crie um cluster gratuito (M0)
3. Configure Database Access (crie um usuário)
4. Configure Network Access (adicione `0.0.0.0/0` para permitir acesso)
5. Obtenha a connection string em "Connect" → "Connect your application"

**Opção 2: MongoDB Local**
- Instale o MongoDB Community Edition
- Inicie o serviço: `mongod --dbpath C:\data\db`

### 1️⃣ Configurar o Backend

```powershell
# Navegar para a pasta backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env (copiar do .env.example)
cp .env.example .env

# Editar o .env com suas configurações
# Para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/wealthyboard
# Para MongoDB Local:
# MONGODB_URI=mongodb://localhost:27017/wealthyboard

# Iniciar o servidor
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

### 2️⃣ Configurar o Frontend

```powershell
# Em outro terminal, navegar para a pasta frontend
cd frontend

# Instalar dependências
npm install

# Iniciar a aplicação
npm start
```

A aplicação estará rodando em `http://localhost:3000`

## 📊 API Endpoints

### Transações
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação

### Preços
- `GET /api/prices` - Listar preços
- `GET /api/prices/:ticker` - Obter preço específico
- `POST /api/prices/:ticker` - Atualizar preço
- `DELETE /api/prices/:ticker` - Deletar preço

### Portfolio
- `GET /api/portfolio/asset/:ticker` - Resumo de um ativo
- `GET /api/portfolio/category/:category` - Resumo por categoria
- `GET /api/portfolio/total` - Resumo total da carteira

## 💡 Como Usar

### 1. Adicionar uma Transação
- Acesse a categoria desejada (Ações, FIIs ou Cripto)
- Clique em "Nova Transação"
- Preencha os dados (tipo, ticker, data, quantidade, preço unitário, taxa)
- O valor total e o preço atual do ativo serão definidos automaticamente
- As mudanças aparecem instantaneamente na interface

### 2. Editar ou Deletar Transações
- Acesse os detalhes do ativo clicando no ícone de olho
- Use o ícone de **lápis (azul)** para editar uma transação
- Use o ícone de **lixeira (vermelho)** para deletar
- As alterações refletem imediatamente sem precisar recarregar

### 3. Atualizar Preços Manualmente
- Entre nos detalhes do ativo
- Clique em "Atualizar Preço"
- Digite o novo preço atual
- O sistema recalcula automaticamente todos os lucros/prejuízos

### 4. Visualizar Resultados
- **Dashboard**: Visão geral com 6 métricas principais e gráfico de distribuição
  - Valor Total Investido
  - Valor Atual
  - Lucro Realizado (trades fechados)
  - Lucro Não Realizado (posições abertas)
  - Lucro Total
  - Rentabilidade
- **Por Categoria**: 5 métricas para cada tipo de ativo
- **Por Ativo**: 9 métricas detalhadas + histórico completo de transações

### 5. Entender Lucros
- **Lucro Realizado**: Ganho/perda efetiva de operações finalizadas (comprou e vendeu)
- **Lucro Não Realizado**: Ganho/perda potencial das posições ainda em carteira
- **Lucro Total**: Soma dos dois acima - sua performance geral

## 🎨 Interface

- **Design moderno** com tema escuro profissional
- **Menu lateral** expansível/recolhível para fácil navegação
- **Cards informativos** com métricas destacadas e indicadores visuais
- **Gráficos interativos** (Recharts) para visualização de distribuição por categoria
- **Tabelas responsivas** com ações rápidas (visualizar, editar, deletar)
- **Modais elegantes** para criação e edição de transações
- **Animações suaves** e feedback visual em todas as interações
- **Totalmente responsivo** para desktop, tablet e mobile

## 📈 Métricas Calculadas

O sistema calcula automaticamente diversas métricas financeiras:

**Por Ativo:**
- Quantidade total em carteira
- Preço médio de compra (ponderado)
- Total investido na posição atual
- Valor atual da posição
- Lucro realizado (de trades fechados)
- Lucro não realizado (da posição aberta)
- Lucro total
- Total comprado (histórico)
- Total vendido (histórico)

**Por Categoria e Total:**
- Valor total investido
- Valor atual da carteira
- Lucro realizado
- Lucro não realizado
- Lucro total
- Rentabilidade percentual

**Lógica de Cálculo:**
- O sistema usa FIFO (First In, First Out) para calcular custos
- Vendas reduzem a quantidade e ajustam o investimento proporcionalmente
- Lucro realizado é calculado na diferença entre venda e custo médio
- Taxas são incluídas no cálculo (somadas na compra, subtraídas na venda)

## 🔮 Próximas Funcionalidades

- [ ] Autenticação de usuários JWT (multi-usuário)
- [ ] Integração com APIs de cotações em tempo real (B3, CoinGecko)
- [ ] Gráficos de evolução temporal da carteira
- [ ] Relatórios e métricas anuais (IR, performance)
- [ ] Exportação de dados (CSV, Excel, PDF)
- [ ] Cálculo e registro de dividendos/proventos
- [ ] Comparação de desempenho com índices (IBOV, CDI)
- [ ] Alertas de preço e metas
- [ ] Modo claro/escuro
- [ ] Backup e restore de dados
- [ ] Múltiplas moedas (USD, EUR)
- [ ] App mobile (React Native)

## 🛡️ Segurança

- Credenciais protegidas via `.env` (não versionado)
- Validação de dados no backend
- Sanitização de inputs
- CORS configurado
- MongoDB com autenticação
- Preparado para implementação de JWT

## 🧪 Testando o Sistema

1. Adicione algumas ações (ex: PETR4, VALE3)
2. Registre compras com diferentes preços
3. Atualize o preço atual de cada ativo
4. Observe o cálculo automático de lucro não realizado
5. Registre uma venda parcial
6. Veja o lucro realizado aparecer separadamente
7. Explore as diferentes visualizações (Dashboard, categoria, ativo)

## 🚀 Scripts Disponíveis

**Backend:**
```powershell
npm run dev      # Inicia servidor em modo desenvolvimento (nodemon)
npm start        # Inicia servidor em modo produção
```

**Frontend:**
```powershell
npm start        # Inicia app React em modo desenvolvimento
npm run build    # Cria build otimizado para produção
npm test         # Executa testes (se configurados)
```

## 🔍 Troubleshooting

**Erro de conexão MongoDB:**
- Verifique se a string de conexão está correta no `.env`
- Confirme que o IP está liberado no MongoDB Atlas (Network Access)
- Verifique se usuário e senha estão corretos

**Erro CORS:**
- Verifique se o backend está rodando na porta 5000
- Confirme que o proxy está configurado no `package.json` do frontend

**Porta já em uso:**
```powershell
# Windows - Matar processos Node.js
Get-Process -Name node | Stop-Process -Force
```

## 💻 Decisões Técnicas

**Por que MongoDB?**
- Esquema flexível para evolução futura
- Facilidade de deployment com MongoDB Atlas
- Query performance para agregações financeiras
- Escala horizontal quando necessário

**Por que React?**
- Componentização e reutilização de código
- Ecossistema rico (Router, Recharts)
- Performance com Virtual DOM
- Facilidade de manutenção

**Arquitetura:**
- Backend REST API separado do frontend
- Separação de responsabilidades (MVC)
- Cálculos no backend para consistência
- Frontend focado em apresentação e UX

WealthyBoard © 2026