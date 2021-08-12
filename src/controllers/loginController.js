const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  // console.log(req.session.user);
  if(req.session.user) {
    return res.render('logado');
  }
  return res.render('login');
};

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
  await login.register();

  if(login.errors.length > 0) {
    req.flash('errors', login.errors);
    req.session.save(() => {
      return res.redirect('back');
    });
    return;
  }

  req.flash('success', 'Usuário criado.');
    req.session.save(() => {
      return res.redirect('back');
    });
  } catch (err) {
    console.log(err);
    return res.render('404');
  }
};

exports.logado = async (req, res) => {
  try {
    const login = new Login(req.body);
  await login.login();

  if(login.errors.length > 0) {
    req.flash('errors', login.errors);
    req.session.save(() => {
      return res.redirect('back');
    });
    return;
  }

    req.flash('success', 'Logado!');
    req.session.user = login.user;
    req.session.save(() => {
      return res.redirect('back');
    });
  } catch (err) {
    console.log(err);
    return res.render('404');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}