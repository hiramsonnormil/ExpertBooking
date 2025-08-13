function autenticar(req, res, next) {
  if (req.session.usuario) return next();
  res.redirect('/');
}

export {
  autenticar
}