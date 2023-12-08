// import { Hero, EnemySet } from './gameobjects.js'
import { Hero } from './gameobjects/Hero.js'
import { EnemySet } from './gameobjects/EnemySet.js'
// import './gameobjects.js'
//1. get the canvas reference
const canvas = document.getElementById('myCanvas')
let isStart = false
let gameLoopId = null
let roundLoopId = null

//2. set the context to 2D to draw basic shapes
let ctx = null
let hero = null
let enemySet = null

const gameInfo = {
    round: 1,
    bulletLevel: 0,
    score: 0,
}

const paintBackGround = (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const paintInfo = (ctx) => {
    const infoPaddingX = 30
    const infoPaddingY = 60
    const lineHeight = 60
    ctx.fillStyle = 'white'
    ctx.font = '40px Arial'
    ctx.fillText(`Round: ${gameInfo.round}`, infoPaddingX, infoPaddingY)

    ctx.fillText(
        `BulletLevel: ${gameInfo.bulletLevel}`,
        infoPaddingX,
        infoPaddingY + lineHeight,
    )

    ctx.fillText(
        `Score: ${gameInfo.score}`,
        infoPaddingX,
        infoPaddingY + lineHeight * 2,
    )

    // Round
    // bulletLevel
    // Score
}

const setCanvasSize = () => {
    const screenWidth = document.body.clientWidth
    const screenHeight = window.innerHeight
    canvas.width = screenWidth
    canvas.height = screenHeight
    hero?.setCanvasSize(screenWidth, screenHeight)
    enemySet?.setCanvasSize(screenWidth, screenHeight)
}

const initGameInfo = () => {
    gameInfo.round = 0
    gameInfo.bulletLevel = 0
    gameInfo.score = 0
}

function runGame() {
    isStart = true

    // Set Hero Position
    const startHeroPositionX = canvas.width / 2
    const startHeroPositionY = canvas.height - 100
    const HeroWidth = 100
    const HeroHeight = 70

    // initGameInfo
    initGameInfo()

    // Init GameObjects
    hero = new Hero(
        startHeroPositionX,
        startHeroPositionY,
        HeroWidth,
        HeroHeight,
    )
    enemySet = new EnemySet()

    setCanvasSize()

    // Set Round Loop Timer
    roundLoopId = setInterval(() => {
        gameInfo.round++
        enemySet.setRound(gameInfo.round)
    }, 2000)

    // Active Frame
    function activeFrame() {
        // Set Canvas Background
        paintBackGround(ctx)
        // Interaction between Objects
        hero.active(ctx)
        enemySet.active(ctx)
        enemySet.collisionCheckWithHero(hero)
        enemySet.collisionCheckWithBulletSet(hero.bulletSet, gameInfo)
        paintInfo(ctx)

        // when life is 0
        if (hero.life <= 0) {
            stopGame()
            return
        }

        // handle bulletLevel (Temp)
        hero.bulletLevel = Math.floor(gameInfo.score / 10000)
        if (hero.bulletLevel > 4) hero.bulletLevel = 4

        // setLoop Id
        gameLoopId = requestAnimationFrame(activeFrame)
    }
    activeFrame()
}

function stopGame() {
    // Loop Stop
    cancelAnimationFrame(gameLoopId)
    gameLoopId = null
    isStart = false
    clearInterval(roundLoopId)
    roundLoopId = null
    // Paint Stop
    paintBackGround(ctx)
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
