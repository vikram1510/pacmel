/* eslint-disable brace-style */

class Ghost {
  constructor(name){
    this.name = name
    this.pos = null
    this.initialPos = null
    this.lastPos = null
    this.moving = true
    this.moveId = null
    this.class = name
    this.speed = ghostSpeed
  }

  filterGhostMoves(posArray, move){

    let nextPos = null
    

    switch (move) {

      case 'left': 
        nextPos = nextPosLeft(this.pos)
        break

      case 'up':
        nextPos = nextPosUp(this.pos)
        break

      case 'right':
        nextPos = nextPosRight(this.pos)
        break

      case 'down':
        nextPos = nextPosDown(this.pos)
        break

      default:
        return null

    }

    if (!isNextPosWall(nextPos) && nextPos !== this.lastPos) {
      const directionObject = { pos: nextPos, direction: move }
      posArray.push(directionObject)
    }
    // console.log(move, nextPos, posArray)
    return posArray

  }

}

class Level {
  constructor(level, dotArray, pillsArray, characterPositions){
    this.level = level
    this.dotArray = dotArray
    this.pillsArray = pillsArray
    this.remainingDots = dotArray.length - pillsArray.length
    // this.remainingDots = 15
    this.initialPos = characterPositions
  }
}

//Declare Pacman
let initialPacmanPos
const pacmanInitialLives = 5
const pacman = { pos: initialPacmanPos, lives: pacmanInitialLives, moveId: null, speed: 10 }

const width = 20
let cells = []
let livesUl
const ghostMoves = ['left','up','right','down']

//This array describes the positions of all the dots in the grid (can be generated using level editor)
const level1Dots = [21, 41, 61, 81, 101, 121, 141, 161, 181, 201, 221, 241, 261, 281, 301, 321, 341, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 358, 338, 318, 298, 278, 258, 238, 218, 198, 178, 158, 138, 118, 98, 78, 58, 38, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 43, 63, 83, 103, 123, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 159, 142, 140, 56, 76, 96, 116, 136, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 66, 67, 68, 71, 72, 73, 106, 107, 108, 111, 112, 113, 344, 324, 304, 305, 306, 307, 327, 347, 355, 335, 315, 314, 313, 312, 332, 352, 262, 263, 264, 244, 224, 225, 226, 227, 247, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 253, 233, 213, 193, 173, 206, 186, 166, 217, 216, 215, 214, 170, 190, 210, 230, 250]
const level2Dots = [56, 43, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 152, 153, 154, 155, 156, 157, 158, 138, 118, 98, 78, 58, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 25, 24, 23, 22, 21, 41, 61, 81, 101, 121, 161, 181, 201, 221, 241, 261, 281, 301, 321, 341, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 358, 338, 318, 298, 278, 258, 238, 218, 198, 178, 217, 216, 215, 214, 213, 212, 211, 210, 209, 208, 206, 205, 204, 203, 202, 184, 164, 195, 175, 168, 188, 151, 171, 191, 207, 228, 248, 268, 288, 308, 328, 348, 351, 331, 311, 291, 271, 251, 231, 131, 111, 91, 71, 51, 48, 68, 88, 108, 128, 26, 46, 66, 86, 106, 105, 104, 103, 83, 63, 53, 73, 93, 113, 114, 115, 116, 96, 76, 257, 256, 255, 254, 253, 273, 293, 313, 333, 353, 355, 335, 315, 316, 317, 304, 324, 344, 303, 302, 242, 243, 244, 245, 246, 266, 286, 306, 326, 346, 240, 259, 119, 100]

const level1  = new Level(1, level1Dots, [305, 313, 210, 107], { pacman: 30, ghosts: [67, 72, 375] })
const level2  = new Level(2, level2Dots, [304, 315, 142, 157], { pacman: 369, ghosts: [148, 149, 150] })

// all levels stored in array
const levels = [level1, level2]
let currentLevel = 1

let lastKeyPressed = null, bufferMove = null, powerPillId = null

// debug flag to show grid numbers
const showNumbers = false

let ghostSpeed = 15
let score = 0, scoreSpan

