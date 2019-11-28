const tileWidth = 100; //px
const apiBaseUrl = 'https://od-api.oxforddictionaries.com/api/v2';
/* Free for up to 1000 requests a month and then it should be throttled; to continue playing insert your
own id and key which you can get from https://developer.oxforddictionaries.com/ for free */
const apiID =  'a7bed167';
const apiKey =  '63bba379b45bffd077e349ef334e4927';

/*
 Distributon of tiles found here
 https://www.thesprucecrafts.com/how-many-letter-tiles-are-in-scrabble-410933
 Since my version doesn't use blank tiles I just omit them (So its out of 98 tiles)
 Added extra U and S
*/
const tileFrequencies ='AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSSTTTTTTUUUUUVVWWXYYZ';
let playTiles; //Array of tiles
const tileValueMap = new Map();
tileValueMap.set('1',['A','E','I','O','U','L','N','S','T','R']);
tileValueMap.set('2',['D','G']);
tileValueMap.set('3',['B','C','M','P']);
tileValueMap.set('4',['F','H','V','W','Y']);
tileValueMap.set('5',['K']);
tileValueMap.set('8',['J','X']);
tileValueMap.set('10',['Q','Z']);

function getLetterValue(letter){
    for(const [key,val] of tileValueMap ){
        if(val.find( temp => temp === letter )){
            return parseInt(key,10); //10 is radix 
        }
    }
}

function getWordValue(){
   let answerLetterArr = Array.from(document.getElementById('answer-row').children);
   let total = 0;
   let word = "";
   console.log(answerLetterArr);
   answerLetterArr.forEach((val) => {
    total += parseInt(val.firstElementChild.innerText,10);
    word += val.innerText.charAt(0);
   });
   console.log(total);
   console.log(word);
   return [word, total];
}

/* Validate word; checks if entered word is real through dictionary api*/
function validateWord(){

}

/*Generates random letters for word based on actual scrabble data.
100 tiles total , more weight to get vowels than consonants 
7 tiles total
//Creates markup and attaches
*/
function generateTiles(){
    let temp = '';
    let id = 0;
    let tileVal = 0;
    let markup;
    let startRow = document.getElementById('tile-row');
    let answerRow = document.getElementById('answer-row');
    let letterVal = 0;
    //Remove anything there
    while(startRow.firstChild){
        startRow.removeChild(startRow.firstChild);
    }
    while(answerRow.firstChild){
        answerRow.removeChild(answerRow.firstChild);
    }
        
    for(let i = 0; i< 7; i++){
        temp+= tileFrequencies.charAt(Math.floor(Math.random() * tileFrequencies.length));
    }
    playTiles = [...temp];
    console.log(playTiles);
    playTiles.forEach(tile => {
        id++;
        //get val through map
        letterVal = getLetterValue(tile);
        markup = `<li id="tile-${id}" class="tile" >${tile} <span class="tile-value"> ${letterVal}</span></li>`;
        startRow.innerHTML+= markup;
    }); 
    console.log('Done generating tiles');
}

/*  Maybe 90 is good?
    time- time in seconds
    returns id to clear timer
*/
function startTimer(time){
    let id = 
        setInterval(()=>{
            //Update view every 1s
            time -=1;
            updateTimer(time, id);
        },1000);
}

/* Updates view of timer
time remaining passed in in seconds*/
function updateTimer(time,id){
    document.getElementById('timer-num').innerHTML = `${time} `;
    console.log('UPDATING TIMER');
    if(time <= 0){
        console.log('All out of time!');
        clearInterval(id);
    }
}


function gameLoop(){
    generateTiles();
    console.log('Calling gameLoop!');
   // startTimer(100);
}

/*Class for encapsulating the logic that  */

class AnswerGrid{
    constructor(gridElem){
        this.gridElem = gridElem;
        this.spaceOffset = tileWidth;
        this.index; //Out of 7 possible keeps track of current index
    }
    // insertLetter(){

    // }
    removeLetter(){

    }
    //Calls api and checks if word is real
    validateWord(){

    }
    //Use map to get score
    getScoreValue(){

    }
}

