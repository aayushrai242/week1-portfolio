const hoursEl = document.querySelector('#hours');
const minutesEl = document.querySelector('#minutes');
const secondsEl = document.querySelector('#seconds');
const dateDisplay = document.querySelector('#date-display');

function pad(value) {
  return String(value).padStart(2, '0');
}

// Update the live digital clock using the browser's local time.
function updateClock() {
  const now = new Date();
  hoursEl.textContent = pad(now.getHours());
  minutesEl.textContent = pad(now.getMinutes());
  secondsEl.textContent = pad(now.getSeconds());
  dateDisplay.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}
updateClock();
setInterval(updateClock, 1000);

// Countdown timer
const form = document.querySelector('#countdown-form');
const targetInput = document.querySelector('#target-date');
const eventNameInput = document.querySelector('#event-name');
const statusEl = document.querySelector('#countdown-status');
const daysEl = document.querySelector('#days');
const countHoursEl = document.querySelector('#count-hours');
const countMinutesEl = document.querySelector('#count-minutes');
const countSecondsEl = document.querySelector('#count-seconds');

let targetTime = null;
let eventName = 'My next milestone';
let countdownInterval = null;

// Set the picker default to one hour from now, rounded to the next minute.
const defaultTarget = new Date();
defaultTarget.setHours(defaultTarget.getHours() + 1, 0, 0, 0);
targetInput.value = `${defaultTarget.getFullYear()}-${pad(defaultTarget.getMonth() + 1)}-${pad(defaultTarget.getDate())}T${pad(defaultTarget.getHours())}:${pad(defaultTarget.getMinutes())}`;

function updateCountdown() {
  if (!targetTime) return;
  const difference = targetTime - Date.now();

  if (difference <= 0) {
    daysEl.textContent = '00';
    countHoursEl.textContent = '00';
    countMinutesEl.textContent = '00';
    countSecondsEl.textContent = '00';
    statusEl.textContent = `Time's up! ${eventName} has arrived.`;
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  daysEl.textContent = pad(Math.floor(totalSeconds / 86400));
  countHoursEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
  countMinutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  countSecondsEl.textContent = pad(totalSeconds % 60);
  statusEl.textContent = `Counting down to: ${eventName}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedDate = new Date(targetInput.value);

  if (!targetInput.value || Number.isNaN(selectedDate.getTime())) {
    statusEl.textContent = 'Please choose a valid target date and time.';
    return;
  }
  if (selectedDate.getTime() <= Date.now()) {
    statusEl.textContent = 'Choose a date and time in the future.';
    return;
  }

  targetTime = selectedDate.getTime();
  eventName = eventNameInput.value.trim() || 'Your milestone';
  if (countdownInterval) clearInterval(countdownInterval);
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
});