// Difficulty level stored in local storage
const difficulties = ['easy', 'medium', 'hard']
let difficulty = localStorage.getItem('difficulty')
if (!difficulty) difficulty = 'medium'

// Declare Ghosts
const ghostRed = new Ghost('red-guy')
const ghostPink = new Ghost('pinky')
const ghostYellow = new Ghost('yellow')
let ghosts = [ghostRed, ghostPink, ghostYellow]

// This stage variable is changed throughout the game (e.g. gamePlay, gameOver etc.)
let stage = 'gameStart Menu'

// switch to false for level editor for dev purposes
const gameMode = true

// variable to store dom element
let overlay

let mute = false

// This is where it all starts
window.addEventListener('load', () => {
  
  if (gameMode){

    setupPacman(level1)

    setCharacterPositions(level1)
    
    initialPlacement()
  
    setupControls()

  } else {
    
    document.querySelector('.start-menu').style.display = 'none'
   
    setupPacman(level1)
   
    levelEditor()
    
  }


})

// This function sets up the given level; entire grid, location of dots, walls etc. and initialises the Lives too
function setupPacman(level) {
  const gameGrid = document.querySelector('.game')
  gameGrid.innerHTML = ''
  cells = []
  document.getElementById('levelLabel').innerHTML = 'Level ' + level.level

  for (let i = 0; i < width ** 2; i++) {
    const cell = document.createElement('div')
    const pacmanDiv = document.createElement('div')
    pacmanDiv.classList.add('pacman-div')
    if (showNumbers) pacmanDiv.textContent = i

    if (gameMode){
      if (level.pillsArray.includes(i)) cell.classList.add('pill')
      else if (level.dotArray.includes(i)) cell.classList.add('dot')
      else cell.classList.add('wall')
    }
    else cell.classList.add('wall')

    cell.style.transition = '1s'
    cell.appendChild(pacmanDiv)
    cells.push(cell)
    gameGrid.appendChild(cell)
  }

  if (currentLevel === 1){
    if (livesUl) livesUl.innerHTML = ''
    livesUl = document.querySelector('ul.lives')
    for (let i = 0; i < pacman.lives; i++){
      const lifeLi = document.createElement('li')
      lifeLi.classList.add('pacman-life')
      livesUl.appendChild(lifeLi)
    }
  
    scoreSpan = document.getElementById('score')
  }

}

// Here is the event listener for all arrow key controls at different stages of the game
// using the stage variable
// if stage is gamePlay, then arrow keys are used to control Pacman
// if stage is gameStart then arrow keys are used to navigate the start Menu etc.
// Music controls are available at all stages of the game
function setupControls() {

  document.addEventListener('keyup', (e) => {
    e.preventDefault()
    console.log(stage)

    // debug purposes
    if (e.key === 'q') collision()

    // spacebar for music (start/pause/play)
    if (e.keyCode === 32) controlMusic()

    // 'N' for next song
    else if (e.keyCode === 78) nextSong()

    // 'M' for toggling mute switch for sound effects
    else if (e.keyCode === 77){
      if (mute) {
        mute = false
        musicAnimation('Sound Effects ON')
      } else {
        mute = true
        musicAnimation('Sound Effects OFF')
      }
    }

    if (stage.includes('gameStart')) gameStart(e.keyCode)

    // 'P' to start new game if stage is newGame
    else if (stage === 'newGame') {
      if (e.keyCode === 80) newGame()
    }

    // Actual GamePlay, arrow keys or WSAD to move pacman
    else if (stage === 'gamePlay' || stage === 'powerPill'){

      // Initial ghost movement is triggered by Pacman
      moveGhosts()

      // Can't press the same key twice in a row
      if (lastKeyPressed !== e.keyCode) {
  
        lastKeyPressed = e.keyCode
  
        if (e.keyCode === 39 || e.keyCode === 68) pacmanMove(nextPosRight, 'rotate(0deg)')
  
        else if (e.keyCode === 37 || e.keyCode === 65) pacmanMove(nextPosLeft, 'rotate(180deg)')
  
        else if (e.keyCode === 38 || e.keyCode === 87) pacmanMove(nextPosUp, 'rotate(270deg)')
  
        else if (e.keyCode === 40 || e.keyCode === 83) pacmanMove(nextPosDown, 'rotate(90deg)')
  
      }

    }

  })

}

