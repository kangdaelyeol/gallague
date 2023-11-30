// draws a red rectangle
//1. get the canvas reference
canvas = document.getElementById('myCanvas')

const MONSTER_TOTAL = 5
const MONSTER_WIDTH = MONSTER_TOTAL * 98
const START_X = (canvas.width - MONSTER_WIDTH) / 2
const STOP_X = START_X + MONSTER_WIDTH
const CANVAS_PADDING_Y = 20
//2. set the context to 2D to draw basic shapes
ctx = canvas.getContext('2d')

//3. fill it with the color red
ctx.fillStyle = 'black'

//4. and draw a rectangle with these parameters, setting location and size
ctx.fillRect(0, 0, 1200, 800) // x,y,width, height

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

;(async function run() {
    const heroImg = await loadAsset('img/hero.png')
    const monsterImg = await loadAsset('img/enemyShip.png')
    ctx = canvas.getContext('2d')
    ctx.drawImage(heroImg, canvas.width / 2, canvas.height - 100)
    for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = CANVAS_PADDING_Y; y < 50 * 5 + CANVAS_PADDING_Y; y += 50) {
            ctx.drawImage(monsterImg, x, y)
        }
    }
    let gameLoopId = setInterval(
        () =>
            function gameLoop() {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = 'black'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            },
        200,
    )
})()

let onKeyDown = function (e) {
    console.log(e.keyCode)
    switch (e.keyCode) {
        case 37:
        case 39:
        case 38:
        case 40: // Arrow keys
        case 32:
            e.preventDefault()
            break // Space
        default:
            break // do not block other keys
    }
}

window.addEventListener('keydown', onKeyDown)
