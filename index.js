var images = [
  "./images/001.png",
  "./images/002.png",
  "./images/003.png",
  "./images/004.png",
  "./images/005.png",
  "./images/006.png",
  "./images/007.png",
  "./images/008.png",
  "./images/009.png",
  "./images/010.png",
  "./images/011.png",
  "./images/012.png",
];
var pairs;
var pairsRemaining;
var pairsMatched = 0;
var clicks = 0;
var totalTime;
var timePassed = 0;
var incrementTimer;
var difficulty = "easy";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createGrid() {
  var selectedNumbers = [];

  switch (difficulty) {
    case "easy":
      pairs = 3;
      totalTime = 100;
      break;
    case "medium":
      pairs = 6;
      totalTime = 200;
      break;
    case "hard":
      pairs = 12;
      totalTime = 300;
      break;
    default:
      pairs = 3;
      totalTime = 100;
      break;
  }

  $("#game_grid").empty();
  $("#game_grid").css("display", "flex");

  for (let i = 0; i < pairs; i++) {
    var newSelect = Math.floor(Math.random() * images.length);
    while (selectedNumbers.includes(newSelect)) {
      newSelect = Math.floor(Math.random() * images.length);
    }
    selectedNumbers.push(newSelect);
    selectedNumbers.push(newSelect);
  }

  shuffleArray(selectedNumbers);

  for (let i = 0; i < selectedNumbers.length; i++) {
    $("#game_grid").append(
      '<div class="card">' +
        '<img id="img' +
        i +
        '" class="front_face" src="' +
        images[selectedNumbers[i]] +
        '" alt="">' +
        '<img class="back_face" src="back.webp" alt=""></div>'
    );
  }

  pairsRemaining = pairs;
}

function modeSelect() {
  if (difficulty === "easy") {
    $("#game_grid").css("width", "600px");
    $("#game_grid").css("height", "400px");
    $(".card").css("width", "33.3%");
  } else if (difficulty === "medium") {
    $("#game_grid").css("width", "800px");
    $("#game_grid").css("height", "600px");
    $(".card").css("width", "25%");
  } else if (difficulty === "hard") {
    $("#game_grid").css("width", "1200px");
    $("#game_grid").css("height", "800px");
    $(".card").css("width", "16.666%");
  }
}

function updateHeader() {
  $("#header").empty();
  $("#header").append(`<h1>Total number of pairs: ${pairs}</h1>
    <h1>Number of matches: ${pairsMatched}</h1>
    <h1>Number of pairs left: ${pairsRemaining}</h1>
    <h1>Number of clicks: ${clicks}</h1>
    <h1>You have ${totalTime} seconds. ${timePassed} seconds passed!</h1>`);
}

function start() {
  createGrid();
  modeSelect();
  updateHeader();
  incrementTimer = setInterval(timer, 1000);
}

function timer() {
  timePassed++;

  if (timePassed >= totalTime) {
    clearInterval(incrementTimer);
    alert("You lose!");
  }

  updateHeader();

  if (pairsMatched === pairs) {
    clearInterval(incrementTimer);
    alert("You win!");
  }
}

function reset() {
  location.reload();
}

function powerUp() {
  alert("Power Up!");
  $(".card").each(function (i, obj) {
    if (!$(this).hasClass("flip")) {
      $(this).toggleClass("flip");
      setTimeout(() => {
        $(this).toggleClass("flip");
      }, 1000);
    }
  });
}

const setup = async () => {
  $("#start").on("click", function () {
    start();
  });

  $("#reset").on("click", function () {
    reset();
  });

  $(".difficulty").on("click", function () {
    $(`#${difficulty}`).toggleClass("active");
    $(this).toggleClass("active");
    difficulty = $(this).attr("id");
  });

  $("#dark").on("click", function () {
    $("body").css("background-color", "black");
  });

  $("#light").on("click", function () {
    $("body").css("background-color", "white");
  });

  let firstCard = undefined;
  let secondCard = undefined;
  $("#game_grid").on("click", ".card", function () {
    if ($(this).hasClass("flip")) {
      return;
    }

    if (firstCard && secondCard) {
      return; 
    }

    $(this).toggleClass("flip");

    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0];
      clicks++;
      updateHeader();
    } else {
      secondCard = $(this).find(".front_face")[0];
      console.log(firstCard, secondCard);
      if (firstCard.src == secondCard.src) {
        console.log("match");
        $(`#${firstCard.id}`).parent().off("click");
        $(`#${secondCard.id}`).parent().off("click");
        firstCard = undefined;
        secondCard = undefined;
        pairsMatched++;
        pairsRemaining--;
        clicks++;
        updateHeader();
      } else {
        console.log("no match");
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          $(`#${secondCard.id}`).parent().toggleClass("flip");
          firstCard = undefined;
          secondCard = undefined;
          clicks++;
          updateHeader();
          if (clicks % 3 === 0) {
            powerUp();
          }
        }, 1000);
      }
    }
  });
};

$(document).ready(setup);
