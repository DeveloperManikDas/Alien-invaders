const grid = document.querySelector(".board");
const result = document.querySelector("#result");
const score = document.querySelector("#score");
const width = 15;
let currentShooterPosition = 202;
let point = 0 ;
let isGoingRight = true;
let automoveTimer;
let direction = 1;
createBoard();

const cells = Array.from(document.querySelectorAll(".board div"));
let invedersArray = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];
const eliminatedInvedersArray = [];

drawInveders();
drawShooter();
moveShooter();
// handleShoot();
// also checks collision
automoveTimer = setInterval(automoveInveders, 1000);

//  creating cells
function createBoard() {
  for (let i = 0; i < 225; i++) {
    const cell = document.createElement("div");
    if (i > 210) {
      cell.classList.add("deadline");
    }
    grid.appendChild(cell);
  }
}
//  create Inveders
function drawInveders() {
  invedersArray.forEach((inveder, index) => {
    if (!eliminatedInvedersArray.includes(index)) {
      cells[inveder].classList.add("inveder");
    }
  });
}

//  remove Inveders
function removeInveders() {
  invedersArray.forEach((inveder) => {
    cells[inveder].classList.remove("inveder");
  });
}

// creating shooter
function drawShooter() {
  cells[currentShooterPosition].classList.add("shooter");
}
// removing shooter
function removShooter() {
  cells[currentShooterPosition].classList.remove("shooter");
}

// adding eventListener to the whole document
function moveShooter() {
  document.addEventListener("keydown", handleKeyPress);
}

// move shooter
function handleKeyPress(event) {
  if (
    event.key === "ArrowRight" &&
    currentShooterPosition % width !== width - 1
  ) {
    removShooter();
    currentShooterPosition += 1;
    drawShooter();
  } else if (
    event.key === "ArrowLeft" &&
    !(currentShooterPosition % width === 0)
  ) {
    removShooter();
    currentShooterPosition -= 1;
    drawShooter();
  }
}

//  automove Inveders
function automoveInveders() {
  checkCollision();
  let rightEdge = invedersArray[invedersArray.length - 1];
  let leftEdge = invedersArray[0] % 15;
  removeInveders();
  if (rightEdge % width === 14 && isGoingRight) {
    invedersArray = invedersArray.map((inveder) => inveder + (width + 1));
    isGoingRight = false;
    direction = -1;
  } else if (leftEdge === 0 && !isGoingRight) {
    invedersArray = invedersArray.map((inveder) => inveder + width - 1);
    isGoingRight = true;
    direction = 1;
  }
  invedersArray = invedersArray.map((inveder) => inveder + direction);
  drawInveders();
  if(invedersArray.length === eliminatedInvedersArray.length){
    result.innerHTML = "You won the match."
    clearInterval(automoveTimer);
    document.removeEventListener("keydown", shoot)
  }
}

//  check for collision
function checkCollision() {
  if (cells[currentShooterPosition].classList.contains("inveder")) {
    result.innerHTML = "You Fucked Up  !!!   Game Over!";
    clearInterval(automoveTimer);
  }
  const deadline = Array.from(document.querySelectorAll(".deadline"));

  deadline.forEach((dead) => {
    if (dead.classList.contains("inveder")) {
      result.innerHTML = "You Fucked Up  !!!   Game Over!";
      clearInterval(automoveTimer);
    }
  });
}

// shooting the inveders
function shoot(e) {
  let laserId;
  let currentLaserPosition = currentShooterPosition;

  function moveLaser() {
    if (currentLaserPosition >= 0) {
      cells[currentLaserPosition].classList.remove("laser");
      currentLaserPosition = currentLaserPosition - width;
      cells[currentLaserPosition].classList.add("laser");

      if (cells[currentLaserPosition].classList.contains("inveder")) {
        cells[currentLaserPosition].classList.remove("inveder");
        cells[currentLaserPosition].classList.remove("laser");
        cells[currentLaserPosition].classList.add("boom");
        point ++;
        score.innerHTML = point;  
        setTimeout(() => {
          cells[currentLaserPosition].classList.remove("boom");
        }, 200);
        clearInterval(laserId);
        const eliminatedInveder = invedersArray.indexOf(currentLaserPosition);
        eliminatedInvedersArray.push(eliminatedInveder);
      }
    }
  }

  switch (e.key) {
    case " ":
      laserId = setInterval(moveLaser, 100);
      break;
  }
}

document.addEventListener("keydown", shoot);
