import { MODAL_FORM_SELECTOR, PAGE_FORM_SELECTOR } from './constants.js';
import { resetForm, setForm } from './form.js';
import { modalTimer, pageTimer } from './timer.js';

export const setModal = () => {
  const modal = document.querySelector('.js-modal');

  const modalOpenBtn = document.querySelector('.js-open-modal-btn');
  const modalCloseBtn = document.querySelector('.js-close-modal-btn');

  const handleCloseModal = () => {
    modal.classList.toggle('is-open');
    pageTimer.start();
    modalTimer.stop();
    resetForm(MODAL_FORM_SELECTOR);
    modalCloseBtn.removeEventListener('click', handleCloseModal);
  };

  modalOpenBtn.addEventListener('click', () => {
    modal.classList.toggle('is-open');
    modalTimer.start();
    pageTimer.stop();
    resetForm(PAGE_FORM_SELECTOR);
    setForm(MODAL_FORM_SELECTOR);
    modalCloseBtn.addEventListener('click', handleCloseModal);
  });

  window.addEventListener('resize', e => {
    const isMobile = e.target.screen.width < 768;
    const isModalOpen = modal.classList.contains('is-open');
    if (!isMobile && isModalOpen) {
      modal.classList.toggle('is-open');
      pageTimer.start();
      modalTimer.stop();
      resetForm(MODAL_FORM_SELECTOR);
      setForm(PAGE_FORM_SELECTOR);
    }
  });
};
