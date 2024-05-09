
const gridContainer = document.querySelector(".grid-container");
const startButton = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerName");
const printName = document.getElementById("printName");
let playerName = "";


let cards = [];
let firstCard, secondCard;
let thirdCard, FourthCard;
let lockBoard = false;
let score = 0;
let level = 0; 

document.querySelector(".score").textContent = score;


playerNameInput.addEventListener("input", function() {
  if (playerNameInput.value.trim() !== "") {
    startButton.removeAttribute("disabled");
  } else {
    startButton.setAttribute("disabled", true);
  }
});

playerNameInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && playerNameInput.value.trim() !== "") {
    playerName = playerNameInput.value.trim();
    printName.textContent = playerName;
    playerNameInput.style.display = "none";
    printName.style.display = "inline";
    startButton.click();
  }
});


/* playerNameInput.addEventListener("input", function() {
  if (playerNameInput.value.trim() !== "") {
    startButton.removeAttribute("disabled");
    playerName = playerNameInput.value;
    printName.textContent = playerName;
    playerNameInput.style.display = "none";
    printName.style.display = "inline";
    // playerName = playerNameInput.value.trim(); // The trim() function removes whitespace from both ends of a string. 
   } else {
      startButton.setAttribute("disabled", true);
      playerName = "";
      printName.textContent = "";
      playerNameInput.style.display = "inline";
      printName.style.display = "none"; 
       }
  });
        
startButton.addEventListener("click", function() {
    if (playerName === "") {
      alert("Please enter your name to start the game.");
      return;
      } else {
      startGame();
      }
    }); */



startButton.addEventListener("click", function() {
  if (playerNameInput.value.trim() === "") {
    alert("Please enter your name to start the game.");
    return;
  } else {
    playerName = playerNameInput.value.trim();
    printName.textContent = playerName;
    playerNameInput.style.display = "none";
    printName.style.display = "inline";
    startGame();
  }
});

function startGame() {
// this is the hardest part I had to learn all JSON just for this :(
fetch("./data/cards.json")  // Fetch data from the "cards.json" file (this sends request to connect to the server)
  
.then((res) => res.json()) // Parse the JSON response in this part it takes the response and convert it into json format 


.then((data) => { // Handle the parsed JSON data it is an arrow function 
    cards = [...data, ...data]; // Duplicate the data to create pairs of cards
    shuffleCards(); // Shuffle the cards
    generateCards(); // Generate the HTML for the cards
  });
}
            // I can have three pais by adding cards = [...data, ...data, ...data];
            //  .then() method chained to the previous one. 
            // It waits for the previous Promise (the JSON parsing) to resolve, 
            // and then takes the parsed JSON data and continues with the specified actions.
            

function shuffleCards() {
  let currentIndex = cards.length; // I am using let becasue the value will chnage 
  let randomIndex;
  let temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // iretate by -1 starting from higher number 
    temporaryValue = cards[currentIndex];  // save the value of the card at the current index 
    cards[currentIndex] = cards[randomIndex]; // change the value of the card to a random index 
    cards[randomIndex] = temporaryValue; // the random index of the card is now the new value of the card 
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}


function checkForMatch() {
  let isMatch = (firstCard.dataset.name === secondCard.dataset.name);

  isMatch ? disableCards() : unflipCards();
}


function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}


function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}


function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}


function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}


/*
function back() {
  window.history.back();
} */

/*
document.querySelector(".level").textContent = level;
fetch("./data/cards.json")
.then((res) => res.json()) 
.then((data) => {
  cards = [...data, ...data, ...data];
  shuffleCards();
  generateCards();

}); 


document.getElementById("level").style.display="block"

*/