// this function cycles through the ghosts array and sets their movement interval at the given ghost speed
function moveGhosts(){

  ghosts.forEach(ghost => {

    // if ghosts are already moving then dont set another interval (when ghost.moving = false)
    if (ghost.moving) {

      ghost.translateVal = 0
      let possibleGhostMoves, moveIndex, move, translate, moveComplete = true, translateVal = 0

      ghost.moveId = setInterval(() => {

        // get the next move if move is complete
        if (moveComplete){

          possibleGhostMoves = ghostMoves
            .reduce(ghost.filterGhostMoves.bind(ghost), [])

          possibleGhostMoves = pickBestMove(possibleGhostMoves, ghost.pos)
        
          ghost.lastPos = ghost.pos
          
          moveIndex = Math.floor(Math.random() * possibleGhostMoves.length)
          
          move = possibleGhostMoves[moveIndex]

          translate = getTranslation(move.direction)

          moveComplete = false
        }

        // using transform translation for smooth movement across the gird
        // if the ghost has translated 75% into the next cell then move is considered complete
        // the translate value is incremented by 5% everytime
        if (translateVal < 75){
          if (pacman.pos === ghost.pos) collision(ghost)
          translateVal += 5
          const transformString = 'rotate(0deg)' + `${translate.string}(${translate.sign}${translateVal}%)`
          cells[ghost.pos].firstChild.style.transform = transformString
        } else {
          cells[ghost.pos].firstChild.classList.remove(ghost.class)
          ghost.pos = move.pos

          cells[ghost.pos].firstChild.classList.add(ghost.class)
          cells[ghost.pos].firstChild.style.transform = 'rotate(0deg)' + `${translate.string}(0%)`
  
          if (pacman.pos === ghost.pos) collision(ghost)
          translateVal = 0
          moveComplete = true
        }

      }, ghost.speed)
      ghost.moving = false
    }
  })

}

// The movement of pacman is similar to ghost, pacman is required to rotate at every turn
// nextPosFunc is a function which takes pacman current pos as input and outputs the next pos
// bufferMove allows the player to press the arrow key early and pacman will move when that move is available
function pacmanMove(nextPosFunc, rotation) {

  const nextPosIsWall = isNextPosWall(nextPosFunc(pacman.pos))
  
  if (!nextPosIsWall) clearInterval(pacman.moveId)
  else {
    bufferMove = { nextPosFunc: nextPosFunc, rotation: rotation }
    return
  }

  if (bufferMove){
    if (!nextPosIsWall) bufferMove = null
  }

  let transform = 0
  cells[pacman.pos].firstChild.style.transform = rotation + 'translateX(0)'

  pacman.moveId = setInterval(() => {

    if (bufferMove){
      if (!isNextPosWall(bufferMove.nextPosFunc(pacman.pos))) {
        nextPosFunc = bufferMove.nextPosFunc
        rotation = bufferMove.rotation
        bufferMove = null
      }
    }

    const nextPosIsWall = isNextPosWall(nextPosFunc(pacman.pos))

    if (!nextPosIsWall){
      if (transform < 75) {
        transform += 5

        ghosts.forEach(ghost => {
          if (ghost.pos === pacman.pos)  collision(ghost)
          else if (ghost.pos === nextPosFunc(pacman.pos))  collision(ghost)
        })

        cells[pacman.pos].firstChild.style.transform = rotation + `translateX(${transform}%)`
      } else {
        cells[pacman.pos].firstChild.classList.remove('pacman')
        pacman.pos = nextPosFunc(pacman.pos)

        if (cells[pacman.pos].classList.contains('dot')) {
          cells[pacman.pos].classList.remove('dot')
          levels[currentLevel - 1].remainingDots--
          updateScore(10)
          
          if (levels[currentLevel - 1].remainingDots === 0) winLevel()
        } else if (cells[pacman.pos].classList.contains('pill')) {
          if (!mute) new Audio('music/pacman_eatfruit.wav').play()
          cells[pacman.pos].classList.remove('pill')
          powerPillMode()
        }
        cells[pacman.pos].firstChild.classList.add('pacman')
        cells[pacman.pos].firstChild.style.transform = rotation + 'translateX(0)'
        transform = 0
      }
    }
    

  }, pacman.speed)

}

