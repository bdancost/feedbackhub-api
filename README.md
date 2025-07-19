# 🛠️✨ FeedbackHub API

Bem-vindo ao **FeedbackHub API**!  
Este é o backend da plataforma FeedbackHub, responsável por autenticação, gestão de feedbacks e integração com banco de dados.

---

## 🚀 Tecnologias

- 🟩 **Node.js** + **Express**
- 🗄️ **Prisma ORM** (PostgreSQL)
- 🔒 **JWT Auth**
- 📧 **Nodemailer**
- 🦺 **Zod** (Validação)
- 🦾 **Pino** (Logs)
- 🛡️ **Helmet** + **Rate Limit**
- 📚 **Swagger** (Documentação)
- 🧪 **Jest** + **Supertest** (Testes)

---

## 📦 Instalação

```bash
git clone https://github.com/bdancost/feedbackhub-api.git
cd feedbackhub/feedbackhub_api
npm install
```

---

## ⚙️ Configuração

1. Crie o arquivo `.env`:

   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/feedbackhub?schema=public"
   JWT_SECRET="sua_chave_secreta"
   PORT=3333
   EMAIL_USER=seu_email@gmail.com
   EMAIL_PASS=sua_senha_app
   ```

2. Rode as migrações do banco:

   ```bash
   npx prisma migrate dev
   ```

---

## ▶️ Executando

```bash
npm run dev
```

Acesse: [http://localhost:3333](http://localhost:3333)

---

## 📚 Documentação Interativa

- Swagger disponível em:  
  [http://localhost:3333/api-docs](http://localhost:3333/api-docs)  
  ![Swagger Animation](https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/swagger.svg)

---

## 🔑 Funcionalidades

- 👤 **Autenticação JWT**: Registro e login seguro.
- 📝 **CRUD de Feedbacks**: Crie, edite, liste e exclua feedbacks.
- 📧 **Envio de E-mail**: Confirmação ao enviar feedback.
- 🛡️ **Proteção de rotas**: Apenas usuários autenticados podem modificar feedbacks.
- 🦺 **Validação**: Todos os dados validados com Zod.
- 🦾 **Logs**: Ações importantes logadas com Pino.
- 🛡️ **Rate Limiting & Helmet**: Segurança contra abusos.

---

## 🔗 Fluxo de Funcionamento

1. **Usuário registra/login**  
   &rarr; Recebe token JWT.

2. **Token nas requisições**  
   &rarr; Protege rotas sensíveis.

3. **Criação de feedback**  
   &rarr; Validação, persistência e e-mail de agradecimento.

4. **Listagem/Edição/Exclusão**  
   &rarr; Apenas o dono pode editar/deletar.

---

## 🧪 Testes

```bash
npm test
```

Cobertura completa dos principais fluxos.

---

## 🖼️ Preview

![API Animation](https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif)

---

## 💡 Autor

Desenvolvido por Daniel Fernandes  
[GitHub](https://github.com/bdancost) | [LinkedIn](https://www.linkedin.com/in/seu-perfil)

---

## 🎉 Bom código! 🚀
