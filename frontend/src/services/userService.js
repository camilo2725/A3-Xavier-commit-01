const USERS_KEY = 'usuarios';
const LOGGED_USER_KEY = 'user';
const RESERVAS_KEY = 'reservas';

export const getUsers = () => {
    const data = localStorage.getItem(USERS_KEY);
    const users = data ? JSON.parse(data) : [];
    console.log("Usuários carregados do localStorage:", users);
    return users;
};

export const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addUser = (newUser) => {
    const users = getUsers();
    const exists = users.some(user => user.email === newUser.email);
    if (exists) throw new Error("Email já cadastrado.");
    users.push(newUser);
    saveUsers(users);
};

export const findUserByEmailAndPassword = (email, senha) => {
    const users = getUsers();
    return users.find(user => user.email === email && user.senha === senha);
};

export const saveLoggedUser = (user) => {
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
};

export const getLoggedUser = () => {
    const data = localStorage.getItem(LOGGED_USER_KEY);
    return data ? JSON.parse(data) : null;
};

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
