export const logout = () => {
  localStorage.removeItem('token'); // Удаляем JWT
  localStorage.removeItem('user');  // Если хранишь данные юзера
  window.location.href = '/auth?login';  // Жесткий редирект для сброса стейта
};