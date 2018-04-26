//////////////// GLOBALS VARIABLES ////////////////
var CHANGE_COLOR_CARD_VALUE = 'Change Color';
var HUMAN = 'humanCards';
var PLUS_CARD = "+"
var RESTART_GAME_DIV_ID = "resetGame"
var DECK_OF_CARDS = 'deck';
var COMPUTER = 'computerCards';
var MIDDEL = 'middle';
var END_GAME_DIV_ID = "endGameMsg";
var COLOR_CHOICE_MESSAGE_ID = 'msg';
var CHANGEBUTTOM = 'fleft';
var WHITE_COLOR = 'white';
var HEAP_ELEMENT_ID = 'left1';
var TAKI_CARD_VALUE = 'Taki'
var STOP_CARD_VALUE = 'Stop'
var CARDS_VALUE = ['1', '3', '4', '5', '6', '7', '8', '9', STOP_CARD_VALUE, TAKI_CARD_VALUE, PLUS_CARD, CHANGE_COLOR_CARD_VALUE];
var CARDS_COLOR = ['green', 'yellow', 'red', 'blue'];
var INIT_NUM_CARDS = 8;
var VISIBLE = 'visible'
var HIDDEN = 'hidden';
var isFirst = true;
var HUMAN_TURN = 'humanTurn';
var COMPUTER_TURN = 'computerTurn';
var CLOSE_TAKI_BUTTON_ID = 'closetaki';
var deckDisabled = false;
var blockPlayer = false
var takiIsOpen = false;
var HUMAN_SCORE = 'humanScore';
var YOU_WIN = 'You won';
var COMPUTER_WIN = 'You lost (Computer won)';
var CON = 'con';
var COMPUTER_SCORE = 'computerScore';
var COMPUTER_DELAY_IN_MS = 1000;
var YOUR_TURN = false

//////////////// GLOBALS FUNCTIONS ////////////////

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}
//////////////////// HEAP CLASS ///////////////////

function Heap() {
    this.cards = []
}

Heap.prototype.putOnTop = function(card) {
    this.cards.push(card);
}
Heap.prototype.putManyOnTop = function(cards) {
    for (let i = 0; i < this.cards.length; i++) {
        this.putOnTop(cards[i]);
    }
}
Heap.prototype.top = function() {
    return this.cards[this.cards.length - 1];
}
Heap.prototype.changeTopColor = function(color) {
    console.log("the color that computer chosse" + color)
    this.top().color = color;
}

//////////////////// CARD CLASS ///////////////////

function Card(id, color, value) {
    this.id = id;
    this.color = color;
    this.value = value;

}

//////////////////// PLAYER CLASS ///////////////////

function Player() {
    this.cards = [];
}

Player.prototype.addCard = function(card) {
    this.cards.push(card);
}

Player.prototype.removeCard = function(id) {
    for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].id == id) {
            return this.cards.splice(i, 1)[0];
        }
    }
    return null
}

Player.prototype.getCard = function(id) {
    for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].id == id) {
            return this.cards[i]
        }
    }
    return null
}

Player.prototype.getCardId = function(predicate) {
    for (let i = 0; i < this.cards.length; i++) {
        if (predicate(this.cards[i])) {
            return this.cards[i].id
        }
    }
    return -1
}

Player.prototype.removeCardWithColor = function(color) {
    for (let i = 0; i < this.cards.length; i++) {
        if (color == this.cards[i].color) {
            return this.removeCard(this.cards[i].id)
        }
    }
    return null
}

Player.prototype.removeAllCards = function(color) {
    let removedCards = []
    let card = this.removeCardWithColor(color)
    while (card != null) {
        removedCards.push(card)
        card = this.removeCardWithColor(color)
    }
    return removedCards
}

//////////////////// DECK CLASS ///////////////////

function Deck() {
    this.cards = [];
    var id = "1";
    for (let i = 0; i < CARDS_VALUE.length - 1; i++) {
        for (let j = 0; j < CARDS_COLOR.length; j++) {
            var card1 = new Card((id++).toString(), CARDS_COLOR[j], CARDS_VALUE[i]);
            var card2 = new Card((id++).toString(), CARDS_COLOR[j], CARDS_VALUE[i]);
            this.cards.push(card1);
            this.cards.push(card2);
        }
    }
    for (let i = 0; i < 4; i++) {
        this.cards.push(new Card((id++).toString(), WHITE_COLOR, CHANGE_COLOR_CARD_VALUE));
    }
}

