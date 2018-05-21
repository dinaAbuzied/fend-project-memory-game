//Array holding the icons used in the cards
const iconsArr = ["diamond", "diamond", "paper-plane-o", "paper-plane-o", "anchor", "anchor", "bolt", "bolt",
                    "cube", "cube", "leaf", "leaf", "bicycle", "bicycle", "bomb", "bomb"];
const deck = document.querySelector(".deck");
const movesHolder = document.querySelector(".score-panel .moves");
const timerHolder = document.querySelector(".score-panel .timer");
const popup = document.getElementById('winPopup');

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", initGame);

const playAgainBtn = document.querySelector(".modal-footer button");
playAgainBtn.addEventListener("click", initGame);


//Object stores the fastest time the user won a game
var bestTime = {
    min: 0,
    sec: 0
}

//Boolean that is turned to true when the user first click a card to start the timer
var timerStarted;
var timerID; //stores the id given by setInterval function

var movesNum;

var min;
var sec;

/*
 * @description starts game by:
 *      - generating new cards set
 *      - resetting the timer
 *      - resetting the stars
 *      - resetting number of moves
 */
function initGame(){
    popup.style.display = "none";

    shuffle(iconsArr);
    generateCards(iconsArr.length);

    min = 0;
    sec = 0;

    let stars = document.querySelectorAll(".score-panel .fa-star-o");

    for(let i = 0; i < stars.length; i++){
        stars[i].classList.replace("fa-star-o", "fa-star");
    }

    timerStarted = false;
    movesNum = 0;
    movesHolder.textContent = movesNum;
    timerHolder.textContent = "00:00";
    if(timerID) clearInterval(timerID);
    deck.addEventListener("click", onCardClick);
}


/*
 * @description generates list of random cards and adds them to the deck
 * @param {number} cardNum - the number of cards to be generated
 */
function generateCards(cardNum){
    //shuffle(iconsArr);

    let fragment = document.createDocumentFragment();
    let card;

    for(let i = 0; i < cardNum; i++){
        card = document.createElement('li');
        card.innerHTML = '<i class="fa fa-'+ iconsArr[i] +'"></i>';
        card.classList.add("card");

        fragment.appendChild(card);
    }

    deck.innerHTML = "";
    deck.appendChild(fragment);
}

/*
 * @description is triggered when the user clicks on any card
 *      - starts the timer (if not started)
 *      - opens the card (by adding "open" & "show" classes)
 *      - add card animation
 *      - if there are two open cards checks if they are a match
 */
function onCardClick(event){
    if(!timerStarted){
        timerStarted = true;
        timerID = setInterval(setTime, 1000);
    }

    if(event.target.nodeName === "LI" && event.target.className == "card"){
        event.target.style.transform = "rotateY( 180deg )";
        event.target.classList.add("open", "show");

        let openedCards = document.querySelectorAll(".open");
        if(openedCards.length == 2){
            incrementMoves();
            openedCards[0].querySelector(".fa").className == openedCards[1].querySelector(".fa").className ? matchCards(openedCards) : closeCards();
        }
    }
}

function matchCards (openedCards) {
    openedCards[0].classList.remove("open", "show");
    openedCards[0].classList.add("match");

    openedCards[1].classList.remove("open", "show");
    openedCards[1].classList.add("match");

    if(document.querySelectorAll(".match").length == iconsArr.length){
        clearInterval(timerID);

        if((bestTime.min * 60) + bestTime.sec == 0 || (min * 60) + sec < (bestTime.min * 60) + bestTime.sec) {
            bestTime.min = min;
            bestTime.sec = sec;
        }

        deck.removeEventListener("click", onCardClick);
        showWinPopup();
    }
}

function closeCards() {
    deck.removeEventListener("click", onCardClick);
    setTimeout(function () {
        let openedCards = document.querySelectorAll(".open");
        openedCards[0].classList.remove("open", "show");
        openedCards[0].style.transform = "rotateY( 0deg )";
        openedCards[1].classList.remove("open", "show");
        openedCards[1].style.transform = "rotateY( 0deg )";

        deck.addEventListener("click", onCardClick);
    },500);
}

function setTime() {
    sec++;

    if(sec >= 60){
        min++;
        sec = 0;
    }

    let timeStr = "";

    min < 10 ? timeStr += "0" + min.toString() : timeStr += min.toString();
    timeStr += ":";
    sec < 10 ? timeStr += "0" + sec.toString() : timeStr += sec.toString();

    timerHolder.textContent = timeStr;
}

/*
 * @description
 *      - increses number of moves displayed on screen
 *      - check star rating
 */
function incrementMoves() {
    movesNum++;
    movesHolder.textContent = movesNum;

    switch (true){
        case movesNum == 8:
        case movesNum == 12:
            let stars = document.querySelectorAll(".score-panel .fa-star");
            stars[stars.length - 1].classList.replace("fa-star", "fa-star-o");
            break;
    }
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * @description displays the win popup including:
 *      - star rating
 *      - number of moves
 *      - current game time
 *      - best game time
 */
function showWinPopup() {
    document.querySelector(".modal-body .stars").innerHTML = document.querySelector(".score-panel .stars").innerHTML;

    document.querySelector(".modal-body .moves").textContent = movesNum;

    let timeStr = "";

    min < 10 ? timeStr += "0" + min.toString() : timeStr += min.toString();
    timeStr += ":";
    sec < 10 ? timeStr += "0" + sec.toString() : timeStr += sec.toString();
    document.querySelector(".modal-body .timer").textContent = timeStr;

    timeStr = "";
    bestTime.min < 10 ? timeStr += "0" + bestTime.min.toString() : timeStr += bestTime.min.toString();
    timeStr += ":";
    bestTime.sec < 10 ? timeStr += "0" + bestTime.sec.toString() : timeStr += bestTime.sec.toString();
    document.querySelector(".modal-body .best-time").textContent = timeStr;

    popup.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    let closeBtn = document.querySelector(".close-btn");

    if (event.target == popup || event.target == closeBtn) {
        popup.style.display = "none";
    }
}

initGame();