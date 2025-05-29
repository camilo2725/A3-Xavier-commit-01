const USERS_KEY = 'usuarios';
const LOGGED_USER_KEY = 'user';
const RESERVAS_KEY = 'reservas';

// Retorna todos os usuários cadastrados
export const getUsers = () => {
    const data = localStorage.getItem(USERS_KEY);
    const users = data ? JSON.parse(data) : [];
    console.log("Usuários carregados do localStorage:", users);
    return users;
};

// Salva a lista de usuários
export const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Adiciona novo usuário (com verificação de e-mail)
export const addUser = (newUser) => {
    const users = getUsers();
    const exists = users.some(user => user.email === newUser.email);
    if (exists) throw new Error("Email já cadastrado.");
    users.push(newUser);
    saveUsers(users);
};

// Busca usuário por e-mail e senha (para login)
export const findUserByEmailAndPassword = (email, senha) => {
    const users = getUsers();
    return users.find(user => user.email === email && user.senha === senha);
};

// ✅ Salva o usuário logado
export const saveLoggedUser = (user) => {
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
};

// ✅ Recupera o usuário logado
export const getLoggedUser = () => {
    const data = localStorage.getItem(LOGGED_USER_KEY);
    return data ? JSON.parse(data) : null;
};

// 🚪 Remove o usuário logado
export const logoutUser = () => {
    localStorage.removeItem(LOGGED_USER_KEY);
};

export const getReservas = () => {
    const data = localStorage.getItem(RESERVAS_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveReservas = (reservas) => {
    const reservasParaSalvar = reservas.map(reserva => ({ ...reserva }));
    console.log("Salvando reservas no localStorage:", reservasParaSalvar);
    localStorage.setItem(RESERVAS_KEY, JSON.stringify(reservasParaSalvar));
};

