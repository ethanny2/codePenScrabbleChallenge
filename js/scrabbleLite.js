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
    insertLetter(){

    }
    removeLetter(){

    }
    //Calls api and checks if word is real
    validateWord(){

    }
    //Use map to get score
    getScoreValue(){

    }
}






window.addEventListener('DOMContentLoaded', (event) => {
    /*Register click events for tiles*/
    let answer = new AnswerGrid(document.getElementById('#answer-row'));
    gameLoop();
    
});



 