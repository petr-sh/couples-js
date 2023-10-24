(() => {
  let intervalID;
  let restartNumber;

  function createSettingsPage() {
    const sectionSetting = document.querySelector('.setting');
    const title = document.createElement('h1');
    const form = document.createElement('form');
    const input = document.createElement('input');
    const btn = document.createElement('button');

    title.classList.add('title');
    form.classList.add('form');
    input.classList.add('input');
    btn.classList.add('button');

    title.textContent = '\'НАЙДИ ПАРУ\'';
    form.textContent = 'Выберите уровень сложности';
    input.type = 'number';
    input.placeholder = 'Введите чётное число от 2 до 10';
    btn.textContent = 'Начать игру';

    form.append(input, btn);
    sectionSetting.append(title, form);

    return {
      title,
      form,
      input
    };
  }

  function createCardsList() {
    const list = document.createElement('ul');

    list.classList.add('cards-list');

    return list;
  }

  function createCard(number, size) {
    const card = document.createElement('li');

    card.classList.add('card');
    card.textContent = number;
    card.style.width = `${size}%`;
    card.style.height = `${size}%`;

    return card;
  }

  function createCardsPage(array) {
    const sectionCards = document.querySelector('.cards');
    const cardsList = createCardsList();

    let cardSize;

    for (const cardNumber of array) {
      cardSize = 100 / Math.sqrt(array.length);

      cardsList.append(
        createCard(cardNumber, cardSize)
      );
    }

    sectionCards.append(cardsList);

    cardsList.style.height = `${cardsList.offsetWidth}px`;
    cardsList.style.fontSize = `${Math.floor(cardsList.offsetWidth / 100 * cardSize * .65)}px`;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  function getCardsArray(number) {
    const arrayCards = [];

    for (let i = 1; i <= number; i++) {
      arrayCards.push(i, i);
    }

    const shuffledArray = shuffle(arrayCards);

    createCardsPage(shuffledArray);
  }

  function createTimer() {
    const sectionCards = document.querySelector('.cards');
    const timerWrap = document.createElement('div');
    const displayTimer = document.createElement('div');
    const btnTimer = document.createElement('button');

    let time = 59;

    timerWrap.classList.add('timer-wrap');
    displayTimer.classList.add('timer-display');
    btnTimer.classList.add('button', 'timer-btn');

    displayTimer.textContent = '01:00';
    btnTimer.textContent = 'Запустить таймер';

    function count() {
      let seconds = time % 60;

      if (time <= 0) {
        clearInterval(intervalID);

        displayTimer.textContent = '00:00';
        btnTimer.textContent = 'Игра окончена';

        restartGame();
      } else if (time > 9) {
        displayTimer.textContent = `00:${Math.trunc(seconds)}`;
      } else {
        displayTimer.textContent = `00:0${Math.trunc(seconds)}`;
      }

      --time;
    }

    function startTimer() {
      clearInterval(intervalID);

      intervalID = setInterval(count, 1000);

      btnTimer.removeEventListener('click', startTimer);
      btnTimer.disabled = true;
    }

    btnTimer.addEventListener('click', startTimer);

    timerWrap.append(displayTimer, btnTimer);
    sectionCards.append(timerWrap);
  }

  function playGame() {
    const cards = document.querySelectorAll('.card');

    let firstCard = null;
    let secondCard = null;
    let countCards = 0;

    for (const card of cards) {
      card.addEventListener('click', openCards);
    }

    function openCards() {
      if (this === firstCard || this === secondCard) return;

      if (!firstCard) {
        firstCard = this;
      } else if (!secondCard) {
        secondCard = this;

        checkCards();
      } else {
        firstCard.classList.remove('open');
        secondCard.classList.remove('open');

        firstCard = this;
        secondCard = null;
      }

      this.classList.add('open');
    }

    function checkCards() {
      if (firstCard.textContent === secondCard.textContent) {
        firstCard.classList.add('match');
        secondCard.classList.add('match');

        firstCard.removeEventListener('click', openCards);
        secondCard.removeEventListener('click', openCards);

        ++countCards;
        ++countCards;
      }

      if (countCards === cards.length) restartGame();
    }
  }

  function restartGame() {
    const btnRestart = document.createElement('button');
    const btnSelectLevel = document.createElement('button');
    const sectionCards = document.querySelector('.cards');
    const btnTimer = document.querySelector('.timer-btn');
    const cards = document.querySelectorAll('.card');

    btnRestart.classList.add('button', 'restart-btn');
    btnSelectLevel.classList.add('button');

    btnRestart.textContent = 'Играть ещё раз';
    btnSelectLevel.textContent = 'Выбрать новый уровень';
    btnTimer.disabled = true;

    for (const card of cards) {
      card.classList.add('card-timer-over');
    }

    clearInterval(intervalID);

    sectionCards.append(btnRestart, btnSelectLevel);

    btnRestart.addEventListener('click', () => {
      sectionCards.innerHTML = '';

      createTimer();
      getCardsArray(restartNumber);
      playGame();
    });

    btnSelectLevel.addEventListener('click', () => {
      location.reload();
    });
  }

  function startGame() {
    const sectionSetting = document.querySelector('.setting');
    const settingsPage = createSettingsPage();

    function checkValidNumber(number) {
      if (number > 1 && number < 11 && !(number % 2)) {
        number = number * number / 2;

        return number;
      } else {
        settingsPage.input.value = '4';
      }
    }

    settingsPage.form.addEventListener('submit', e => {
      e.preventDefault();

      if (!settingsPage.input.value) return;

      const numberCards = checkValidNumber(settingsPage.input.value);

      if (numberCards) {
        sectionSetting.style.display = 'none';

        createTimer();
        getCardsArray(numberCards);
        playGame();

        restartNumber = numberCards;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    startGame();
  });
})();
