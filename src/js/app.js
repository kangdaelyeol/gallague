import { Hero } from './gameobjects.js'
import './gameobjects.js'
//1. get the canvas reference
const canvas = document.getElementById('myCanvas')

const MONSTER_TOTAL = 5
const MONSTER_WIDTH = MONSTER_TOTAL * 98
const START_X = (canvas.width - MONSTER_WIDTH) / 2
const STOP_X = START_X + MONSTER_WIDTH
const CANVAS_PADDING_Y = 20
let isStart = false
let gameLoopId = null
//2. set the context to 2D to draw basic shapes
let ctx = canvas.getContext('2d')
let heroImg = null
let enemyImg = null

//3. fill it with the color red
ctx.fillStyle = 'black'

//4. and draw a rectangle with these parameters, setting location and size
ctx.fillRect(0, 0, 1400, 700) // x,y,width, height

function loadAsset(path) {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = path
        img.onload = () => {
            // image loaded and ready to be used
            resolve(img)
        }
    })
}

// use like so

;(async function loadGame() {
    heroImg = await loadAsset('img/hero.png')
    enemyImg = await loadAsset('img/enemyShip.png')
    ctx = canvas.getContext('2d')
    ctx.drawImage(heroImg, canvas.width / 2, canvas.height - 100, 100, 70)
    // ctx.fillRect(canvas.width / 2, canvas.height - 100, 50, 50)
    for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = CANVAS_PADDING_Y; y < 50 * 5 + CANVAS_PADDING_Y; y += 50) {
            ctx.drawImage(enemyImg, x, y)
        }
    }
})()

function runGame() {
    console.log('runGame')
    isStart = true
    const startHeroPositionX = canvas.width / 2
    const startHeroPositionY = canvas.height - 100
    const HeroWidth = 100
    const HeroHeight = 70
    // Init Hero Class
    const hero = new Hero(
        startHeroPositionX,
        startHeroPositionY,
        HeroWidth,
        HeroHeight,
        heroImg,
    )
    gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        hero.active(ctx)
    }, 20)
}

function stopGame() {
    clearInterval(gameLoopId)
    gameLoopId = null
    isStart = false
}

let onKeyDown = function (e) {
    switch (e.keyCode) {
        case 37:
        case 39:
        case 38:
        case 40: // Arrow keys
        case 32:
            e.preventDefault()
            break // Space
        case 82: // R -> reStart
            if (!isStart) {
                runGame()
            }
            break
        case 65:
            stopGame()
            break
        default:
            break // do not block other keys
    }
}

window.addEventListener('keydown', onKeyDown)
