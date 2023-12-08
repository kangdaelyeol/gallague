// import { Hero, EnemySet } from './gameobjects.js'
import { Hero } from './gameobjects/hero.js'
import { EnemySet } from './gameobjects/EnemySet.js'
// import './gameobjects.js'
//1. get the canvas reference
const canvas = document.getElementById('myCanvas')
let isStart = false
let gameLoopId = null
//2. set the context to 2D to draw basic shapes
let ctx = null
let hero = null
let enemySet = null

const paintBackGround = (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const setCanvasSize = () => {
    const screenWidth = document.body.clientWidth
    const screenHeight = window.innerHeight
    canvas.width = screenWidth
    canvas.height = screenHeight
    hero?.setCanvasSize(screenWidth, screenHeight)
    enemySet?.setCanvasSize(screenWidth, screenHeight)
}

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
    )
    enemySet = new EnemySet()
    setCanvasSize()

    function activeFrame() {
        // Set Canvas Background
        paintBackGround(ctx)
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
    paintBackGround(ctx)
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

function init() {
    ctx = canvas.getContext('2d')
    setCanvasSize()
    paintBackGround(ctx)
}

init()
