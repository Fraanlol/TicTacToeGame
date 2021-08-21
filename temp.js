document.querySelector(".mainGame--board").style.display = "flex";
Array.from(document.querySelectorAll('#changePlayer')).forEach(
    (key) => key.addEventListener('click', (e) => {
        gameController.changeSign(e.target.innerText);
        })
    );
Array.from(document.querySelectorAll('.boardSquare')).forEach(
    key => key.addEventListener('click', (e) => { 
        e.target.innerText != '' ? console.log('estaLleno'):gameController.playGamePvp(e.target.dataset.index)
    })
)
document.querySelector('.gameOptions--restartGame').addEventListener('click', () => { 
    gameController.endGame();
})