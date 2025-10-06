const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

// Rotas
const indexRoutes = require('./routes/indexRoutes');
const gerenciadorRoutes = require('./routes/gerenciadorRoutes');
const userRoutes = require('./routes/userRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const servicosRoutes = require('./routes/servicosRoutes');
const contatoRoutes = require('./routes/contatoRoutes');
const floresRoutes = require('./routes/floresRoutes');
const homenagensRoutes = require('./routes/homenagensRoutes');
const sobreRoutes = require('./routes/sobreRoutes');
const loginRoutes = require('./routes/loginRoutes');
const registrarRoutes = require('./routes/registrarRoutes');
const funeraisRoutes = require('./routes/funeraisRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const formularioRoutes = require('./routes/formularioRoutes');
const pedidosGerenciadorRoutes = require('./routes/pedidosGerenciadorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(expressLayouts);

// Middlewares globais
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Sessão
app.use(
  session({
    secret: 'seuSegredoSeguro',
    resave: false,
    saveUninitialized: true,
  })
);

// Expor sessão nas views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Rotas
app.use('/login', loginRoutes);
app.use('/registrar', registrarRoutes);
app.use('/logout', logoutRoutes);
app.use('/users', userRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/funerais', funeraisRoutes);
app.use('/flores', floresRoutes);
app.use('/homenagens', homenagensRoutes);
app.use('/servicos', servicosRoutes);
app.use('/contato', contatoRoutes);
app.use('/sobre', sobreRoutes);
app.use('/formulario', formularioRoutes);
app.use('/pedidos', pedidosRoutes);

// 🔹 Rotas do admin devem vir antes da indexRoutes
app.use('/gerenciador', gerenciadorRoutes);
app.use('/pedidos-gerenciador', pedidosGerenciadorRoutes);

// 🔹 Index sempre no final
app.use('/', indexRoutes);

// Rota fallback
app.use((req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
