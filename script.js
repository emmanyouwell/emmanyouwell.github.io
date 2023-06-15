const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
const responses = [
    "I said not here !",
    "Click the box !",
    "NOT HERE !",
    "Haha.",
    "Don't poke me there !",
    "Not here !"
];
const showWinner = document.getElementById('winner-prompt');
const winnerMessage = document.querySelector('[winning-prompt-text]');
const board = document.getElementById('container')
const cellElements = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restart');
const clickHere = document.querySelector('[click-here]');
const r = document.querySelector(':root');
const notHere = document.getElementById('not-here');
const body = document.getElementById('body');
let o_turn;
var count=0;

startGame();

restartButton.addEventListener('click', startGame);

function startGame(){
    count=0;
    o_turn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click',handleClick);
        cell.addEventListener('click', handleClick, { once:true })
    });
    setBoardHoverClass();
    showWinner.classList.remove('show');
    clickHere.classList.remove('hide');
    notHere.classList.remove('hide');
    r.style.setProperty('--opacity', `${0}`);
    if (notHere.classList.contains('show')){
        body.addEventListener('click', placeText);
    }
    
}


function placeText(e){
    count+=1;
    var randomOption = Math.floor(Math.random() * responses.length);
    var rs = getComputedStyle(r);
    if (count==1 && rs.getPropertyValue('--x_axis') != 0){
        r.style.setProperty('--opacity', `${0}`);
        
    }else{
        r.style.setProperty('--opacity', `${1}`)
        notHere.classList.add('show');
        if (notHere.classList.contains('show')){
            var x = e.clientX;
            var y = e.clientY;
            console.log('x: '+x+' y: '+y);
            notHere.innerText = responses[randomOption];
            setXY(e);

        }
    }
    
    console.log(count);
}

function setXY(e){
    
    r.style.setProperty('--x_axis', `${e.clientX}px`);
    r.style.setProperty('--y_axis', `${e.clientY}px`);
}

function handleClick(e){
    const cell = e.target;
    const currentClass = o_turn ? O_CLASS : X_CLASS;
    
    placeMark(cell, currentClass);
    clickHere.classList.add('hide');
    notHere.classList.add('hide');
    r.style.setProperty('--x_axis', `${1}px`);
    body.removeEventListener('click',placeText);
    
    if (checkWin(currentClass)){
        endgame(false);
        
    }
    else if(isDraw()){
        endgame(true);
    }
    else{
        swapTurns();
        setBoardHoverClass();
    }
    
}

function endgame(draw){
    if (draw){
       winnerMessage.innerText = 'Draw!';
    }
    else{
        winnerMessage.innerText = `${o_turn ? "O's" : "X's"} Wins!`;
    }
    showWinner.classList.add('show');
}

function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) ||
            cell.classList.contains(O_CLASS)
    });
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass);
}

function swapTurns(){
    o_turn = !o_turn;
}

function setBoardHoverClass(){
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (o_turn){
        board.classList.add(O_CLASS);
    }
    else{
        board.classList.add(X_CLASS);
    }

}

function checkWin(currentClass){
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        });
    });
}