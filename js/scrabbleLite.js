const tileWidth = 100; //px
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


/*Generates random letters for word based on actual scrabble data.
100 tiles total , more weight to get vowels than consonants 
7 tiles total
*/
function generateTiles(){
    let temp = '';
    for(let i = 0; i< 7; i++){
        temp+= tileFrequencies.charAt(Math.floor(Math.random() * tileFrequencies.length));
    }
    playTiles = [...temp];
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
    inserted.classList.toggle('tileHidden');
    let animation = tile.cloneNode(true);
    let startRect = findAbsPos(tile);

    animation.style.position =  'absolute';
    console.log(startRect);
    animation.style.left = startRect[0]+'px';
    animation.style.top = startRect[1] + 'px';
    console.log( animation.getBoundingClientRect());

    tile.classList.toggle('tileHidden');
    animation.classList.add('setTileAnim');
    

    /*Match animation timing to insert new elem */
    document.body.appendChild(animation);
    document.getElementById('answer-row').appendChild(inserted);  
    /* Wait for the animation to finsh*/
    setTimeout(()=>{
        inserted.classList.toggle('tileHidden');
        document.body.removeChild(animation);
    },700);
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
    document.querySelectorAll('.tile').forEach(tile => tile.addEventListener('click', (e)=>{
        insertLetter(e.target);
    }));
    let answer = new AnswerGrid(document.getElementById('#answer-row'));
    gameLoop();
    

});



 