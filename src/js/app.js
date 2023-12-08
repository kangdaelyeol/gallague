import { Hero, EnemySet } from './gameobjects.js'
import './gameobjects.js'
//1. get the canvas reference
const canvas = document.getElementById('myCanvas')
let isStart = false
let gameLoopId = null
//2. set the context to 2D to draw basic shapes
let ctx = canvas.getContext('2d')
let heroImg = null
let hero = null
let enemySet = null

//3. fill it with the color red
ctx.fillStyle = 'black'

//4. and draw a rectangle with these parameters, setting location and size
ctx.fillRect(0, 0, canvas.width, canvas.height) // x,y,width, height

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

const setCanvasSize = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    canvas.width = screenWidth
    canvas.height = screenHeight
    console.log(hero?.canvasWidth)
    hero?.setCanvasSize(screenWidth, screenHeight)
    enemySet?.setCanvasSize(screenWidth, screenHeight)
}

;(async function loadGame() {
    heroImg = await loadAsset('img/hero.png')
    ctx = canvas.getContext('2d')
    setCanvasSize()
    ctx.drawImage(heroImg, canvas.width / 2, canvas.height - 100, 100, 70)
})()

function runGame() {
    console.log('runGame')
    isStart = true
    const startHeroPositionX = canvas.width / 2
    const startHeroPositionY = canvas.height - 100
    const HeroWidth = 100
    const HeroHeight = 70
    // Init Hero Class
    hero = new Hero(
        startHeroPositionX,
        startHeroPositionY,
        HeroWidth,
        HeroHeight,
        heroImg,
    )
    enemySet = new EnemySet()
    setCanvasSize()

    function activeFrame() {
        // Set Canvas Background
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Interaction between Objects
        hero.active(ctx)
        enemySet.active(ctx)
        enemySet.collisionCheckWithHero(hero)
        enemySet.collisionCheckWithBulletSet(hero.bulletSet)

        // when life is 0
        if (hero.life <= 0) {
            stopGame()
            return
        }
        gameLoopId = requestAnimationFrame(activeFrame)
    }
    activeFrame()
}

function stopGame() {
    cancelAnimationFrame(gameLoopId)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
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
        case 81:
            stopGame()
            break
        default:
            break // do not block other keys
    }
}

const onResize = () => {
    setCanvasSize()
}

window.addEventListener('keydown', onKeyDown)
window.addEventListener('resize', onResize)
