// Global Variables to setup game
let players = []
let turn = 0  // 0 is X, 1 is O
let gameMode = ''

// Use arrays to record the moves that each player makes
let xMoves = []
let oMoves = []

// get DOM object associated with start button, status area, timer and game mode (player v player or player v computer)
let startButton = document.getElementById('start')
let statusText = document.getElementById('status-text')
let timer = document.getElementById('timer')
let playerMode = document.getElementById('Player-vs-Player')
let pcMode = document.getElementById('Player-vs-Comp')
let xPlayerName = document.getElementById('x-player')
let oPlayerName = document.getElementById('o-player')
let newGame = document.getElementById('new-game')

// get collection of DOM objects associated with each box on grid 
let boxes = document.getElementsByClassName('cell')

// setup listener on start button to detect click
startButton.addEventListener('click', startGame)
newGame.addEventListener('click', refreshGame)

// setup strings that will be used to track where boxes where Xs and Os are placed
let oMovesString = null;
let xMovesString = null;

// setup var for elapsed time
let elapsedTime = null;


function startGame() {
    // set variable so we know game mode - i.e. player vs player or player vs computer
    gameMode = document.querySelector('input[name=game-mode]:checked').value

    // disable radio buttons and start button so player can't change during game
    playerMode.disabled = true;
    pcMode.disabled = true;
    startButton.disabled = true
    xPlayerName.disabled = true
    oPlayerName.disabled = true

    // set player names based on input
    players[0] = xPlayerName.value

    // Set turn so X player goes first  
    turn = 0

    // Computer Assignment if playing VS computer 
    if (gameMode === 'PvC') {
        players[1] = 'Computer'
        oPlayerName.value = 'Computer'
    } else {
        players[1] = oPlayerName.value
    }

    // Set Status Text so players know whos turn it is
    if (players[0] !== '' && players[1] !== '') {
        statusText.innerHTML = 'It\'s ' + players[turn] + '\'s turn'
    }
    else {
        statusText.innerHTML = 'You must fill in the players names before you can play!'
        return;
    }

    // clear the board of an Xs or Os and clear out any moves from prior game
    xMoves = []
    oMoves = []

    // add event listeners
    for (boxElement of boxes) {
        boxElement.addEventListener('click', markBox)
        boxElement.style.backgroundColor = 'orangered'
        boxElement.innerHTML = ''
    }

    // Setup timer to show elapsed time of game
    var startDate = new Date()
    elapsedTime = window.setInterval(updateElapsedTime, 1000, startDate)   
}

function markBox(evt) {
    // Prevent player from trying to pick a box that is already filled
    if (evt.target.innerText !== '') {
        statusText.innerText = 'Please pick a vacant cell'
        return
    }

    // Fill in box with X or O based on which player
    evt.target.innerText = (turn === 0 ? 'X' : 'O')

    switch (gameMode) {

        // Player versus Player
        case 'PvP':

            // Save move of player
            if (turn === 0) {
                xMoves.push(evt.target.getAttribute('id'))
            } else {
                oMoves.push(evt.target.getAttribute('id'))
            }

            // Check for draw or win
            if ((xMoves.length === 5 && oMoves.length === 4) &&
                checkWin() === false) {
                statusText.innerHTML = 'Whoops! It\'s a tie!'
                resetGame()
                return;
            } else if ((xMoves.length > 0 && checkWin())) {
                // Display winner name in status area, stop timer & re-enable start button
                statusText.innerHTML = players[turn] + ' is the winner!'
                resetGame()
                return;
            } else {  // if not draw or win, switch player
                turn = (turn === 0) ? 1 : 0
                statusText.innerHTML = 'It\'s ' + players[turn] + '\'s turn!'
                break;
            }

        // Player versus Computer
        case 'PvC':
            // record human players move
            xMoves.push(evt.target.getAttribute('id'))

            // check for human win or draw
            if (checkWin()) {
                statusText.innerHTML = players[0] + ' is the winner!'
                resetGame()
            }
            else if ((xMoves.length === 5 && oMoves.length === 4) &&
                (checkWin() === false)) {
                statusText.innerHTML = 'Whoops! It\'s a tie!'
                resetGame()
                return;
            }
            else {
                // execute computer move, record it 
                compBoxTaken = computerMove()
                oMoves.push(document.getElementById(compBoxTaken.toString()).getAttribute('id'))

                // check for win or draw
                if (checkWin()) {
                    statusText.innerHTML = players[1] + ' is the winner!'
                    resetGame()
                }
                else if ((xMoves.length === 5 && oMoves.length === 4) &&
                    (checkWin() === false)) {
                    statusText.innerHTML = 'Whoops! It\'s a tie!'
                    resetGame()
                } else {
                    statusText.innerHTML = 'It\'s ' + players[turn] + '\'s turn!'
                }
            }
    }
}

// game is over reset timer, buttons, listeners
function resetGame() {
    window.clearInterval(elapsedTime)
    playerMode.disabled = false
    pcMode.disabled = false
    startButton.disabled = false
    oPlayerName.disabled = false
    xPlayerName.disabled = false
    for (boxElement of boxes) {
        boxElement.removeEventListener('click', markBox)
    }
}

// Use random number loop to find empty cell for computer move
function computerMove() {

    let randMoves = randNum()
    let lookForMove = true;

    while (lookForMove) {
        if (document.getElementById(randMoves.toString()).innerText === '') {
            compMoves = document.getElementById(randMoves.toString()).innerText = 'O'
            lookForMove = false;
        }
        else {
            randMoves = randNum()

        }
    }
    return randMoves;
}

// Check to see if player move combinations match one of the winning move combinations
function checkWin() {

    // use array to track winning box combinations
    let winningPatterns =
        ['1,2,3', '4,5,6', '7,8,9',     // horizontal wins
            '1,4,7', '2,5,8', '3,6,9',  // vertical wins
            '1,5,9', '3,5,7']           // diagonal winds

    let winPattern = ''
    let xCounter = 0
    let oCounter = 0
    let docElement = ''

    for (element of winningPatterns) {

        // Create array of elements representing 3 boxes that are a win combo
        winPattern = element.split(",")

        // loop and check to see if there are 3 Xs or Os present
        for (element of winPattern) {
            docElement = document.getElementById(element.toString()).innerHTML

            if (docElement === 'X') {
                xCounter += 1
            }
            else if (docElement === 'O') {
                oCounter += 1
            }
            else {
                break;
            }
        }

        // if 3 Xs or 3 Os we have a winner and return true
        if (xCounter === 3) {
            highlightWinningBoxes(winPattern)
            return true
        }
        else if (oCounter === 3) {
            highlightWinningBoxes(winPattern)
            return true
        }
        else {  // Otherwise reset the counts before checking the next set of 3 boxes that are a win combination
            xCounter = 0
            oCounter = 0
        }
    }

    // Return false if after checking all win box combinations there is no winner
    return false
}

// Highlight boxes with winning Xs or Os
function highlightWinningBoxes(winningBoxes) {

    for (element of winningBoxes) {
        document.getElementById(element).style.backgroundColor = 'black'
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

// Random Number Generator
function randNum() {
    let randomNum = (Math.floor(Math.random() * 9))

    if (randomNum > 0) {
        return randomNum
    }
    else {
        return 1;
    }
}
// New Game Function 
function refreshGame() {
    window.location.reload();
}