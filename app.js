// Global Variables to setup game
let players = []
let turn = 0
let winningPattern = ''

// Use arrays to record the moves that each player makes
let xMoves = []
let oMoves = []

// use array to track winning box combinations
let winningPatterns =
    ['1,2,3', '4,5,6', '7,8,9',     // horizontal wins
        '1,4,7', '2,5,8', '3,6,9',  // vertical wins
        '1,5,9', '3,5,7']           // diagonal winds

// get DOM object associated with start button, status area, timer
let startButton = document.getElementById('start')
let statusText = document.getElementById('status-text')
let timer = document.getElementById('timer')

// get collection of DOM objects associated with each box on grid 
let boxes = document.getElementsByClassName('cell')

// setup listener on start button to detect click
startButton.addEventListener('click', startGame)

// setup strings that will be used to check to see if player has won
let oMovesString = null;
let xMovesString = null;

// setup var for elapsed time
let elapsedTime = null;


let gameMode = ''



function startGame() {


    // Set turn so X player goes first and 
    turn = 0

    // This is how we determine game mode
    gameMode = document.querySelector('input[name=game-mode]:checked').value

    // set player names based on input
    players[0] = document.getElementById('x-player').value
    console.log(gameMode)

    // Computer Assignment if playing VS computer 
    if (gameMode === 'PvC') {
        players[1] = 'Computer'
        document.getElementById('o-player').value = 'Computer'
    } else {
        players[1] = document.getElementById('o-player').value
    }

    // Set Status Text so players know whos turn it is
    if (players[0] !== '' && players[1] !== '') {
        statusText.innerHTML = 'It\'s ' + players[turn] + ' turn'
    }
    else {
        statusText.innerHTML = 'You must fill in the players names before you can play!'
        return;
    }

    // clear the board of an Xs or Os and clear out any moves from prior game
    xMoves = []
    oMoves = []

    for (boxElement of boxes) {
        boxElement.removeEventListener('click', markBox)
        boxElement.innerHTML = ''
        boxElement.addEventListener('click', markBox)
        boxElement.style.backgroundColor = 'lightcyan'
    }

    // Setup timer to show elapsed time of game
    var startDate = new Date()
    elapsedTime = window.setInterval(updateElapsedTime, 1000, startDate)

    // disable start button
    startButton.disabled = true
}

function markBox(evt) {
    console.log('at top')
    // Prevent player from trying to pick a box that is already filled
    if (evt.target.innerText !== '') {
        statusText.innerText = 'Please pick a vacant cell'
        return
    }
    /* if (players[1] === 'Computer' && turn === 1) {
     let randMoves = randNum(9)
     console.log(randMoves)
     compMoves = document.getElementById(randMoves.toString()).innerText = 'O'
     console.log(compMoves)
     } else {
 */
    // Fill in box with X or O based on which player
    evt.target.innerText = (turn === 0 ? 'X' : 'O')

    // store player moves in array so we can use to check for win condition
    if (turn === 0) {
        xMoves.push(evt.target.getAttribute('id'))
    } else {
        oMoves.push(evt.target.getAttribute('id'))
    }``

    // Check for win condition
    if ((xMoves.length > 0 && checkWin(xMoves)) ||
        (oMoves.length > 0 && checkWin(oMoves))) {

        // Display winner name in status area and re-enable start button
        statusText.innerHTML = 'Player ' + players[turn] + ' is the winner!'

        window.clearInterval(elapsedTime)
        startButton.disabled = false;

    }
    // If not in a win condition, Update turn to next player
    else if (turn === 0) {
        turn = 1;
        statusText.innerHTML = 'It\'s ' + players[turn] + ' turn!'
    } else {
        turn = 0;
        statusText.innerHTML = 'It\'s ' + players[turn] + ' turn!'
    }
    if (gameMode === 'PvC') {
        computerMove();
    }

    console.log('at bottom')
}

function computerMove() {

    let randMoves = randNum(9)
    console.log()
    console.log(document.getElementById(randMoves.toString()).innerText)
    if (document.getElementById(randMoves.toString()).innerText === '') {
        compMoves = document.getElementById(randMoves.toString()).innerText = 'O'

        console.log(compMoves)
    }
}




// Check to see if player move combinations match one of the winning move combinations
function checkWin(movesString) {
    movesString.sort()
    let checkString = movesString.toString()

    for (pattern of winningPatterns) {
        if (checkString.includes(pattern)) {
            highlightWinningBoxes(pattern)
            return true
        }
    }
}

// Highlight boxes with winning Xs or Os
function highlightWinningBoxes(pattern) {
    winningBoxes = pattern.split(',')
    for (box of winningBoxes) {
        document.getElementById(box).style.backgroundColor = 'red'
    }
}

function updateElapsedTime(startTime) {
    let endTime = new Date()
    let timeDiff = endTime.getTime() - startTime.getTime()

    // convert to miliseconds
    timeDiff = timeDiff / 1000

    // calculate elapsed time in minutes and seconds
    let seconds = Math.floor(timeDiff)
    let minutes = Math.floor(((timeDiff / 60)) % 60)

    timer.innerHTML = 'Time Elapsed: ' + seconds + ' seconds'
}


function randNum(max) {
    rand = Math.floor(Math.random() * Math.floor(max))


    return rand
}