[![GitHub license](https://img.shields.io/github/license/ethanny2/codePenScrabbleChallenge)](https://github.com/ethanny2/codePenScrabbleChallenge)[![GitHub stars](https://img.shields.io/github/stars/ethanny2/codePenScrabbleChallenge)](https://github.com/ethanny2/codePenScrabbleChallenge/stargazers)[![GitHub forks](https://img.shields.io/github/forks/ethanny2/codePenScrabbleChallenge)](https://github.com/ethanny2/codePenScrabbleChallenge/network)[![Twitter Badge](https://img.shields.io/badge/chat-twitter-blue.svg)](https://twitter.com/ArrayLikeObj)

# Vanilla JS + JAM Stack Scrabble Lite Game

<p align="center">
  <img width="460" height="300" src="https://media2.giphy.com/media/KzEePAHteq4F0QLprM/giphy.gif" alt="Demo gif">
</p>


## Background
The original concept for this app was created for the November 2020 Thanksgiving week [Codepen Challenge](https://codepen.io/); the task was to create a Codepen celebrating the game of [Scrabble](https://scrabble.hasbro.com/en-us).

To challenge myself and gain a deeper understanding of CSS Custom Properties and JavaScript animation events I decided create this app using *0 dependencies or animation libraries*. 

Since the "back-end" portion of the application is just a single route/function verifying the word is real I opted to use [Netlify serverless functions](https://www.netlify.com/products/functions/) to make it a JAM stack application. 

## Technology used
- SCSS
- CSS Custom Properties (Variables)
- Netlify Serverless functions
- Nodejs require.resolve() to read the dictionary file
- ES6/ESNext [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- webpack 4 
## Concepts

## webpack 4 bundling

Using my own custom webpack 4 dev and production configuration to have a local
dev-server with hot module reloading and optimizied production build with
minification, auto-prefixing for CSS properties and more.


### Double tap custom event with closures
To make it quicker for mobile users to submit their answer I implemented a doubleTap event listener that utilizes closures and a setTimeout to determine if a double tap occured.

```
/* Based on this http://jsfiddle.net/brettwp/J4djY/*/
function detectDoubleTapClosure() {
  let lastTap = 0;
  let timeout;
  return function detectDoubleTap(event) {
    const curTime = new Date().getTime();
    const tapLen = curTime - lastTap;
    if (tapLen < 500 && tapLen > 0) {
      console.log('Double tapped!');
      event.preventDefault();
    } else {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
      }, 500);
    }
    lastTap = curTime;
  };
}

/* Regex test to determine if user is on mobile */
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  docum
```

### Netlify Serverless functions reading local files

To my knowledge I did not see any previous material that implied it was possible to also upload a static file (like my JSON file) and access it via the Netlify Serverless function. Here I did it using Node's require.resolve()

**Notice how the folder name must match the file name.**
```
const fs = require("fs");

exports.handler = function(event, context, callback) {
  const dictionary = JSON.parse(
    fs.readFileSync(require.resolve("./data/small_dictionary.json"), "utf-8")
  );
  const { word } = JSON.parse(event.body);
  const res = dictionary.findIndex(e => e === word);
  callback(null, {
    statusCode: 200,
    body: res === -1 ? "false" : "true"
  });
};

```
### Caculating 2D vectors in CSS to get animation path

I used CSS custom properties and JavaScript to change the values of the of the x and y position that the tile would move to based on their absolute position of the window/document. 
```
function computeVector(startCoords, endCoords) {
  let xDist = startCoords[0] - endCoords[0];
  startCoords[0] > endCoords[0] ? (xDist *= -1) : (xDist *= -1);
  let yDist = -(startCoords[1] - endCoords[1]); //Always negative ; moves up to answer board
  document.documentElement.style.setProperty("--tx", `${xDist}px`);
  document.documentElement.style.setProperty("--ty", `${yDist}px`);
}

```
