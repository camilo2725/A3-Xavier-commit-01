<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Atendente - Gerenciar Reservas</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background-color: #f2f2f2;
    }

    h2 {
      color: #333;
    }

    form {
      background-color: white;
      padding: 20px;
      margin-bottom: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    label {
      display: block;
      margin-bottom: 10px;
    }

    input[type="text"],
    input[type="number"],
    input[type="date"],
    input[type="time"] {
      width: 100%;
      padding: 8px;
      margin-top: 4px;
      box-sizing: border-box;
    }

    button {
      padding: 10px 20px;
      background-color: #4CAF50;
      border: none;
      color: white;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #45a049;
    }

    #resposta {
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>Cliente Atendente - Reservas</h1>

  <!-- Criar Reserva -->
  <h2>Criar Reserva</h2>
  <form id="formCriarReserva">
    <label>Data:
      <input type="date" name="data" required>
    </label>

    <label>Hora:
      <input type="time" name="hora" required>
    </label>

    <label>Mesa:
      <input type="number" name="mesa" required>
    </label>

    <label>Quantidade de Pessoas:
      <input type="number" name="quantidade" required>
    </label>

    <label>Responsável:
      <input type="text" name="responsavel" required>
    </label>

    <button type="submit">Criar Reserva</button>
  </form>

  <!-- Cancelar Reserva -->
  <h2>Cancelar Reserva</h2>
  <form id="formCancelarReserva">
    <label>ID da Reserva:
      <input type="number" name="reserva_id" required>
    </label>
    <button type="submit">Cancelar Reserva</button>
  </form>

  <p id="resposta"></p>

  <script>
    const resposta = document.getElementById('resposta');

    // Criar reserva
    document.getElementById('formCriarReserva').addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      const dados = Object.fromEntries(formData.entries());

      fetch('http://localhost:5000/criar_reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      })
      .then(response => response.json())
      .then(data => {
        resposta.textContent = data.mensagem;
        resposta.style.color = 'green';
      })
      .catch(error => {
        resposta.textContent = 'Erro ao criar reserva.';
        resposta.style.color = 'red';
      });
    });

    // Cancelar reserva
    document.getElementById('formCancelarReserva').addEventListener('submit', function(e) {
      e.preventDefault();

      const reserva_id = e.target.reserva_id.value;

      fetch('http://localhost:5000/cancelar_reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reserva_id })
      })
      .then(response => response.json())
      .then(data => {
        resposta.textContent = data.mensagem;
        resposta.style.color = 'green';
      })
      .catch(error => {
        resposta.textContent = 'Erro ao cancelar reserva.';
        resposta.style.color = 'red';
      });
    });
  </script>
</body>
</html>