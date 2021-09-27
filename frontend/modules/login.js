import validator from "validator";

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if(!this.form) return;
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const el = e.target;
    const email = el.querySelector('input[name="email"]');
    const password = el.querySelector('input[name="password"]');

    let errors = false;
    
    if(!validator.isEmail(email.value)) {
      this.createError('E-mail inválido.', email);
      errors = true;
    }
    
    if(!validator.isLength(password.value, 3, 20)) {
      this.createError('Senha inválida.', password);
      errors = true;
    }

    if(!errors) el.submit();
  }

  createError(messege, el) {
    const p = document.createElement('p');
    p.className = 'error';
    p.style.color = '#ff0000';
    p.innerHTML = messege;
    el.insertAdjacentElement('afterend', p);

    setTimeout(() => {
      p.remove();
    }, 1500);
  }
}
