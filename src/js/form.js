import { registerUserApi } from './api';

const handleFormSubmit = async e => {
  e.preventDefault();
  const { email, name, phone, agreement } = e.target.elements;

  try {
    await registerUserApi({ email, name, phone, agreement });
    alert('Реєстрація пройшла успішно');
    e.target.reset();
  } catch (error) {
    console.log(error.message);
    alert('Сталась помилка - повторіть спробу пізніше');
  }
};

export const setForm = formSelector => {
  const formEl = document.querySelector(formSelector);

  formEl.addEventListener('submit', handleFormSubmit);
};

export const resetForm = formSelector => {
  const formEl = document.querySelector(formSelector);

  formEl.removeEventListener('submit', handleFormSubmit);
};