function setCharacterPositions(level){
  initialPacmanPos = level.initialPos.pacman
  pacman.pos = initialPacmanPos
  ghosts.forEach((ghost, index) => {
    ghost.initialPos = level.initialPos.ghosts[index]
    ghost.pos = ghost.initialPos
  })
}

function setDifficulty() {

  ghosts.forEach(ghost => cells[ghost.pos].firstChild.classList.remove(ghost.class))
  if (difficulty === 'easy') {
    ghosts = [ghostRed, ghostYellow]
    ghostSpeed = 15
    ghosts.forEach(ghost => ghost.speed = ghostSpeed)
  }
  else if (difficulty === 'medium'){
    ghosts = [ghostRed, ghostYellow, ghostPink]
    ghostSpeed = 15
    ghosts.forEach(ghost => ghost.speed = ghostSpeed)

  } else if (difficulty === 'hard'){
    ghosts = [ghostRed, ghostYellow, ghostPink]
    ghostSpeed = 10
    ghosts.forEach(ghost => ghost.speed = ghostSpeed)
  }
  initialPlacement()

}

function stopCharacters() {
  ghosts.forEach(ghost => clearInterval(ghost.moveId))
  clearInterval(pacman.moveId)
}

// in Power Pill mode all ghosts turn blue, weak and slow
// Power pill mode lasts 6 seconds, then stage is changed back to gamePlay in the timeOut
function powerPillMode(){
  stage = 'powerPill'
  ghosts.forEach(ghost => {
    cells[ghost.pos].firstChild.classList.remove(ghost.name)
    cells[ghost.pos].firstChild.classList.add('weak-ghost')
    ghost.class = 'weak-ghost'
    ghost.lastPos = null
    clearInterval(ghost.moveId)
    ghost.speed = 50
    ghost.moving = true
    moveGhosts()
  })

  if (powerPillId) clearTimeout(powerPillId)
  
  powerPillId = setTimeout(() => {
    ghosts.forEach((ghost) => {
      cells[ghost.pos].firstChild.classList.remove(ghost.class)
      clearInterval(ghost.moveId)
      ghost.speed = ghostSpeed
      ghost.moving = true
      ghost.class = ghost.name
      ghost.lastPos = null
      moveGhosts()
      cells[ghost.pos].firstChild.classList.add(ghost.class)
    })
    stage = 'gamePlay'
  },6000)
}

// if a collision happens  in powerPill mode, pacman eats ghosts
function powerPillCollision(deadGhost){
  if (!mute) new Audio('music/pacman_eatghost.wav').play()
  updateScore(100)

  // stop dead ghost and show the pacman points animation (+100)
  clearInterval(deadGhost.moveId)
  cells[deadGhost.pos].firstChild.classList.remove(deadGhost.class)
  cells[deadGhost.pos].classList.add('ghost-kill')
  setTimeout(() => cells[deadGhost.pos].classList.remove('ghost-kill'), 500)
  ghosts = ghosts.filter(ghost => ghost !== deadGhost)

  // reset the dead ghost after 3 seconds
  setTimeout(() => {
    deadGhost.moving = true
    deadGhost.class = deadGhost.name
    deadGhost.speed = ghostSpeed
    deadGhost.pos = deadGhost.initialPos
    ghosts.push(deadGhost)
  }, 3000)

}

