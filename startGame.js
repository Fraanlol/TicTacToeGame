function start() {
    let words = document.querySelectorAll(".title--letters");

    setTimeout(() => {
        Array.from(words).forEach((word,index) => {
            setTimeout(() => {
                word.classList.toggle("ttshow");
            }, index*500)
        })
    }, 1000);

    setTimeout(() => {
        Array.from(words).forEach((word,index) => {
            setTimeout(() => {
                word.classList.toggle("ttshow");
            }, index * 500);
        });
    }, 5000);

    setTimeout(() => {
        document.querySelector(".mainGame--title").style.display = "none";
        document.querySelector(".mainGame--board").style.display = "flex";
        Array.from(document.querySelectorAll('#changePlayer')).forEach(
            (key) => key.addEventListener('click', (e) => {
                gameController.changeSign(e.target.innerText);
                })
            );
        Array.from(document.querySelectorAll('.boardSquare')).forEach(
            key => key.addEventListener('click', (e) => { 
                e.target.innerText != '' ? console.log('estaLleno'):gameController.playGame(e.target.dataset.index)
            })
        )
    }, 6500);
    document.querySelector('#vline').classList.toggle('title--vline');
}

const player = (sign) => {
    let _sign = sign;
    let turn = false;

    const getSign = () => _sign;
    const setSign = (sign, human) => {
        _sign = sign;
        let p = document.querySelector(`.players--button__${sign.toLowerCase()}`);

        if (human) {
            p.classList.add('players--button__selected');
            p.classList.remove('players--button__unselected');
        } else {
            p.classList.remove('players--button__selected');
            p.classList.add('players--button__unselected');
        }
    };
    
    const getTurn = () => turn;
    const setTurn = () => { 
        turn = turn ? false:true;
    }
    return{
        getSign,
        setSign,
        setTurn,
        getTurn
    }
}

const boardController = (()  => {
    let board = new Array('','','','','','','','','');
    let htmlGrid = Array.from(document.querySelectorAll('.boardSquare'));

        const fillBoard = (index, value) => {
        board[index] = value;
    };

    const updateGrid = () => {
        for(i in htmlGrid){
             htmlGrid[i].innerText = board[i].toUpperCase();
        }
    }
    updateGrid();
    const clearGrid = () => {
        for(i in board){board[i] = '';}
        updateGrid();
    }
    const getCell = (index) => board[index];
    
    const checkWinner = () => {

        let winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
          ];
        
        if(winConditions.some((key) => key.every((index) => boardController.getCell(index) === 'X' ))){
            console.log('GANA X');
            return true;
        }else if(winConditions.some((key) => key.every((index) => boardController.getCell(index) === 'O' ))){
            console.log('GANA O');
            return true;
        }else if(board.every((key) => key == 'X' || key == 'O')){
            console.log('DRAW')
            return true;
        } else{ 
            return false;
        }
    }
    return { fillBoard, updateGrid, clearGrid, checkWinner, getCell, board, htmlGrid }
})();

const gameController = (() => {
    let player1 = player('X',true);
    let player2 = player('O');
    let round = 0;
    const changeSign = (sign) => {
        if (sign == 'X') {
            player1.setSign('X', true);
            player2.setSign('O');
        }
        else if (sign == 'O') {
            player1.setSign('O', true);
            player2.setSign('X');
        }
        else throw 'Incorrect sign';
        endGame()
    }
    const endGame = () => {
        boardController.clearGrid();
        round = 0;
    }
    const playGame = (index) => {
        let player = round % 2 == 0 ? player1 : player2;
        boardController.fillBoard(index,player.getSign());
        boardController.updateGrid();
        return boardController.checkWinner() == true ? endGame():round++;
    }

    return{changeSign, playGame}
})();

start();
gameController.changeSign('X');




