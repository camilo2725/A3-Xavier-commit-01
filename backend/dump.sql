CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    cargo TEXT NOT NULL
);

INSERT INTO usuarios (nome, email, senha, cargo) VALUES
('Alice', 'alice@email.com', '123456', 'gerente'),
('Bob', 'bob@email.com', 'senha123', 'gerente'),
('Gustavo', 'gustavo@email.com', '123456', 'gerente'),
('Maria', 'maria@email.com', '123456', 'atendente'),
('Carlos', 'carlos@email.com', '123456', 'atendente'),
('Leila', 'leila@email.com', '123456', 'atendente'),
('Vanuza', 'vanuza@email.com', '123456', 'garcom'),
('Severino', 'severino@email.com', '123456', 'garcom'),
('Nilton', 'nilton@email.com', '123456', 'garcom');


CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  nume_mesa INTEGER NOT NULL,
  quant_pessoas INTEGER NOT NULL,
  nome_respons VARCHAR(100) NOT NULL,
  status_mesa VARCHAR(20) DEFAULT 'reservada',
  status_anterior VARCHAR(20),
  garcom_responsavel VARCHAR(100),
  usuario_id INTEGER REFERENCES usuario(id)
);
