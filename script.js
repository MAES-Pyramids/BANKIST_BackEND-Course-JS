'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
    '2022-09-01T21:31:17.178Z',
    '2022-08-29T07:42:02.383Z',
    '2022-09-02T09:15:04.904Z',
    '2022-08-31T10:17:24.185Z',
    '2022-09-03T14:11:59.604Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE  pt-PT
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
function stratlogOutTimer() {
  function tick() {
    let minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    let seconds = String(time % 60).padStart(2, 0);
    //display
    labelTimer.textContent = `${minutes}:${seconds}`;

    //condition
    if (time == 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log In to get started`;
    }
    //decrease
    time--;
  }
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
//-------------------------------------
function calculateUserName(accounts) {
  accounts.forEach(user => {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
}
calculateUserName(accounts);
//-------------------------------------
function updateUI(account) {
  //account1.locale = navigator.language;

  displayMovements(account, isSorted);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
}
//-----------------------------------
function formatMovementDate(date, locale) {
  function calcDayBetween(date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));
  }
  const dayPassed = calcDayBetween(new Date(), date);
  if (dayPassed == 0) return 'Today';
  if (dayPassed == 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
}
//-----------------------------------
function formatNumbers(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}
//-----------------------------------
function displayMovements(account, sorted = false) {
  containerMovements.innerHTML = '';
  let sortedData;
  if (sorted == true) {
    sortedData = account.movements.slice().sort((a, b) => a - b);
  } else {
    sortedData = account.movements;
  }
  // const sortedData = sorted
  //   ? account.movements.slice().sort((a, b) => a - b)
  //   : account.movements;

  sortedData.forEach((mov, index) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const moveData = new Date(account?.movementsDates?.at(index));
    const operationDate = formatMovementDate(moveData, currentAccount?.locale);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${operationDate}</div>
    <div class="movements__value">${formatNumbers(
      mov,
      currentAccount?.locale,
      currentAccount?.currency
    )}</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
//-------------------------------------
function calcDisplayBalance(account) {
  account.balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  labelBalance.textContent = `${formatNumbers(
    account?.balance,
    account?.locale,
    account?.currency
  )} 💷`;
}
//-------------------------------------
function calcDisplaySummary(account) {
  const incomes = account.movements
    .filter(value => value >= 0)
    .reduce((acc, value) => acc + value, 0);
  labelSumIn.textContent = `${formatNumbers(
    incomes,
    account?.locale,
    account?.currency
  )}E£`;
  //----
  const outcome = account.movements
    .filter(value => value <= 0)
    .reduce((acc, value) => acc + value, 0);
  labelSumOut.textContent = `${formatNumbers(
    Math.abs(outcome),
    account?.locale,
    account?.currency
  )}E£`;
  //----
  const interest = account.movements
    .filter(value => {
      return value > 0 && (account.interestRate * value) / 100 >= 1;
    })
    .map(value => (value * account.interestRate) / 100)
    .reduce((sum, value) => sum + value, 0);
  labelSumInterest.textContent = `${formatNumbers(
    interest,
    account?.locale,
    account?.currency
  )}`;
}
//-------------------------------------
// login
let currentAccount;
let DefaultMessage;
let timer;
btnLogin.addEventListener('click', function (def) {
  def.preventDefault();
  // check username and create current account
  currentAccount = accounts.find(account => {
    return account.username === inputLoginUsername.value;
  });
  // check if the PIN is correct
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Time start count
    if (timer) clearInterval(timer);
    timer = stratlogOutTimer();

    // welcome
    labelWelcome.textContent = DefaultMessage = `Welcome Back Mr: ${
      currentAccount.owner.split(' ')[0]
    } 🥷`;
    // display
    containerApp.style.opacity = 100;
    // update all methods
    updateUI(currentAccount);
    // clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // data
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
  } else {
    // clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Hide
    containerApp.style.opacity = 0;
    // message
    labelWelcome.textContent = `Sorry Sir, Sign in wasn't correct ,Please try again ⛔`;
  }
});
//-------------------------------------
//transfer
btnTransfer.addEventListener('click', function (def) {
  def.preventDefault();

  const receiver = accounts.find(
    account => account.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  //verifications and conditions
  if (
    receiver &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver.username !== currentAccount.username
  ) {
    // transfer
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    currentAccount.movementsDates?.push(new Date().toISOString());
    receiver.movementsDates?.push(new Date().toISOString());
    //update
    updateUI(currentAccount);
    //message
    labelWelcome.textContent = `congratulations , your transaction done successfully ✅`;
    setTimeout(() => (labelWelcome.textContent = DefaultMessage), 3000);

    clearInterval(timer);
    timer = stratlogOutTimer();
  } else {
    labelWelcome.textContent = `sorry , your transaction data is wrong ❌`;
    setTimeout(() => (labelWelcome.textContent = DefaultMessage), 3000);
  }
});
//-------------------------------------
// Delete the user
btnClose.addEventListener('click', def => {
  def.preventDefault();

  const user = accounts.find(
    account => account.username === inputCloseUsername.value
  );

  if (user?.pin == inputClosePin.value) {
    const index = accounts.findIndex(
      account => account.username == user.username
    );
    console.log(index);

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//-------------------------------------
// Loan
btnLoan.addEventListener('click', def => {
  def.preventDefault();

  const loan = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  if (
    loan > 0 &&
    currentAccount.movements.some(movement => movement >= loan * 0.1)
  ) {
    // get loan
    currentAccount.movements.push(loan);
    currentAccount.movementsDates?.push(new Date().toISOString());
    // updateUI and clean
    updateUI(currentAccount);
    // Message
    labelWelcome.textContent = `Congratulations , your loan successfully accepted ✅`;
    setTimeout(() => (labelWelcome.textContent = DefaultMessage), 3000);

    clearInterval(timer);
    timer = stratlogOutTimer();
  } else {
    labelWelcome.textContent = `sorry Sir, your balance doesn't support this loan ❌`;
    setTimeout(() => (labelWelcome.textContent = DefaultMessage), 3000);
  }
});
//-------------------------------------
//sorting
let isSorted = false;
btnSort.addEventListener('click', def => {
  def.preventDefault();
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});
//-------------------------------------
