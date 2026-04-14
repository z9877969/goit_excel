import { modalTimer, pageTimer, Timer } from './timer.js';

export const setsModal = () => {
  const modal = document.querySelector('.js-modal');

  const modalOpenBtn = document.querySelector('.js-open-modal-btn');
  const modalCloseBtn = document.querySelector('.js-close-modal-btn');

  const handleCloseModal = () => {
    modal.classList.toggle('is-open');
    pageTimer.start();
    modalTimer.stop();
    modalCloseBtn.removeEventListener('click', handleCloseModal);
  };

  modalOpenBtn.addEventListener('click', e => {
    modal.classList.toggle('is-open');
    modalTimer.start();
    pageTimer.stop();
    modalCloseBtn.addEventListener('click', handleCloseModal);
  });
};