Deck.prototype.shuffle = function() {
    let i = 0;
    let j = 0;
    let temp = null;

    for (i = this.cards.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = temp;
    }
}
Deck.prototype.pop = function() {
    return this.cards.pop();
}

Deck.prototype.removeFirstNumber = function() {
    for (let i = 0; i < this.cards.length; i++) {
        if (!isNaN(this.cards[i].value)) {
            return this.cards.splice(i, 1)[0];
        }
    }
    console.error("removeFirstNumber: No card numbers in deck")
}

Deck.prototype.push = function(card) {
    this.deck.push(card);
}

/////////////////////////STOP WATCH/////////////////////////



//////////////////// TAKI ENGINE CLASS ///////////////////
function TakiEngine() {
    this.heap = new Heap()
    this.deck = new Deck()
    this.human = new Player()
    this.computer = new Player()

}

TakiEngine.prototype.oneCardFromDeckToHeap = function() {
    let card = this.deck.removeFirstNumber();
    this.heap.putOnTop(card);
}

TakiEngine.prototype.canPlayWith = function(card) {
    let heapTopCard = this.heap.top();

    if (takiIsOpen) {
        return heapTopCard.color == card.color
    }

    if (card.value == CHANGE_COLOR_CARD_VALUE) {
        return true;
    }
    if (heapTopCard.color == card.color) {
        return true;
    }
    if (heapTopCard.value == card.value) {
        return true;
    }
    return false;
}

TakiEngine.prototype.dealCards = function() {
    for (let i = 0; i < INIT_NUM_CARDS; i++) {
        this.human.addCard(this.deck.pop());
        this.computer.addCard(this.deck.pop());
    }

}

////////////////////// STATISTICS ////////////////////
var AMOUNT_OF_TURN_OF_HUMAN_PLAYER = 0;
var TOTAL_SECONDS_OF_TURN_OF_HUMAN_PLAYER = 0;
var AMOUNT_OF_SECONDS_OF_TURN = 0;
var TOATL_TURNS_OF_THE_GAME = 0;
var TIME_OF_GAME = 0;
var SINGAL_CARD = 0;
var GAME_DURATION_IN_SEC = 0
var STATS_TOTAL_TURN_VALUE = 'statsTotalTurnsValue';
var STATS_GAME_DURATION_VALUE = 'statsGameDurationValue'
var STATS_AVERAGE_GAME_PLAY_VALUE = 'statsAverageGamePlayValue'
var STATS_TIMES_WITH_SINGLE_VALUE = 'statsTimesWithSingleValue';
var gameDurationInterval = null

function guiUpdateGameDuration() {
    GAME_DURATION_IN_SEC++
    document.getElementById(STATS_GAME_DURATION_VALUE).innerHTML = GAME_DURATION_IN_SEC
}

function guiUpdateAverageTimeForHumanTurn() {
    let elem = document.getElementById(STATS_AVERAGE_GAME_PLAY_VALUE)
    TOTAL_SECONDS_OF_TURN_OF_HUMAN_PLAYER += GAME_DURATION_IN_SEC - AMOUNT_OF_SECONDS_OF_TURN
    let res = TOTAL_SECONDS_OF_TURN_OF_HUMAN_PLAYER / (AMOUNT_OF_TURN_OF_HUMAN_PLAYER + 1)
    elem.innerHTML = parseFloat(Math.round(res * 100) / 100).toFixed(2);
}

function guiUpdateStatistics(id) {
    if (id == STATS_TOTAL_TURN_VALUE) {
        TOATL_TURNS_OF_THE_GAME++
    } else if (id == STATS_TIMES_WITH_SINGLE_VALUE) {
        SINGAL_CARD++
    }

    guiRefreshStatistics()
}

function guiRefreshStatistics() {
    document.getElementById(STATS_TOTAL_TURN_VALUE).innerHTML = TOATL_TURNS_OF_THE_GAME
    document.getElementById(STATS_TIMES_WITH_SINGLE_VALUE).innerHTML = SINGAL_CARD
    document.getElementById(STATS_GAME_DURATION_VALUE).innerHTML = GAME_DURATION_IN_SEC
}

//////////////////// GUI FUNCTIONS ///////////////////