function collision(ghost) {

  if (stage === 'collision') return

  if (stage !== 'gamePlay' && stage !== 'powerPill') return

  if (!mute) new Audio('music/pacman_death.wav').play()

  if (stage === 'powerPill' && ghost.class === 'weak-ghost') {
    powerPillCollision(ghost)
    return
  }

  stage = 'collision'
  pacman.lives--

  livesUl.children[pacman.lives].classList.remove('pacman-life')
  
  cells[pacman.pos].firstChild.classList.remove('pacman')
  cells[pacman.pos].firstChild.classList.add('death')

  if (pacman.lives === 0)  {
    gameOver(ghost)
    return
  }

  stopCharacters()

  setTimeout(() => {

    cells[pacman.pos].firstChild.classList.remove('death')
    ghosts.forEach(ghost => {
      cells[ghost.pos].firstChild.classList.remove(ghost.class)
      ghost.moving = true
      ghost.pos = ghost.initialPos
    })
    pacman.pos = initialPacmanPos
    lastKeyPressed = null
    
    if (pacman.lives === 0) {
      gameOver()
    } else {
      initialPlacement()
      stage = 'gamePlay'
    }

  }, 900)
}

function gameOver(killerGhost){
  stage = 'gameOver'
  clearInterval(pacman.moveId)
  clearInterval(killerGhost.moveId)
  
  setTimeout(() => {
    killerGhost.moving = true
    moveGhosts()
    
    cells[pacman.pos].firstChild.classList.remove('death')
    const gameOverElements = document.querySelectorAll('.game-over')
    gameOverElements.forEach(element => element.style.display = 'block')

    setTimeout(() => {
      gameOverElements[0].style.transform = 'translateY(300px)'
      gameOverElements[1].style.opacity = '0.5'
      stage = 'newGame'
      setTimeout(() => {
        if (stage === 'newGame') document.querySelector('.game-over-msg').style.display = 'block'
      },14000)
    },100)

  }, 900)

}

let startMenuOption = 'playGame'

function gameStart(keyCode){
  const selectors = document.querySelectorAll('.start-menu li > span')
  overlay = document.querySelector('.start-menu')
  const box = document.querySelector('.start-menu .box')
  const selectOptions = document.querySelector('.select-option')
  const difficultyMenu = document.querySelector('.difficulty')
  const difficultyOptions = document.querySelectorAll('.difficulty li')
  
  if (stage.includes('Menu')) {
    if (keyCode === 38) {
      selectors[0].classList.add('selector')
      selectors[1].classList.remove('selector')
      startMenuOption = 'playGame'
    }

    else if (keyCode === 40) {
      selectors[1].classList.add('selector')
      selectors[0].classList.remove('selector')
      startMenuOption = 'chooseDifficulty'
    }
  }

  else if (stage.includes('Difficulty')) {
    if (keyCode === 37) {

      
      let difficultyIndex = difficulties.indexOf(difficulty)
      difficultyOptions[difficultyIndex].classList.remove('selected')

      if (difficultyIndex - 1 < 0) difficultyIndex = difficulties.length - 1
      else difficultyIndex -= 1

      difficulty = difficulties[difficultyIndex]
      localStorage.setItem('difficulty', difficulty)
      difficultyOptions[difficultyIndex].classList.add('selected')

    }

    else if (keyCode === 39) {

      const difficultyOptions = document.querySelectorAll('.difficulty li')
      let difficultyIndex = difficulties.indexOf(difficulty)
      difficultyOptions[difficultyIndex].classList.remove('selected')

      if (difficultyIndex + 1 > difficulties.length - 1) difficultyIndex = 0
      else difficultyIndex += 1

      difficulty = difficulties[difficultyIndex]
      localStorage.setItem('difficulty', difficulty)
      difficultyOptions[difficultyIndex].classList.add('selected')

    }
  }

  if (keyCode === 13){
    
    if (startMenuOption === 'playGame') {
      setTimeout(() => {
        selectors[0].style.transform = 'translateY(-2000px)'
        setTimeout(() => {
          box.style.opacity = '0'
          setTimeout(() => {
            box.style.display = 'none'
            box.style.opacity = '1'
            selectors[0].style.transform = ''
            levelTransition(1)
          }, 750)
        }, 1000)
      }, 200)

      setDifficulty()

    }
    else if (startMenuOption === 'chooseDifficulty' && stage.includes('Menu')){
      difficultyOptions[difficulties.indexOf(difficulty)].classList.add('selected')
      stage = 'gameStart Difficulty'
      selectOptions.style.display = 'none'
      difficultyMenu.style.display = 'flex'
    }
    else if (startMenuOption === 'chooseDifficulty' && stage.includes('Difficulty')){
      selectOptions.style.display = 'flex'
      difficultyMenu.style.display = 'none'
      stage = 'gameStart Menu'
    }
     
  }

}

