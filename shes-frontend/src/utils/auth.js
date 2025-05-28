 

export const saveUserToLocalStorage = ({ token, role, userId }) => {
  localStorage.setItem('user', JSON.stringify({ token, role, userId }));
};


export function getUserFromLocalStorage() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem('user');
}