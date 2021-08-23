function start() {
    let words = document.querySelectorAll(".title--letters");

    setTimeout(() => {
        Array.from(words).forEach((word,index) => {
            setTimeout(() => {
                word.classList.toggle("ttshow");
            }, index*500);
        });
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
        document.querySelector('.mainGame--selectEnemy').style.display = 'flex';
        Array.from(document.querySelectorAll('.pictures--simple')).forEach(key => {
            key.addEventListener('click', (e) => {
                document.querySelector('.mainGame--selectEnemy').style.display = 'none';
                document.querySelector(".mainGame--board").style.display = "flex";

                // Add functionality to the X and O buttons
                Array.from(document.querySelectorAll('#changePlayer')).forEach(
                (key) => key.addEventListener('click', (e) => {
                    gameController.changeSign(e.target.innerText);
                    })
                );
                if(e.target.dataset.ishuman == 'true'){
                    Array.from(document.querySelectorAll('.boardSquare')).forEach(
                        key => key.addEventListener('click', (e) => { 
                            e.target.innerText != '' ? console.log('Square Already Filled'):gameController.playGame(e.target.dataset.index)
                        })
                    )
                }else{
                    document.querySelector('.difficulty--select').style.display='block';
                    Array.from(document.querySelectorAll('.boardSquare')).forEach(
                        key => key.addEventListener('click', (e) => { 
                            if(e.target.innerText == ''){
                                gameController.playGame(e.target.dataset.index);
                                gameController.getStatus() ? gameController.bestMovement():false;
                            }else{
                                console.log('Square Already Filled')
                            }
                        })
                    )
                }
                document.querySelector('.gameOptions--restartGame').addEventListener('click', () => { 
                window.location.reload();
                })
            })
        })
    }, 6500);
    document.querySelector('#vline').classList.toggle('title--vline');
}

const player = (sign) => {
    let _sign = sign;

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

    return{
        getSign,
        setSign,
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
            return 'X';
        }else if(winConditions.some((key) => key.every((index) => boardController.getCell(index) === 'O' ))){
            return 'O';
        }else if(board.every((key) => key == 'X' || key == 'O')){
            return 'DRAW';
        } else{ 
            return false;
        }
    }
    const getBoard = () => board;
   
    return {fillBoard, updateGrid, clearGrid, checkWinner, getCell, getBoard}
})();

const gameController = (() => {
    let player1 = player('O',true);
    let player2 = player('X');
    let round = 0;
    let playing = false;

    const changeSign = (sign) => {
        if (player1.getSign() != 'X' && sign == 'X') {
            player1.setSign('X', true);
            player2.setSign('O');
            scores['X'] = -10;
            scores['O'] = 10;
            resetValue();
            endGame();
        }
        else if (player1.getSign() != 'O' && sign == 'O') {
            player1.setSign('O', true);
            player2.setSign('X');
            scores['X'] = 10;
            scores['O'] =-10;
            resetValue();
            endGame();
        }
        else if(sign != 'O' && sign != 'X') {
            throw 'Incorrect sign';
        }
    }

    const updateScore = (sign) => {
       document.querySelector(`.p-${sign}`).innerText++;
        endGame();
    }

    const resetValue = () => {
       document.querySelector(`.p-X`).innerText = 0;
       document.querySelector(`.p-O`).innerText = 0;
    }
    const endGame = () => {
        boardController.clearGrid();
        round = 0;
        playing = false;
    }
    const playGame = (index) => {
        playing = true;
        let player = round % 2 == 0 ? player1.getSign() : player2.getSign();
        boardController.fillBoard(index,player);
        boardController.updateGrid();
        if(boardController.checkWinner() != false){
            if(boardController.checkWinner() == 'DRAW'){
                endGame()
                document.querySelector('.winner').innerText = `¡Its a Draw!`
            }else{
                updateScore(player);
                document.querySelector('.winner').innerText = `Winner is ${player}`
            }
        }else{
            round++;
        }
    }

    let scores = {
        'X' : 10,
        'O' : -10,
        'DRAW' : 0,
    }

    const bestMovement = () => {
        let bestScore = -Infinity;
        let move;

        for(let i  = 0; i < 9; i++){
            if(boardController.getCell(i) == ''){
                boardController.fillBoard(i,player2.getSign())
                let score = miniMax(boardController.getBoard(), 0, false);
                boardController.fillBoard(i,'');
                if(score > bestScore){
                    bestScore = score;
                    move = i;
                }
            }
        }

        difficulty(move);
    }

    const miniMax = (board, depth, maximizing) => { 
        let winner = boardController.checkWinner();
        if(winner != false){
            return scores[winner]
        }

        if(maximizing){
            let bestScore = -Infinity;
            for(let i = 0; i < 9; i++){
                if(boardController.getCell(i) == ''){
                    boardController.fillBoard(i,player2.getSign())
                    let score = miniMax(board,depth + 1, false) - depth;
                    boardController.fillBoard(i,'');
                    if(score > bestScore){
                        bestScore = score;
                    }
                }
            }
            return bestScore;
        }else {
            let bestScore = Infinity;
            for(let i = 0; i < 9; i++){
                if(boardController.getCell(i) == ''){
                    boardController.fillBoard(i,player1.getSign())
                    let score = miniMax(board,depth + 1, true) + depth;
                    boardController.fillBoard(i,'');
                    if(score < bestScore){
                        bestScore = score;
                    }
                }
            }
            return bestScore;
        }
    }
    const getStatus = () => playing;

    const playRandom = () => {
        let available = [];
        for(let i = 0; i < 9; i++){
            boardController.getCell(i) == '' ? available.push(i):false;
        }
        playGame(available[Math.floor(Math.random()*available.length)]);
        available = [];
    }

    const difficulty = (move) => {
        actualDif = document.querySelector('#levels').value;

        values = {
            'easy' : 0.1,
            'medium' : 0.5,
            'hard' : 0.8,
            'unbeatable' : 1,
        }
        Math.random() > values[actualDif] ? playRandom():playGame(move);
    }
    return{changeSign, playGame, endGame, bestMovement, getStatus, resetValue}
})();

start();
gameController.changeSign('X');