// set up a new game
function newGame(){
  const gameOverElements = document.querySelectorAll('.game-over')
  const gameOverMsg = document.querySelector('.game-over-msg')
  gameOverMsg.style.display = 'none'
  gameOverElements.forEach(element => element.style.display = 'none')
  gameOverElements[0].style.transform = ''
  gameOverElements[1].style.opacity = '0'
  const winningScreen = document.querySelector('.winning')
  const box = document.querySelector('.start-menu .box')
  const startMenu = document.querySelector('.start-menu')
  startMenu.style.display = 'flex'
  winningScreen.style.display = 'none'
  box.style.display = 'flex'
  cells[pacman.pos].style.transform = ''
  currentLevel = 1
  pacman.lives = pacmanInitialLives
  stopCharacters()
  setupPacman(level1)
  setCharacterPositions(level1)
  initialPlacement()
  lastKeyPressed = null
  stage = 'gameStart Menu'
  ghosts.forEach(ghost => ghost.moving = true)
  levels.forEach((level) => level.remainingDots = level.dotArray.length - level.pillsArray.length)
}

function winLevel(){
  stage = 'nextLevel'
  currentLevel++
  const level =  levels[currentLevel - 1]
  stopCharacters()
  setTimeout(() => {
    cells[pacman.pos].style.transform = 'translateY(-750px)'
    if (currentLevel <= levels.length) {
      setTimeout(() => {
        cells[pacman.pos].style.transform = ''
        setupPacman(level)
        setCharacterPositions(level)
        initialPlacement()
        levelTransition(level.level)
        ghosts.forEach(ghost => ghost.moving = true)
        lastKeyPressed = null
      }, 2000)
    } else {
      winGame()
    }
  }, 1000)
  
}

function winGame(){
  overlay.style.display = 'flex'
  const winningScreen = document.querySelector('.winning')
  winningScreen.style.display = 'flex'
  setTimeout(() => {
    winningScreen.style.opacity = '1'
  },1000)
  stage = 'newGame'
}

function levelTransition(levelNumber){

  overlay.style.display = 'flex'
  const box = document.querySelector('.start-menu .box')
  const stageTransition = document.querySelector('.stage-transition')
  const stageh2 = document.querySelector('.stage-transition h2')

  stageh2.textContent = `Level ${levelNumber}`
  box.style.display = 'none'
  stageTransition.classList.remove('hide')
  

  setTimeout(() => {
    stageTransition.style.opacity = 1
    setTimeout(() => {
      stageTransition.classList.add('stage-animation')
      setTimeout(() => {
        stageTransition.classList.remove('stage-animation')
        stageTransition.classList.add('hide')
        stageTransition.style.opacity = 0
        overlay.style.display = 'none'
        stage = 'gamePlay'
      }, 500)
    }, 1500)
  }, 100)




}

function updateScore(points){
  score += points
  scoreSpan.textContent = score
}

function initialPlacement(){
  cells[initialPacmanPos].firstChild.classList.add('pacman')
  ghosts.forEach(ghost => {
    cells[ghost.initialPos].firstChild.classList.add(ghost.class)
  })
}

function nextPosRight(characterPos){
  const nextPos = characterPos + 1
  const xCoord = characterPos % width
  if (xCoord === width - 1) return nextPos - width
  else return nextPos
}

function nextPosLeft(characterPos){
  const nextPos = characterPos - 1
  const xCoord = characterPos % width
  if (xCoord === 0) return nextPos + width
  else return nextPos
}

function nextPosUp(characterPos){
  return characterPos - width
}

function nextPosDown(characterPos){
  return characterPos + width
}

function isNextPosWall(nextPos){
  return cells[nextPos].classList.contains('wall')
}

