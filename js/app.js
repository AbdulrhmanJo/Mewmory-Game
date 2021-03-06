(function() {
  //------------DATA MODEL-----------
  var data = {
    moves: 0,
    cards: [],

    addcard: function(card) {
      this.cards.push(card);
    },

    getAllcards: function() {
      return this.cards;
    },

    setMoves: function(moves) {
      this.moves = moves;
    },

    init: function() {
      this.setMoves(0);
      this.cards = [];
    }
  };

  //------------controller MODEL-----------
  var controller = {
    checkBox: [],
    firstClick: true,
    matches: 0,
    timer: 0,

    createCards: function() {
      let counter = 0;
      while (counter < 2) {
        for (let i = 1; i <= 8; i++) {
          const cardContainer = document.createElement("div");
          cardContainer.classList.add("card__container");
          cardContainer.innerHTML = `<div class="card__face card__face--front"></div><div class="card__face card__face--back"><img src="img/${i}-cat.png" alt="cat"></div>`;
          // 2- add cards to card array
          data.addcard(cardContainer);
        }
        counter++;
      }
    },

    getCards: function() {
      return data.cards;
    },

    shuffleCards: function(cards) {
      let currentIndex = cards.length,
        tempValue,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        tempValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = tempValue;
      }
    },

    openCard: function(event) {
      const element = event.target;
      if (
        element.classList[0] === "card__face" &&
        this.checkBox.length < 2 &&
        !element.parentElement.classList.contains("open") &&
        !this.checkBox.includes(element)
      ) {
        this.checkBox.push(element.nextSibling);
        interface.showCard(element);

        if (this.firstClick) {
          this.setUpTimer();
          this.firstClick = false;
        }

        if (this.checkBox.length === 2) {
          this.checkCard();
        }

        if (this.matches === 8) {
          this.stopeTimer(this.timer);
          interface.popupMsg();
        }
      }
    },

    checkCard: function() {
      const firstCard = this.checkBox[0].firstChild;
      const secondCard = this.checkBox[1].firstChild;

      if (firstCard.getAttribute("src") === secondCard.getAttribute("src")) {
        interface.match(this.checkBox);
        this.matches++;
      } else {
        interface.closeCard(this.checkBox);
      }
      this.checkBox = [];
      interface.updateMoves(this.incrementMoves());
    },

    incrementMoves: function() {
      return ++data.moves;
    },

    setUpTimer: function() {
      sec = 0;
      min = 0;

      const counter = function() {
        if (++sec === 60) {
          sec = 0;
          if (++min === 60) {
            min = 0;
          }
        }

        time =
          (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);

        interface.updateTime(time);
      };

      this.timer = setInterval(counter, 1000);
    },

    setUpEventListener: function() {
      document
        .querySelector(".container")
        .addEventListener("click", this.openCard.bind(this));

      document
        .querySelector(".score__reset")
        .addEventListener("click", this.resetGame.bind(this));

      document
        .querySelector(".popup__btn")
        .addEventListener("click", this.playAgain.bind(this));
    },

    stopeTimer: function(timer) {
      clearInterval(timer);
    },

    resetGame: function() {
      data.setMoves(0);
      this.checkBox = [];
      this.firstClick = true;
      this.matches = 0;
      interface.resetScore();
      clearTimeout(this.timer);
      this.shuffleCards(data.getAllcards());
      interface.updateCard();
    },

    playerRate: function() {
      const moves = data.moves;

      if (moves <= 16) {
        return 5;
      } else if (moves >= 17 && moves <= 21) {
        return 4;
      } else if (moves >= 22 && moves <= 26) {
        return 3;
      } else if (moves >= 27 && moves <= 30) {
        return 2;
      } else {
        return 1;
      }
    },

    playAgain: function() {
      this.resetGame();
      interface.closeMsg();
    },

    init: function() {
      //clear the store
      data.init();
      //create cards
      this.createCards();
      //shuffle the cards
      this.shuffleCards(data.getAllcards());
      //add the interface to the page
      interface.init();
      //add All the Event Listener in the game
      this.setUpEventListener();
    }
  };

  //------------interface MODEL-----------

  var interface = {
    resetScore: function() {
      const timeEl = document.querySelector(".time");
      timeEl.textContent = "00:00";

      const movesEl = document.querySelector(".moves");
      movesEl.textContent = "0";
    },

    showCard: function(card) {
      card.parentElement.classList.add("open");
    },

    closeCard: function(openCards) {
      openCards.forEach(card => {
        setTimeout(() => {
          card.parentElement.classList.add("animated", "flash");
        }, 600);

        setTimeout(() => {
          card.parentElement.classList.remove("open");
          card.parentElement.classList.remove("flash");
        }, 1700);
      });
    },

    updateTime: function(time) {
      const timeEl = document.querySelector(".time");
      timeEl.textContent = time;
    },

    updateMoves: function(moves) {
      const movesEl = document.querySelector(".moves");
      movesEl.textContent = moves;
    },

    match: function(cards) {
      cards.forEach(card => {
        setTimeout(() => {
          card.parentElement.classList.add("animated", "tada");
          card.style.backgroundColor = "pink";
        }, 800);

        setTimeout(() => {
          card.style.opacity = ".3";
        }, 1200);
      });
    },

    updateCard: function() {
      const container = document.querySelector(".container");
      const cards = controller.getCards();
      cards.forEach(card => {
        card.classList.remove("open");
        card.classList.remove("tada");

        card.children[1].style.backgroundColor = "white";
        card.children[1].style.opacity = "1";
        card.children[1].style.display = "flex";
        container.appendChild(card);
      });
    },

    addRating: function() {
      const stars = document.querySelectorAll(".popup__rating--star");

      const playerRate = controller.playerRate();

      for (let i = 0; i < playerRate; i++) {
        stars[i].classList.add("checked");
      }
    },

    popupMsg: function() {
      this.addRating();

      setTimeout(() => {
        const wrabber = document.querySelector(".popup-wrapper");
        wrabber.style.display = "block";
      }, 1800);

      setTimeout(() => {
        const popup = document.querySelector(".popup");
        popup.classList.add("animated", "tada");
        popup.style.display = "grid";
      }, 1850);
    },

    closeMsg: function() {
      const wrabber = document.querySelector(".popup-wrapper");
      wrabber.style.display = "none";

      const popup = document.querySelector(".popup");
      popup.classList.remove("animated", "tada");
      popup.style.display = "none";
    },

    init: function() {
      const container = document.querySelector(".container");
      const cards = controller.getCards();
      cards.forEach(card => {
        container.appendChild(card);
      });

      this.resetScore();
    }
  };

  controller.init();
})();