function guiInitPlayerCards() {
    document.getElementById(HUMAN).innerHTML = ""
    document.getElementById(COMPUTER).innerHTML = ""

    for (let i = 0; i < INIT_NUM_CARDS; i++) {
        guiAddCard(HUMAN, engine.human.cards[i]);
        guiAddCard(COMPUTER, engine.computer.cards[i]);
    }
}

function guiRemoveCard(humanOrComputer, id) {
    document.getElementById(humanOrComputer).removeChild(document.getElementById(id));
    displayAmountOfCards()
    checkEndOfGame()
    if (humanOrComputer == HUMAN) {
        checkSingleCard()
    }
}

function checkSingleCard(humanOrComputer) {
    if (engine.human.cards.length == 1) {
        guiUpdateStatistics(STATS_TIMES_WITH_SINGLE_VALUE)
    }
}

function guiRemoveCards(humanOrComputer, cards) {
    for (let i = 0; i < cards.length; i++) {
        guiRemoveCard(humanOrComputer, cards[i].id);
    }
}

function guiAddCard(id, card) {
    console.log(card.value);

    if (id == HUMAN) {
        let btn = document.createElement("button");
        btn.setAttribute("id", card.id);
        btn.setAttribute("class", "card");
        btn.style.margin = "2px";
        btn.addEventListener('click', function() {
            let temp = btn.getAttribute("id");
            userClickOnCard(temp);
        });
        btn.innerHTML = card.value;
        btn.style.backgroundColor = card.color;
        document.getElementById(id).appendChild(btn);
    } else { // COMPUTER
        let img = document.createElement("img");
        img.setAttribute("id", card.id);

        img.style.margin = "2px";
        img.setAttribute("class", "card");
        img.setAttribute("src", "img/blank_card.png");
        document.getElementById(id).appendChild(img);
    }
    displayAmountOfCards();
}

function checkEndOfGame() {
    let resHuman = engine.human.cards.length;
    let resComputer = engine.computer.cards.length;
    if (resHuman == 0) {
        dispayWinner(YOU_WIN);
    } else if (resComputer == 0) {
        dispayWinner(COMPUTER_WIN);
    }
}

function displayAmountOfCards() {
    let resHuman = engine.human.cards.length;
    let resComputer = engine.computer.cards.length;

    document.getElementById(COMPUTER_SCORE).innerHTML = ""
    document.getElementById(COMPUTER_SCORE).innerHTML = 'Computer Player (' + resComputer + ')';
    document.getElementById(HUMAN_SCORE).innerHTML = "";
    document.getElementById(HUMAN_SCORE).innerHTML = 'Me (' + resHuman + ')';
}

function dispayWinner(msg) {
    clearInterval(gameDurationInterval)
    document.getElementById(CON).style.display = "none";
    var endmsg = document.getElementById(END_GAME_DIV_ID);
    document.getElementById(RESTART_GAME_DIV_ID).style.display = "block"
    endmsg.style.display = "block";
    endmsg.setAttribute("class", "gameOver");
    endmsg.innerHTML = msg;
}

function resetAllVariables() {
    AMOUNT_OF_TURN_OF_HUMAN_PLAYER = 0;
    TOTAL_SECONDS_OF_TURN_OF_HUMAN_PLAYER = 0;
    AMOUNT_OF_SECONDS_OF_TURN = 0;
    TOATL_TURNS_OF_THE_GAME = 0;
    TIME_OF_GAME = 0;
    SINGAL_CARD = 0;
    GAME_DURATION_IN_SEC = 0;
    engine = new TakiEngine();
    gameDurationInterval = setInterval(guiUpdateGameDuration, 1000);
}


