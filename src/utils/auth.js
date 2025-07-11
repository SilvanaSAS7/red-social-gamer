// Simula base de datos local usando localStorage

export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem('dravora_users')) || [];
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    localStorage.setItem('dravora_currentUser', JSON.stringify(user));
    return true;
  }
  return false;
};

export const registerUser = (name, email, password) => {
  let users = JSON.parse(localStorage.getItem('dravora_users')) || [];
  const exists = users.some((u) => u.email === email);
  if (exists) return false;
  users.push({ name, email, password });
  localStorage.setItem('dravora_users', JSON.stringify(users));
  return true;
};

export const logoutUser = () => {
  localStorage.removeItem('dravora_currentUser');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('dravora_currentUser'));
};
