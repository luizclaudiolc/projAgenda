require('dotenv').config(); // Variaveis de ambiente (sempre ignorar no gitignore)
const express = require('express'); // Importa o express
const app = express();
const mongoose = require('mongoose'); // Importa o mongoose para modela a conexão com o banco de dados(dessa forma sempre retorna uma promise)
mongoose.connect(process.env.CONNECTIONSTRING, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(() => {
    console.log('Base de dados conectada');
    app.emit('connectado'); // Emite um evento para dizer que a conexão foi feita
  })
  .catch((err) => {
    console.log('Erro ao conectar ao banco de dados', err)
});

const session = require('express-session'); // Importa o express-session e o usa para criar sessões para os usuários.
const MongoStore = require('connect-mongo'); // para salvar as sessions no mongo(BD)
const flashMessege = require('connect-flash'); // para enviar mensagens de erro e sucesso para o usuário(auto destruíva as mensagens depois que o usuário vê e só funciona na session)
const routes = require('./routes'); // rotas da aplicação
const path = require('path'); // para trabalhar com caminhos
// const helmet = require('helmet'); // para trabalhar com segurança
const csrf = require('csurf'); // para trabalhar com segurança criando tokens para todos os formulários impedindo que sites maliciosos possam enviar dados para o servidor
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware'); // importa os middlewares


app.use(express.urlencoded({ extended: true })); // para usar o POST
app.use(express.json()); // para usar o POST com JSON
app.use(express.static(path.resolve(__dirname, 'public'))); // para usar o arquivos estáticos

const sessionOptions = session({ // cria e configura as opções para cada sessão
  secret: 'kdsfndskljfnsdçflsdgfjgsdfgsdfçgdfpgdfgfdçhjdflhmdfn', // secreto para criar a sessão
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }), // para salvar as sessões no banco de dados
  resave: false, // para salvar as sessões no banco de dados
  saveUninitialized: false, // para salvar as sessões no banco de dados
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias de sessão para o usuário (para o cookie) 
    httpOnly: true, // para não ser acessado via javascript (para o cookie)
  },
});
app.use(sessionOptions); // usa as opções de sessão
app.use(flashMessege()); // usa o flashMessege para enviar mensagens de erro e sucesso para o usuário(auto destruíva as mensagens depois que o usuário vê e só funciona na session)
// app.use(helmet()); // usa o helmet para trabalhar com segurança

app.use(csrf()); //precisar ser usado antes dos middleware globais
// Meus proprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.set('views', path.resolve(__dirname, 'src', 'views')); // para configurar o diretório das views
app.set('view engine', 'ejs'); // para configurar o engine de renderização das views(ejs) porem exitem outras opções como pug e hbs

app.on('connectado', () => { // recebe o evento para dizer que a conexão foi feita
  app.listen(3333, () => { // para iniciar o servidor
    console.log('Server in port 3333!'); // para mostrar que o servidor está rodando
  });
});

