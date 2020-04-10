/* 
  Adding your style files and html files to webpacks dependency graph so it can be
  parsed by loaders 
*/
import "../sass/style.scss";
import "../static/html/index.html";

/*
 Distributon of tiles found here
 https://www.thesprucecrafts.com/how-many-letter-tiles-are-in-scrabble-410933
 Since my version doesn't use blank tiles I just omit them (So its out of 98 tiles)
 Added extra U and S added 2 extra Es
*/
const DICTIONARY = [];
const fs = require("fs");
const tileFrequencies =
  "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOPPQRRRRRRSSSSSTTTTTTUUUUUVVWWXYYZ";
let playTiles; //Array of tiles
const tileValueMap = new Map();
tileValueMap.set("1", ["A", "E", "I", "O", "U", "L", "N", "S", "T", "R"]);
tileValueMap.set("2", ["D", "G"]);
tileValueMap.set("3", ["B", "C", "M", "P"]);
tileValueMap.set("4", ["F", "H", "V", "W", "Y"]);
tileValueMap.set("5", ["K"]);
tileValueMap.set("8", ["J", "X"]);
tileValueMap.set("10", ["Q", "Z"]);

function createDictionary() {
  //fs.readFile(')
}

function getLetterValue(letter) {
  for (const [key, val] of tileValueMap) {
    if (val.find(temp => temp === letter)) {
      return parseInt(key, 10); //10 is radix
    }
  }
}

function displayScoreEffect(points) {
  console.log("Displaying score effect");
  let anim = document.getElementById("score-animation");
  anim.innerText = "";
  if (!anim.classList.contains("scoredClass")) {
    anim.classList.add("scoredClass");
  }
  //Clone to replay animation
  let newNode = anim.cloneNode(true);
  newNode.innerText = `Nice +${points}!`;
  anim.remove();
  document.body.append(newNode);
}

function addToScore(wordValue) {
  let score = document.getElementById("score");
  let newScore = parseInt(score.innerText, 10) + wordValue;
  if (!isNaN(newScore)) {
    score.innerText = newScore;
    generateTiles();
  }
}

function getWordValue() {
  let score = document.getElementById("score");
  let answerLetterArr = Array.from(
    document.getElementById("answer-row").children
  );
  let total = 0;
  let word = "";
  answerLetterArr.forEach(val => {
    total += parseInt(val.firstElementChild.innerText, 10);
    word += val.innerText.charAt(0);
  });

  let newScore = parseInt(score.innerText, 10) + total;
  if (!isNaN(newScore)) {
    addToScore(total);
    displayScoreEffect(total);
  }
  return [word, total];
}

/*Generates random letters for word based on actual scrabble data.
100 tiles total , more weight to get vowels than consonants 
7 tiles total
//Creates markup and attaches
*/
function generateTiles() {
  let temp = "";
  let id = 0;
  let markup;
  let startRow = document.getElementById("tile-row");
  let answerRow = document.getElementById("answer-row");
  let letterVal = 0;
  //Remove anything there
  while (startRow.firstChild) {
    startRow.removeChild(startRow.firstChild);
  }
  while (answerRow.firstChild) {
    answerRow.removeChild(answerRow.firstChild);
  }

  for (let i = 0; i < 7; i++) {
    temp += tileFrequencies.charAt(
      Math.floor(Math.random() * tileFrequencies.length)
    );
  }
  playTiles = [...temp];
  playTiles.forEach(tile => {
    id++;
    letterVal = getLetterValue(tile);
    markup = `<li id="tile-${id}" class="tile" >${tile} <span class="tile-value"> ${letterVal}</span></li>`;
    startRow.innerHTML += markup;
  });
}

function startTimer(time) {
  let id = setInterval(() => {
    //Update view every 1s
    time -= 1;
    updateTimer(time, id);
  }, 1000);
}

/* Updates view of timer
time remaining passed in in seconds*/
function updateTimer(time, id) {
  document.getElementById("timer-num").innerHTML = `${time} `;
  if (time <= 0) {
    clearInterval(id);
  }
}

function gameLoop() {
  generateTiles();
  startTimer(120);
}

/* When tile clicked play animation that adds it to the answer grid */
function insertLetter(tile) {
  let inserted = tile.cloneNode(true);
  let animation = tile.cloneNode(true);
  let startRect = findAbsPos(tile);
  animation.style.position = "absolute";
  animation.style.left = startRect[0] + "px";
  animation.style.top = startRect[1] + "px";
  inserted.classList.toggle("tileHidden");
  document.getElementById("answer-row").appendChild(inserted);
  let endRect = findAbsPos(inserted);
  computeVector(startRect, endRect);
  tile.classList.toggle("tileHidden");
  document.body.appendChild(animation);

  animation.classList.add("setTileAnim");
  /* Wait for the animation to finsh*/
  setTimeout(() => {
    inserted.classList.toggle("tileHidden");
    document.body.removeChild(animation);
  }, 500);
}

function removeLetter(tile) {
  let orignalTile = Array.from(
    document.getElementById("tile-row").children
  ).find(elem => elem.id === tile.id);
  let animation = tile.cloneNode(true);
  let endRect = findAbsPos(orignalTile);
  let startRect = findAbsPos(tile);
  animation.style.position = "absolute";
  animation.style.left = startRect[0] + "px";
  animation.style.top = startRect[1] + "px";
  tile.remove();
  computeVector(startRect, endRect);
  animation.classList.add("removeTileAnim");
  document.body.appendChild(animation);
  setTimeout(() => {
    orignalTile.classList.toggle("tileHidden");
    document.body.removeChild(animation);
  }, 500);
}

/* Helper function to compute the distance of the 2D vector needed for 
the CSS setTile animation
startCoords- array returned from findAbsPos  
endCoords - ' '
*/
function computeVector(startCoords, endCoords) {
  let xDist = startCoords[0] - endCoords[0];
  startCoords[0] > endCoords[0] ? (xDist *= -1) : (xDist *= -1);
  let yDist = -(startCoords[1] - endCoords[1]); //Always negative ; moves up to answer board
  document.documentElement.style.setProperty("--tx", `${xDist}px`);
  document.documentElement.style.setProperty("--ty", `${yDist}px`);
}

/*https://www.quirksmode.org/js/findpos.html */
function findAbsPos(obj) {
  let curleft = 0;
  let curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while ((obj = obj.offsetParent));
  }
  return [curleft, curtop];
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#tile-row").addEventListener("click", event => {
    if (event.target && event.target.classList.contains("tile")) {
      insertLetter(event.target);
    }
  });
  document.getElementById("refresh").addEventListener("click", () => {
    generateTiles();
  });
  document.getElementById("submit").addEventListener("click", () => {
    getWordValue();
  });
  document.addEventListener("keypress", event => {
    if (event.keyCode == 13) {
      getWordValue();
    }
  });

  document.querySelector("#answer-row").addEventListener("click", event => {
    if (event.target && event.target.classList.contains("tile")) {
      removeLetter(event.target);
    }
  });
  gameLoop();
});
