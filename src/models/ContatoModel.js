const mongoose = require("mongoose");
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  createAt: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.prototype.register = async function() {
  this.validate();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
}

Contato.prototype.validate = function() {
  this.clean();
if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido.');
if(!this.body.nome) this.errors.push('Nome é obrigatório.');
if(!this.body.email && !this.body.telefone) this.errors.push('Preencha ao menos o email ou telefone.');
}


Contato.prototype.clean = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  }
}

Contato.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.validate();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
}

// Metodos estáticos
Contato.getbyId = async function(id) {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
}

Contato.getByContato = async function() {
  const contatos = await ContatoModel.find().sort({ createAt: 1 }); // -1 = DESC, 1 = CRESC
  return contatos;
}

Contato.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id }); // Deleta o contato pelo id
  return contato;
}


module.exports = Contato;
