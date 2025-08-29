export const showHome = (req, res) => {
  // Se o usuário está logado, redirecionar para as salas
  if (req.session.userId) {
    return res.redirect('/rooms');
  }
  
  // Caso contrário, mostrar página de login
  res.redirect('/auth/login');
};
