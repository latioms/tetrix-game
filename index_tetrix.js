document.addEventListener('DOMContentLoaded', () =>{
    // first page
    const anchor = document.getElementsByClassName('anchor')
    const tetris = document.getElementsByClassName('tetris')
    // second page tetris
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const width = 10
    const scoreDisplay = document.querySelector('#score')
    const start = document.querySelector('#start-button')
    let nextRandom = 0
    let timerId
    let score = 0


    if (anchor.length > 0 && tetris.length > 0) {
        anchor[0].addEventListener("click", () => {
            tetris[0].scrollIntoView({ behavior: 'smooth' });
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 38) { // 38 est le code de la touche 'haut'
            event.preventDefault(); // Empêche le défilement
        }
    });

    const lowSpeed = document.querySelector('.lowSpeed') 
    //the testominos
    // const lTestominos = [
    //     [1, width+1, width*2+1,2],
    //     [width , width+1, width*2+1, width*2+2],
    //     [1,width+1, width*2+1, width*2],
    //     [width, width*2, width*2+1,width*2+2]
    // ]

    const lTetrominos = [
        [1, width+1, width*2+1, 2], // Rotation 1
        [width, width+1, width+2, width*2+2], // Rotation 2
        [1, width+1, width*2+1, width*2], // Rotation 3
        [width, width+1, width+2, width*2] // Rotation 4
    ]

    const ztetromino = [
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
    ]

    const tTetrominio = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1], 
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
         [0,1,width,width+1],
         [0,1,width,width+1],
         [0,1,width,width+1],
         [0,1,width,width+1],
    ]

    const iTetromino = [
        [1, width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theTetrominoes = [lTetrominos, ztetromino, tTetrominio, oTetromino, iTetromino]

    let random = Math.floor(Math.random()*theTetrominoes.length)
    let currentPosition = 4
    let currentRotation = 0
    let current = theTetrominoes[random][currentRotation]

    // draw the testominos

function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
    })
}

    
// undraw the testomino
function undraw() {
        current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
    }) 
}

// make tetrominoes draw ward
// vartimerId = setInterval(moveDown, 200)
// // vartmer2id = setInterval(moveLeft, 1000)

// assignes keycodes
function control(e){
    if (!gameOver() && start.textContent !== "Resume") {
        
        if(e.keyCode === 37){
            moveLeft()
        }else if(e.keyCode === 38){
            rotate()
        }
        else if(e.keyCode === 39){
            moveRight()
        }
        else if(e.keyCode === 40){
            moveDown()
        }
    }
}
document.addEventListener('keyup', control)

//move down function
function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}

// freeze function
function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        // start a new tetromino faliing
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
        }
}

// move the tetromino left
function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -= 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition += 1
    }

    draw()
}

function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if(!isAtRightEdge) currentPosition += 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -= 1
    }

    draw()
}


//rotate the testromino

function rotate(){
    undraw()
    currentRotation++
    if(currentRotation === current.length){
        currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
}

// show the nexttetromino in the mini grid display
const displaySquares = Array.from(document.querySelectorAll('.mini-grid div'))
const displayWidth = 4
let displayIndex = 0


// the testrominos without rotation
const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTestromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2+1],// zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], // otetromino
    [1, displayWidth + 1, displayWidth * 2 + 1 ,displayWidth * 3 + 1] //ztetromino
]

// display shapes in the mini-grid
function displayShape() {
// remove any trace of the tertominoin the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
    })

upNextTetrominoes[nextRandom].forEach(index => {
    displaySquares[displayIndex + index].classList .add('tetromino')
})
}

// add functionalities to the start/pause button
start.addEventListener('click', () => {
    if (timerId && !gameOver()){
        clearInterval(timerId)
        timerId = null
        start.textContent = "Resume" // Change the text to "Resume"
    }else{
        draw()
        timerId = setInterval(moveDown, 500)
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
        start.textContent = "Pause" // Change the text back to "Start"
    }
})

// low speed button
lowSpeed.addEventListener('click', ()=> {
    timerId = setInterval(moveDown, 2000)
})

// add score
function addScore(){
    for (let i = 0; i < 199; i += width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if (row.every(index => squares[index].classList.contains('taken'))){
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        
        }
    }
}

//game over
function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = 'game over'
        clearInterval(timerId)

        return true
    } else {
        return false
    }
}

})
//third rotation of t testomino and second rotation of the l testomino
