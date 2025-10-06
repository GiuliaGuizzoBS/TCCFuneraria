// middlewares/authMiddleware.js
function verificarLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function verificarAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  if (req.session.user.role !== 'admin') {
    return res.redirect('/');
  }

  next();
}

module.exports = { verificarLogin, verificarAdmin };