function getTranslation(direction){

  switch (direction) {
    case 'left':
      return { string: 'translateX', sign: '-' }
 
    case 'right':
      return { string: 'translateX', sign: '+' }

    case 'up':
      return { string: 'translateY', sign: '-' }

    case 'down':
      return { string: 'translateY', sign: '+' }
  }

}

function pickBestMove(possibleMoves, currentPos){

  if (stage === 'gameOver') return possibleMoves

  const xPacman = pacman.pos % width
  const yPacman = Math.floor(pacman.pos / width)

  const xBeforeMove = currentPos % width
  const yBeforeMove = Math.floor(currentPos / width)

  const xDistanceBefore = Math.abs(xPacman - xBeforeMove)
  const yDistanceBefore = Math.abs(yPacman - yBeforeMove)

  const bestMoves = possibleMoves.filter(move => {

    const xAfterMove = move.pos % width
    const yAfterMove = Math.floor(move.pos / width)

    const xDistanceAfter = Math.abs(xPacman - xAfterMove)
    const yDistanceAfter = Math.abs(yPacman - yAfterMove)

    if (move.direction === 'left' || move.direction === 'right') {

      if (stage !== 'powerPill'){
        if (xDistanceAfter < xDistanceBefore) return move
      } 
      else {
        if (xDistanceAfter > xDistanceBefore) return move
      }
      
    } else if (move.direction === 'up' || move.direction === 'down') {

      if (stage !== 'powerPill'){
        if (yDistanceAfter < yDistanceBefore) return move
      } 
      else {
        if (yDistanceAfter > yDistanceBefore) return move
      }
    }

  })


  if (bestMoves.length > 0){
    if (bestMoves.length < possibleMoves.length) return bestMoves
  }

  return possibleMoves

}

function levelEditor() {
  let select = false
  const array = new Set()
  const cells = document.querySelectorAll('.game .pacman-div')

  cells.forEach(cell => {
    cell.addEventListener('mouseover', (e) => {
      if (select) {
        e.currentTarget.style.backgroundColor = 'black'
        array.add(Array.from(cells).indexOf(e.currentTarget))
      }
    })

    cell.addEventListener('click', (e) => {
      e.currentTarget.style.backgroundColor = 'black'
      array.add(Array.from(cells).indexOf(e.currentTarget))
      if (select) select = false
      else select = true
    })

    cell.addEventListener('dblclick', (e) => {
      // console.log(e.currentTarget)
      e.currentTarget.style.backgroundColor = 'rgb(75, 75, 75)'
      array.delete(Array.from(cells).indexOf(e.currentTarget))
    })

  })

  document.addEventListener('keyup', e => {
    console.log('levelEditor')
    if (e.key === 'q') console.log(String(Array.from(array)))
  })

}

let audioPlaying = false
const audioFiles = ['dreams', 'theme', 'tranquility']
let audioIndex = Math.floor(Math.random() * audioFiles.length)
const currentAudio = new Audio('music/' + audioFiles[audioIndex] + '.mp3')
currentAudio.addEventListener('ended', nextSong)


function controlMusic() {

  musicAnimation(audioFiles[audioIndex] + '.mp3')

  if (!audioPlaying){
    currentAudio.play()
    audioPlaying = true
  }
  else {
    currentAudio.pause()
    audioPlaying = false
  }
}

function getNextAudio(){
  audioIndex += 1
  if (audioIndex > audioFiles.length - 1) audioIndex = 0
  const songName = audioFiles[audioIndex] + '.mp3'
  currentAudio.src = 'music/' + songName
  currentAudio.currrentTime = 0
  currentAudio.play()
  audioPlaying = true
}

let musicAnimationId

function musicAnimation(songName) {
  const musicDiv = document.querySelector('.music')
  const musicLabel = document.querySelector('#music')
  musicDiv.style.opacity = 0.8
  musicLabel.textContent = songName

  clearTimeout(musicAnimationId)
  musicAnimationId = setTimeout(() => musicDiv.style.opacity = 0, 3000)
}

function nextSong(){
  getNextAudio()
  musicAnimation(audioFiles[audioIndex] + '.mp3')
}
