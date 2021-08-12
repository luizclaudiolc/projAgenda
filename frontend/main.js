import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './assets/css/style.css';
import Login from './modules/login';
import Contato from './modules/contato';


const login = new Login('.form-login');
const cadastro = new Login('.form-cadastro');

const contato = new Contato('.contato');

login.init();
cadastro.init();
contato.init();