function computerPlayLogic() {
    let id = engine.computer.getCardId(function(c) {
        return c.value == CHANGE_COLOR_CARD_VALUE;
    });
    if (id != -1) {
        let card = engine.computer.removeCard(id);
        engine.heap.putOnTop(card)
        guiRemoveCard(COMPUTER, id);
        let color = randomChoiceOfColor();

        changeColorHeapTopCard(color);
        return;
    }

    let heapColor = engine.heap.top().color
    id = engine.computer.getCardId(function(c) {
        return c == STOP_CARD_VALUE && c.color == heapColor
    });
    if (id != -1) {
        let card = engine.computer.removeCard(id);
        engine.heap.putOnTop(card)
        guiRemoveCard(COMPUTER, id);
        guiRefreshHeap();
        guiUpdateStatistics(STATS_TOTAL_TURN_VALUE);
        computerPlayLogicWithDelay();
        return;
    }

    id = engine.computer.getCardId(function(c) {
        return c == PLUS_CARD && c.color == heapColor;
    });
    if (id != -1) {
        let card = engine.computer.removeCard(id);
        engine.heap.putOnTop(card);
        guiRemoveCard(COMPUTER, id);
        guiRefreshHeap();
        computerPlayLogicWithDelay();
        return;

    }
    id = engine.computer.getCardId(function(c) {
        return c == TAKI_CARD_VALUE && c.color == heapColor
    });
    if (id != -1) {
        let card = engine.computer.removeCard(id);
        engine.heap.putOnTop(card);
        guiRefreshHeap();
        let cards = engine.computer.removeAllCards(heapColor);
        engine.heap.putManyOnTop(cards);
        guiRemoveCards(COMPUTER, cards);
        guiRefreshHeap();
        if (engine.top().value == STOP_CARD_VALUE) {
            guiUpdateStatistics(STATS_TOTAL_TURN_VALUE);
            computerPlayLogicWithDelay();
        }

        return;
    }
    id = engine.computer.getCardId(function(c) {
        return c.color == heapColor
    });
    if (id != -1) {
        let card = engine.computer.removeCard(id);
        engine.heap.putOnTop(card);
        guiRemoveCard(COMPUTER, id);
        guiRefreshHeap();

        return;
    }
    let heapValue = engine.heap.top().value;
    id = engine.computer.getCardId(function(c) {
        return c.value == heapValue;
    });
    if (id != -1) {
        let card = engine.computer.removeCard(id);
        engine.heap.putOnTop(card);
        guiRemoveCard(COMPUTER, id);
        guiRefreshHeap();
        return;
    }
    takeCardFromDeck(COMPUTER)
}

function computerPlayLogicWithDelay() {
    setTimeout(computerPlayLogic, COMPUTER_DELAY_IN_MS);
}

function afterComputerPlay() {
    guiUpdateStatistics(STATS_TOTAL_TURN_VALUE);

    YOUR_TURN = true
    guiRefreshYourTurn();
    updateStartTimeHumanTurn();
}

function computerPlay() {
    YOUR_TURN = false;
    guiRefreshYourTurn();

    guiUpdateAverageTimeForHumanTurn();

    setTimeout(function() {
        computerPlayLogic()
        afterComputerPlay()
    }, COMPUTER_DELAY_IN_MS);
}

function updateStartTimeHumanTurn() {
    AMOUNT_OF_TURN_OF_HUMAN_PLAYER++;
    AMOUNT_OF_SECONDS_OF_TURN = GAME_DURATION_IN_SEC;
}

function guiRefreshYourTurn() {
    if (YOUR_TURN) {
        document.getElementById(HUMAN_TURN).style.display = 'inline';
        document.getElementById(COMPUTER_TURN).style.display = 'none';
    } else {
        document.getElementById(HUMAN_TURN).style.display = 'none';
        document.getElementById(COMPUTER_TURN).style.display = 'inline';
    }
}

function randomChoiceOfColor() {
    let x = Math.floor((Math.random() * 4));
    return CARDS_COLOR[x];
}

function userClickOnCloseTaki() {
    deckDisabled = false
    takiIsOpen = false;
    show(CLOSE_TAKI_BUTTON_ID, false)
    let heapTopCard = engine.heap.top();
    if (heapTopCard.value == STOP_CARD_VALUE) {
        guiUpdateStatistics(STATS_TOTAL_TURN_VALUE);
    } else if (heapTopCard.value == PLUS_CARD) {
        // nothing to do here...
    } else {
        guiUpdateStatistics(STATS_TOTAL_TURN_VALUE);
        computerPlay();
    }
}

