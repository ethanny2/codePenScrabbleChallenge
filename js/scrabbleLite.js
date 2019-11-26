 
/*
 Distributon of tiles found here
 https://www.thesprucecrafts.com/how-many-letter-tiles-are-in-scrabble-410933
 Since my version doesn't use blank tiles I just omit them (So its out of 98 tiles)
 Added extra U and S
*/
let tileFrequencies ='AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSSTTTTTTUUUUUVVWWXYYZ';
let playTiles = "";

/*Generates random letters for word based on actual scrabble data.
100 tiles total , more weight to get vowels than consonants 
7 tiles total
*/
function generateTiles(){
    let len = tileFrequencies.length;
    for(let i = 0; i< 7; i++){
        playTiles+= tileFrequencies.charAt(Math.floor(Math.random() * len));
    }
    console.log(playTiles);
}




 