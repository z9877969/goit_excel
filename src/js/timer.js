import { DateTime } from 'luxon';
import {
  DEADLINE_TIME,
  MODAL_TIMER_SELECTOR,
  PAGE_TIMER_SELECTOR,
} from './constants';

export class Timer {
  constructor({ targetDate: targetDate = DEADLINE_TIME, selector }) {
    this.targetDate = DateTime.fromISO(targetDate).setZone('Europe/Kyiv');
    this.targetDate = this.targetDate.minus({ seconds: 1 });

    this.container = document.querySelector(selector);
    this.nodes = {
      days: this.container.querySelector('.timer__days .timer__digits'),
      hours: this.container.querySelector('.timer__hours .timer__digits'),
      minutes: this.container.querySelector('.timer__minutes .timer__digits'),
      seconds: this.container.querySelector('.timer__seconds .timer__digits'),
    };
    this.intervalId = null;
  }

  pad(value) {
    return String(value).padStart(2, '0');
  }

  render(days, hours, mins, secs) {
    this.nodes.days.textContent = days;
    this.nodes.hours.textContent = this.pad(hours);
    this.nodes.minutes.textContent = this.pad(mins);
    this.nodes.seconds.textContent = this.pad(secs);
  }

  update() {
    const currentTime = new Date();
    const timeDiff = this.targetDate - currentTime;

    if (timeDiff <= 0) {
      this.stop();
      this.render(0, 0, 0, 0);
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((timeDiff % (1000 * 60)) / 1000);

    this.render(days, hours, mins, secs);
  }

  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

export const modalTimer = new Timer({
  selector: MODAL_TIMER_SELECTOR,
  targetDate: DEADLINE_TIME,
});

export const pageTimer = new Timer({
  selector: PAGE_TIMER_SELECTOR,
  targetDate: DEADLINE_TIME,
});
