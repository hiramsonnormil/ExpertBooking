export const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

export const redirectIfAuth = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/rooms');
  }
  next();
};