function userClickOnCard(id) {
    if (!YOUR_TURN)
        return;

    let card = engine.human.getCard(id);
    if (!engine.canPlayWith(card)) {
        alert("Illegal move");
        return
    }

    engine.heap.putOnTop(card);
    guiRefreshHeap();
    engine.human.removeCard(id);
    guiRemoveCard(HUMAN, id);

    if (card.value == CHANGE_COLOR_CARD_VALUE) {
        createChangeColorTable();
        deckDisabled = true;
    } else if (card.value == TAKI_CARD_VALUE) {
        takiIsOpen = true;
        deckDisabled = true;
        show(CLOSE_TAKI_BUTTON_ID, true);
    } else if (card.value != STOP_CARD_VALUE && !takiIsOpen && card.value != PLUS_CARD) {
        // regular card
        guiUpdateStatistics(STATS_TOTAL_TURN_VALUE);
        computerPlay();
    } else if (card.value == STOP_CARD_VALUE && !takiIsOpen) {
        guiUpdateStatistics(STATS_TOTAL_TURN_VALUE);
    } else if (card.value == PLUS_CARD && !takiIsOpen) {
        // nothing to do here...
    }
}

function takeCardFromDeck(humanOurComputer) {
    let card = engine.deck.pop();
    if (humanOurComputer == HUMAN) {
        engine.human.addCard(card);
    } else {
        engine.computer.addCard(card);
    }

    guiAddCard(humanOurComputer, card);
    checkIfDeckIsEmpty()
}

function userClickOnDeck() {
    if (deckDisabled || !YOUR_TURN)
        return;

    guiUpdateStatistics(STATS_TOTAL_TURN_VALUE);
    takeCardFromDeck(HUMAN);
    computerPlay();
}

function userQuit() {
    dispayWinner(COMPUTER_WIN)
}

function setColorCellAttributes(elem, color) {
    elem.style.borderRadius = "15px";
    elem.style.backgroundColor = color;
    elem.addEventListener('click', function() {
        userColorChoice(color);
    });
}

function createChangeColorTable() {
    show(COLOR_CHOICE_MESSAGE_ID, true);
    let main = document.getElementById(HEAP_ELEMENT_ID);
    main.innerHTML = '<table id="changeColorTable"><tr><td id="red"></td><td id="blue"></td><tr><td id="yellow"></td><td id="green"></td></tr>';
    document.getElementById("changeColorTable").className = "card"
    for (let i = 0; i < CARDS_COLOR.length; i++) {
        let colorButton = document.getElementById(CARDS_COLOR[i])
        setColorCellAttributes(colorButton, CARDS_COLOR[i])
    }
}

function show(id, toShow) {
    let val = 'none'
    if (toShow)
        val = 'block'

    document.getElementById(id).style.display = val;
}

function changeColorHeapTopCard(color) {
    engine.heap.changeTopColor(color);
    guiRefreshHeap();
}

function userColorChoice(color) {
    changeColorHeapTopCard(color)
    deckDisabled = false
    show(COLOR_CHOICE_MESSAGE_ID, false)
    guiUpdateStatistics(STATS_TOTAL_TURN_VALUE);
    computerPlay();
}

function moveHeapToDeck() {
    let cards = engine.heap.cards.splice(0, engine.heap.cards.length - 1)
    for (let i = 0; cards.length; i++) {
        if (cards[i].value == CHANGE_COLOR_CARD_VALUE) {
            cards[i].color = WHITE_COLOR;
        }
        engine.deck.push(cards[i]);
    }
    engine.deck.shuffle();
}

function checkIfDeckIsEmpty() {
    if (engine.deck.cards.length == 0) {
        moveHeapToDeck();
        alert('Deck is empty, moving heap to deck and shuffling...')
    }
}

function guiRefreshHeap() {
    let heap = document.getElementById(HEAP_ELEMENT_ID);

    let card = engine.heap.top();
    heap.innerHTML = "";
    let btn = document.createElement("button");
    btn.setAttribute("class", "card");
    btn.setAttribute("id", "btn")
    btn.innerHTML = card.value;
    btn.style.backgroundColor = card.color;
    heap.appendChild(btn);

}

var engine = null

function initGame() {
    document.getElementById(RESTART_GAME_DIV_ID).style.display = "none";
    document.getElementById(CON).style.display = "block"
    document.getElementById(END_GAME_DIV_ID).style.display = "none";
    resetAllVariables()
    engine.deck.shuffle();
    engine.dealCards();
    show(COLOR_CHOICE_MESSAGE_ID, false);
    show(CLOSE_TAKI_BUTTON_ID, false);
    guiRefreshStatistics()
    guiInitPlayerCards();
    displayAmountOfCards();
    engine.oneCardFromDeckToHeap()
    guiRefreshHeap();
    YOUR_TURN = true

    guiRefreshYourTurn();
    guiUpdateAverageTimeForHumanTurn();
}

initGame();