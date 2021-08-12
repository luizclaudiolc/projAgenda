const Contato = require('../models/ContatoModel');

exports.index = async(req, res) => {
  const contatos = await Contato.getByContato();
  res.render('index', { contatos });
};

