import { setTimer } from './js/startTimer.js';
import { setModal } from './js/modal.js';
import { setForm } from './js/form.js';
import { PAGE_FORM_SELECTOR } from './js/constants.js';

document.addEventListener('DOMContentLoaded', () => {
  setTimer();
  setModal();
  setForm(PAGE_FORM_SELECTOR);
});
