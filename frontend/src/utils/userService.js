const USERS_KEY = 'usuarios';

export const getUsers = () => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
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

