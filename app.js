let players = ['X', 'O']
let turn = 0;

let xMoves = []
let oMoves = []

let startButton = document.getElementById('start')
let statusText = document.getElementById('status-text')

let winningPatterns = ['1,2,3', '4,5,6', '7,8,9', '1,4,7', '2,5,8', '3,6,9', '1,5,9',
    '3,5,7']
let oMovesString = null;
let xMovesString = null;


startButton.addEventListener('click', startGame)

// ---------------------------Our Start Game  -------------------------//
function startGame() {
    statusText.innerHTML = 'It\'s player' + players[0] + ' turn'
    startButton.disabled = true;


    //  ---------------------------Our Cell's loop -------------------------//
    for (boxElementX of boxes) {

        boxElementX.addEventListener('click', markBox)
    }

}
//  ---------------------------Our Cells -------------------------//


let boxes = document.getElementsByClassName('cell');







function markBox(evt) {

    // ---------------------------Check if vacant cell ---------------------------------//
    if (evt.target.innerText !== '') {
        statusText.innerText = 'Please pick a vacant cell'
        return
    }

    // ---------------------------Set player turns ---------------------------------//       
    evt.target.innerText = players[turn]

    if (turn === 0) {  
        console.log(turn)                             // Set player X
        xMoves.push(evt.target.getAttribute('id'));
        //turn = 1;
        xMoves.sort();

        xMovesString = xMoves.toString()


    } else {                                        // Set player O

        oMoves.push(evt.target.getAttribute('id'));
        //turn = 0;
        oMoves.sort();
        oMovesString = oMoves.toString()


    }
    if ((xMovesString !== null && checkWin(xMovesString)) ||
        (oMovesString !== null && checkWin(oMovesString))) {
        statusText.innerHTML = 'Player ' + players[turn] + ' is the winner!'      // status text update
       return;
   } 
    console.log('got here')
    if (turn === 0) {
        turn = 1;
    } else {
        turn = 0;
    }
    statusText.innerHTML = 'It\'s player ' + players[turn] + ' turn!'      // status text update




}
// ---------------------------Check Win function ---------------------------------//   
function checkWin(movesString) {
    for (pattern of winningPatterns) {
        console.log(pattern)
        if (movesString.includes(pattern)) {


            return true
        }

    }






}









// ---------------------------Notes for Next time -------------------------//

/* events looking at each id on each box

so we need clicks and listeners

this can be cloned */