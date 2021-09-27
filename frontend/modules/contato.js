import validator from "validator";

export default class Contato {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if(!this.form) return;
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const el = e.target;
    const { name, sobrenome, email, telefone } = { 
      name: el.querySelector('input[name="nome"]'),
      sobrenome: el.querySelector('input[name="sobrenome"]'),
      email: el.querySelector('input[name="email"]'),
      telefone: el.querySelector('input[name="telefone"]')
    };
    // console.log(name.value, sobrenome.value, email.value, telefone.value);

    let errors = false;

    if(!validator.isNumeric(telefone.value)) {
      this.createError(telefone, 'Telefone deve ser numérico');
      errors = true;
    }

    if(!validator.isEmail(email.value)) {
      this.createError(email, 'Email inválido');
      errors = true;
    }

    if(!validator.isLength(name.value, 3, 50)) {
      this.createError(name, 'Nome deve ter entre 3 e 50 caracteres');
      errors = true;
    }

    if(!validator.isLength(sobrenome.value, 3, 50)) {
      this.createError(sobrenome, 'Sobrenome deve ter entre 3 e 50 caracteres');
      errors = true;
    }

    if(!errors) el.submit();
  }

  createError(el, message) {
    const p = document.createElement('p');
    p.classList.add('error');
    p.innerHTML = message;
    p.style.color = '#ff0000';
    el.insertAdjacentElement('afterend', p);

    setInterval(() => {
      p.remove();
    }, 1500);
  }
}