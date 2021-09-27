const mongoose = require("mongoose");
const vaildator = require("validator");
const bcrypt = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.validate();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if(!this.user) {
      this.errors.push('Usuário não existe');
      return;
    }

    if(!bcrypt.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha incorreta');
      this.user = null;
      return;
    }
  }

  async register() {
    this.validate();
    if(this.errors.length > 0) return;

    await this.userExists();
    
    if(this.errors.length > 0) return;

    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);
    
    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if(this.user) {
      this.errors.push('Email já existe.');
    }
  }
  

  validate() {
    this.clean();
    // Check if email is valid
    if(!vaildator.isEmail(this.body.email)) this.errors.push('Email inválido.');
    // Check if password contais at least 8 characters
    // if(!validator.isLength(this.body.password, 8)) {
    //   this.errors.push('Senha deve ter no mínimo 8 caracteres');
    // }
    if(this.body.password.length < 3 || this.body.password.length > 20) {
      this.errors.push('Senha deve ter no mínimo 3 e no máximo 20 caracteres');
    }
  }

  clean() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    }
  }
}

module.exports = Login;
