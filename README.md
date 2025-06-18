# Chatbot de Contexto

Um chatbot inteligente que permite fazer perguntas sobre um texto de contexto definido pelo usuário. O sistema utiliza processamento de linguagem natural e embeddings para fornecer respostas precisas baseadas no contexto fornecido.

Repositório: [github.com/nathanheinzmann/chatbot-ia-local](https://github.com/nathanheinzmann/chatbot-ia-local)

## 🚀 Funcionalidades

- Definição de contexto textual pelo usuário
- Interface de chat intuitiva
- Respostas baseadas no contexto definido
- Processamento de linguagem natural em português

## 🛠️ Tecnologias Utilizadas

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Transformers.js (Xenova)

## 📋 Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/nathanheinzmann/chatbot-ia-local.git
cd chatbot-ia-local
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação em `http://localhost:3000`

## 💻 Como Usar

1. Cole ou digite o texto de contexto na interface e clique em "Definir Contexto"
2. Faça perguntas sobre o conteúdo do contexto no campo de chat
3. O sistema irá responder com base no contexto fornecido

## 🤖 Modelos de IA Utilizados

- Embeddings: Xenova/all-MiniLM-L6-v2
- Geração de Texto: Xenova/mt5-small

## 📝 Notas

- O sistema processa o contexto em memória para melhor performance
- As respostas são geradas com base no contexto mais relevante
- O sistema utiliza similaridade de cosseno para encontrar os trechos mais relevantes

## 🔒 Privacidade

- Todo o processamento é feito localmente no navegador
- Os textos não são enviados para servidores externos
- Os modelos de IA são carregados e executados localmente

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
