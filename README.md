# PROJETO A3 – Gerenciamento de Restaurante

**Professor:** Eduardo Sidney da Silva Xavier  
**Disciplina:** Sistemas Distribuídos e Mobile

---

## 👨‍👩‍👧‍👦 Integrantes do Grupo

- Iuri Freire E. de Almeida – *RA: 12724141707*
- Arthur Amaral Correia de Almeida – *RA: 12724141663*  
- Breno Dantas Oliveira Filho – *RA: 1272417582*  
- Ramon Queiroz G. Pinto – *RA: 12724126768* 
- Adrian Ferreira Andrade – *RA: 12724133589* 
- Camilo Fondado – *RA: 12724149761*  

---

## 🧾 Descrição do Projeto

O sistema de **gerenciamento para restaurantes** possui controle de reservas e acesso por diferentes tipos de usuários, simulando o fluxo de trabalho de um bar/restaurante e seus respectivos atores.

O sistema permite a entrada de múltiplos usuários, classificados em três tipos de cargo:

- **Atendente:** cria e cancela reservas.  
- **Garçom:** confirma que uma reserva foi atendida e libera a mesa.  
- **Gerente:** requisita relatórios:
  1. Reservas confirmadas por garçom  
  2. Reservas em andamento (por número da mesa)  
  3. Reservas realizadas em um determinado intervalo de tempo  

---

## 🔐 Lista de Usuários (Login de Teste)

| Nome       | Email               | Senha     | Cargo     |
|------------|---------------------|-----------|-----------|
| Alice      | alice@email.com     | 123456    | gerente   |
| Bob        | bob@email.com       | senha123  | gerente   |
| Gustavo    | gustavo@email.com   | 123456    | gerente   |
| Maria      | maria@email.com     | 123456    | atendente |
| Carlos     | carlos@email.com    | 123456    | atendente |
| Leila      | leila@email.com     | 123456    | atendente |
| Vanuza     | vanuza@email.com    | 123456    | garçom    |
| Severino   | severino@email.com  | 123456    | garçom    |
| Nilton     | nilton@email.com    | 123456    | garçom    |

---

## 🗃️ Tabelas no Banco de Dados (Render)

### 📄 `reservas`
```js
return knex.schema.createTable('reservas', (table) => {
    table.increments('id').primary();
    table.date('data').notNullable();
    table.time('hora').notNullable();
    table.integer('numeMesa').notNullable();
    table.integer('quantPessoas').notNullable();
    table.string('nomeRespons', 100).notNullable();
    table.string('statusMesa', 20).defaultTo('reservada');
    table.string('statusAnterior', 20).nullable();
    table.string('garcomResponsavel', 100).nullable();
    table.integer('usuario_id').unsigned().references('id').inTable('usuarios').onDelete('SET NULL');
    table.timestamps(true, true);
});
```

### 📄 `usuarios`
```js
return knex.schema.createTable('usuarios', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').notNullable().unique();
    table.string('senha').notNullable();
    table.string('cargo').notNullable();
    table.timestamps(true, true);
});
```

### 🌱 Seed de usuários
```js
await knex('usuarios').insert([
    { nome: 'Alice', email: 'alice@email.com', senha: '123456', cargo: 'gerente' },
    { nome: 'Bob', email: 'bob@email.com', senha: 'senha123', cargo: 'gerente' },
    { nome: 'Gustavo', email: 'gustavo@email.com', senha: '123456', cargo: 'gerente' },
    { nome: 'Maria', email: 'maria@email.com', senha: '123456', cargo: 'atendente' },
    { nome: 'Carlos', email: 'carlos@email.com', senha: '123456', cargo: 'atendente' },
    { nome: 'Leila', email: 'leila@email.com', senha: '123456', cargo: 'atendente' },
    { nome: 'Vanuza', email: 'vanuza@email.com', senha: '123456', cargo: 'garcom' },
    { nome: 'Severino', email: 'severino@email.com', senha: '123456', cargo: 'garcom' },
    { nome: 'Nilton', email: 'nilton@email.com', senha: '123456', cargo: 'garcom' },
]);
```

---

## ⚙️ Pré-requisitos

- Node.js  
- React  

> A aplicação foi desenvolvida em **React + JavaScript**.  
> Os componentes foram majoritariamente importados do **Bootstrap** via link direto no `public/index.html`, sem necessidade de instalar a biblioteca com `npm`.

---

## ⚠️ Habilitar Execução de Scripts no PowerShell

**Erro comum:** `"não pode ser carregado porque a execução de scripts foi desabilitada neste sistema."`

### Passos:
1. **Abrir o PowerShell como administrador**  
2. Verificar política atual:  
   ```powershell
   Get-ExecutionPolicy
   ```
3. Se retornar `"Restricted"`, execute:  
   ```powershell
   Set-ExecutionPolicy RemoteSigned
   ```
4. Verifique novamente:  
   ```powershell
   Get-ExecutionPolicy
   ```
   Deve retornar: `RemoteSigned`

---

## 📦 Instalação de Dependências

### Backend:
```bash
cd backend
npm install
```

### Frontend:
```bash
cd frontend
npm install
```

---

## ▶️ Execução do Projeto

### Iniciar o Backend:
```bash
cd backend/src
npm start
# ou
node index.js
```

### Iniciar o Frontend:
```bash
cd frontend
npm start
# ou
node App.js
```

---

## 📝 Observações Importantes!

- Certifique-se de que o arquivo `.env` esteja em:  
  `backend/src`

- Se ocorrer erro relacionado a **SSL Connections**, mova o `.env` para:  
  `backend/`

- O componente `SignUpForm`, destinado ao cadastro de usuários no banco via CRUD, **não está funcional**.  
  A tabela `usuarios` foi povoada via seed:  
  `npm run seed:user`

---

## 📡 Justificativa para o uso do REST

O projeto utiliza a arquitetura **REST** (Representational State Transfer) por ser leve, padronizada e adequada para sistemas distribuídos como o proposto.

### Vantagens:
1. **Simplicidade:** Uso de métodos HTTP padrão (GET, POST, PUT, DELETE).  
2. **Desacoplamento:** Frontend (React) e Backend (Node.js) se comunicam via endpoints REST.  
3. **Reutilização:** Mesmos endpoints podem atender web, mobile, administrativo, etc.  
4. **Suporte Amplo:** Fácil integração com ferramentas modernas.

---