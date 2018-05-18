//Array holding the icons used in the cards
const iconsArr = ["diamond", "diamond", "paper-plane-o", "paper-plane-o", "anchor", "anchor", "bolt", "bolt",
                    "cube", "cube", "leaf", "leaf", "bicycle", "bicycle", "bomb", "bomb"];
const deck = document.querySelector(".deck");
const movesHolder = document.querySelector(".moves");
const timerHolder = document.querySelector(".timer");

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", initGame);

var timerStarted;
var timerID;
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
    generateCards(iconsArr.length);

    min = 0;
    sec = 0;

    timerStarted = false;
    movesNum = 0;
    movesHolder.textContent = movesNum;
    timerHolder.textContent = "00:00";
    if(timerID) clearInterval(timerID);
    deck.addEventListener("click", onCardClick);
};


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
};

function onCardClick(event){
    if(!timerStarted){
        timerStarted = true;
        timerID = setInterval(setTime, 1000);
    }
    if(event.target.nodeName === "LI" && event.target.className == "card"){
        movesNum++;
        movesHolder.textContent = movesNum;

        switch (true){
            case movesNum == 5:
            case movesNum == 10:
                let stars = document.querySelectorAll(".fa-star");
                stars[stars.length - 1].classList.remove("fa-star");
                stars[stars.length - 1].classList.add("fa-star-o");
                break;
        }

        event.target.classList.add("open");
        event.target.classList.add("show");

        let openedCards = document.querySelectorAll(".open");
        if(openedCards.length == 2){

            if(openedCards[0].querySelector(".fa").className == openedCards[1].querySelector(".fa").className){
                openedCards[0].classList.remove("open");
                openedCards[0].classList.remove("show");
                openedCards[0].classList.add("match");

                openedCards[1].classList.remove("open");
                openedCards[1].classList.remove("show");
                openedCards[1].classList.add("match");

                if(document.querySelectorAll(".match").length == iconsArr.length){
                    //show win screen
                    clearInterval(timerID);
                    deck.removeEventListener("click", onCardClick);
                    console.log("win");
                }
            }
            else{
                deck.removeEventListener("click", onCardClick);
                setTimeout(function () {
                    let openedCards = document.querySelectorAll(".open");
                    openedCards[0].classList.remove("open");
                    openedCards[0].classList.remove("show");

                    openedCards[1].classList.remove("open");
                    openedCards[1].classList.remove("show");

                    deck.addEventListener("click", onCardClick);
                },500);
            }
        }
    }
};

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
};


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
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

initGame();