/* When tile clicked play animation that adds it to the answer grid */
function insertLetter(tile){
    let inserted = tile.cloneNode(true);
    let animation = tile.cloneNode(true);
    let startRect = findAbsPos(tile);
    animation.style.position =  'absolute';
    animation.style.left = startRect[0]+'px';
    animation.style.top = startRect[1] + 'px';
    inserted.classList.toggle('tileHidden');
    document.getElementById('answer-row').appendChild(inserted);  
    let endRect = findAbsPos(inserted);
    
    // console.log( animation.getBoundingClientRect());
    console.log( inserted.getBoundingClientRect());
    console.log( startRect);
    computeVector(startRect,endRect);
    tile.classList.toggle('tileHidden');
    /* Before starting animation pass in the end value to the animation*/
    animation.classList.add('setTileAnim');
    /*Match animation timing to insert new elem */
    document.body.appendChild(animation);
    /* Wait for the animation to finsh*/
    setTimeout(()=>{
        inserted.classList.toggle('tileHidden');
        document.body.removeChild(animation);
        console.log( inserted.getBoundingClientRect());
        console.log( findAbsPos(inserted));
    
    },500);
}

/* Going back animation could reuse above....
*/
function removeLetter(tile){
    let orignalTile = Array.from(document.getElementById('tile-row').children).find(elem => elem.id === tile.id);
    console.log(orignalTile);
    let animation = tile.cloneNode(true);
    let endRect = findAbsPos(orignalTile);
    let startRect = findAbsPos(tile);
    animation.style.position =  'absolute';
    animation.style.left = startRect[0]+'px';
    animation.style.top = startRect[1] + 'px';
    tile.remove();

    console.log(startRect);    
    console.log(endRect);
    computeVector(startRect,endRect);
    animation.classList.add('removeTileAnim');
    document.body.appendChild(animation);
    setTimeout(()=>{
        orignalTile.classList.toggle('tileHidden');
        document.body.removeChild(animation);
    },500);

}

/* Helper function to compute the distance of the 2D vector needed for 
the CSS setTile animation
startCoords- array returned from findAbsPos  
endCoords - ' '
*/
function computeVector(startCoords, endCoords){
    let xDist = (startCoords[0] - endCoords[0]);
    startCoords[0] > endCoords[0] ? xDist*=-1: xDist*=-1;
    let yDist = -(startCoords[1] - endCoords[1]);  //Always negative ; moves up to answer board
    document.documentElement.style.setProperty('--tx',`${xDist}px`);
    document.documentElement.style.setProperty('--ty',`${yDist}px`);
    console.log(getComputedStyle(document.documentElement).getPropertyValue('--tx'));
    console.log(getComputedStyle(document.documentElement).getPropertyValue('--ty'));
}

/*https://www.quirksmode.org/js/findpos.html */
function findAbsPos(obj){
    console.log(obj);
    let curleft = curtop = 0;
    if(obj.offsetParent){
        do{
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        }while(obj = obj.offsetParent);
    }
    return [curleft,curtop];
}



window.addEventListener('DOMContentLoaded', (event) => {
    /*Register click events for tiles*/
    // document.querySelectorAll('.tile').forEach(tile => tile.addEventListener('click', (e)=>{
    //     if(e.target.tagName !== "SPAN"){
    //         console.log(e.target.parentNode);
    //         if(e.target.parentNode.id === 'tile-row'){
    //             insertLetter(e.target);
    //         }
    //     }
    // }));

    document.querySelector('#tile-row').addEventListener('click',(event)=>{
        if(event.target && event.target.classList.contains('tile')){
            insertLetter(event.target);
            console.log('Calling insert');
        }
    });   
    document.getElementById('refresh').addEventListener('click',(event)=>{
        generateTiles();
    });  
    document.getElementById('submit').addEventListener('click',(event)=>{
        getWordValue();
    });  

    

    let answer = new AnswerGrid(document.getElementById('#answer-row'));
    gameLoop();
    document.querySelector('#answer-row').addEventListener('click',(event)=>{
        if(event.target && event.target.classList.contains('tile')){
            removeLetter(event.target);
            console.log('Calling remove');
        }
    });   

});



 