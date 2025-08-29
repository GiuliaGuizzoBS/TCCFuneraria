// middlewares/authMiddleware.js
function verificarLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function verificarAdmin(req, res, next) {
  // Primeiro verifica login
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // Garante que role exista e é admin
  if (req.session.user.role !== 'admin') {
    // Redireciona para home do usuário
    return res.redirect('/'); 
  }

  next();
}

module.exports = { verificarLogin, verificarAdmin };
