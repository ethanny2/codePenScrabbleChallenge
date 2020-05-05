import "../sass/style.scss";
import "../static/html/index.html";
/*
 Distributon of tiles found here
 https://www.thesprucecrafts.com/how-many-letter-tiles-are-in-scrabble-410933
 This distribution doesn't work well for my game where you cannot continue building upon other
 words, frequency has been tuned from base scrabble game
*/
const KEY = "WORDS";
const WORDS = createDictionary();
let guessedWords = [];
// "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOPPQRRRRRRSSSSSTTTTTTUUUUUVVWWXYYZ";
const tileFrequencies =
  "AAAAAAAAABBBBBCCCCCCDDDDDEEEEEEEEEFFFFFGGGGGHHHHHIIIIIIIIJJJJKKKKKLLLLLLLMMMMMNNNNNNOOOOOOOOPPPPPPQQRRRRRSSSSSTTTTTTTUUUUUUUUVVVWWWWXYZ";
let playTiles; //Array of tiles
const tileValueMap = new Map();
tileValueMap.set("1", ["A", "E", "I", "O", "U", "L", "N", "S", "T", "R"]);
tileValueMap.set("2", ["D", "G"]);
tileValueMap.set("3", ["B", "C", "M", "P"]);
tileValueMap.set("4", ["F", "H", "V", "W", "Y"]);
tileValueMap.set("5", ["K"]);
tileValueMap.set("8", ["J", "X"]);
tileValueMap.set("10", ["Q", "Z"]);

createDictionary();

/*
  DYNAMIC IMPORTS WITH import()!
  ------------------------------
  words_dictionary.json ~ 400,000 key-values
  Instead of loading a 7MB JSON & converting to an Array each time
  we store the parsed array in the client side
  localStorage and we conditionally import the JSON
  data at RUNTIME using ES2020 dynamic import() if its not
  found!
*/
function createDictionary() {
  let ret = [];
  if (!localStorage.getItem(KEY)) {
    let wordData = import("../static/data/words_dictionary.json")
      .then(module => module.default)
      .then(data => {
        ret = Object.keys(data);
        localStorage.setItem(KEY, JSON.stringify(ret));
        return ret;
      });
  }
  ret = JSON.parse(localStorage.getItem(KEY));
  return ret;
}

function validateWordBinary(word) {
  console.log("Calling validateWordBinary " + word);
  let targetWord = word.toLowerCase();
  console.log("TESTING WITH FIND " + WORDS.find(e => e === targetWord));
  let start = 0;
  let end = WORDS.length - 1;
  let mid;
  while (start <= end) {
    mid = parseInt((start + end) / 2, 10);
    let curWord = WORDS[mid];
    console.log(curWord);
    console.log(`Start: ${start}   END: ${end}   MID: ${mid}`);
    if (curWord === targetWord) {
      return true;
    } else if (curWord < targetWord) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return false;
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
  const anim = document.getElementById("score-animation");
  const converted = Number(points);
  if (converted > 0 && converted <= 3) {
    anim.innerText = "Nice! +" + converted;
    anim.classList.toggle("lowScore", true);
    setTimeout(() => {
      anim.classList.toggle("lowScore");
    }, 500);
  } else if (converted > 3 && converted <= 5) {
    anim.innerText = "Wonderful! +" + converted;
    anim.classList.toggle("midScore", true);
    setTimeout(() => {
      anim.classList.toggle("midScore");
    }, 500);
  } else if (converted > 5) {
    anim.innerText = "Amazing!!! +" + converted;
    anim.classList.toggle("highScore", true);
    setTimeout(() => {
      anim.classList.toggle("highScore");
    }, 500);
  }
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
  let answerRow = document.getElementById("answer-row");
  let answerLetterArr = Array.from(answerRow.children);
  let total = 0;
  let word = "";
  answerLetterArr.forEach(val => {
    total += parseInt(val.firstElementChild.innerText, 10);
    word += val.innerText.charAt(0);
  });
  let newScore = parseInt(score.innerText, 10) + total;
  let found = WORDS.find(e => e === word.toLowerCase());
  console.log(found);
  if (!isNaN(newScore) && found) {
    addToScore(total);
    displayScoreEffect(total);
    guessedWords.push(word);
  } else {
    answerRow.classList.toggle("wrong", true);
    console.log("Adding shake aniamtion");
    setTimeout(() => {
      answerRow.classList.toggle("wrong");
    }, 800);
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
  startTimer(123);
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

document.querySelector("#theme").addEventListener("change", e => {
  document.body.style.background = e.target.value;
});

document.querySelector("#tile-row").addEventListener("click", event => {
  if (event.target && event.target.classList.contains("tile")) {
    insertLetter(event.target);
  }
});
document.getElementById("refresh").addEventListener("click", generateTiles);
document.getElementById("submit").addEventListener("click", getWordValue);
/*Enter key submits word */
document.addEventListener("keypress", event => {
  if (event.keyCode == 13) {
    getWordValue();
  }
});
/*
  For mobile users let them double tap to submit instead
  http://jsfiddle.net/brettwp/J4djY/
*/
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  document.body.addEventListener("touchend", detectDoubleTapClosure());
}

function detectDoubleTapClosure() {
  let lastTap = 0;
  let timeout;
  return function detectDoubleTap(event) {
    const curTime = new Date().getTime();
    const tapLen = curTime - lastTap;
    if (tapLen < 500 && tapLen > 0) {
      getWordValue();
      event.preventDefault();
    } else {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
      }, 500);
    }
    lastTap = curTime;
  };
}

document.querySelector("#answer-row").addEventListener("click", event => {
  if (event.target && event.target.classList.contains("tile")) {
    removeLetter(event.target);
  }
});
gameLoop();
