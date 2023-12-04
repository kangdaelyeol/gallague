let movingL = false
let movingR = false
let movingU = false
let movingD = false
let dash = false
const MovingSpeed = 5
let hpDash = 1
const bulletImg = []
let attack = false

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

;(function loadGame() {
    for (let i = 0; i < 5; i++) {
        loadAsset(`img/b0${i + 1}.png`).then((img) => {
            bulletImg[i] = img
        })
    }
})()

//set up the class GameObject
class GameObject {
    constructor(x, y, width, height, path, type) {
        this.x = x
        this.y = y
        this.dead = false
        this.type = type
        this.width = width
        this.height = height
        this.img = path
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

//this class will extend the GameObject's inherent class properties
class Movable extends GameObject {
    constructor(x, y, width, height, path, type) {
        super(x, y, width, height, path, type)
    }

    //this movable object can be moved on the screen
    moveTo(x, y) {
        this.x = x
        this.y = y
    }
}

//this is a specific class that extends the Movable class, so it can take advantage of all the properties that it inherits
export class Hero extends Movable {
    constructor(x, y, width, height, path) {
        super(x, y, width, height, path, 'hero')
        this.bulletLevel = 0
        this.bulletSpeed = 10
        this.bulletSet = {}
    }

    active = (ctx) => {
        if (hpDash > 1) {
            hpDash /= 1.2
            if (hpDash < 1) hpDash = 1
        }

        // check move
        let sp = dash ? MovingSpeed * 2 * hpDash : MovingSpeed
        sp = hpDash > 1 ? sp * hpDash : sp
        console.log(sp)
        if (movingL && this.x > sp) this.moveTo(this.x - sp, this.y)

        // 1400 (CanvasWidth)
        if (movingR && this.x < 1400 - this.width)
            this.moveTo(this.x + sp, this.y)

        if (movingD && this.y + this.height < 700)
            this.moveTo(this.x, this.y + sp)
        if (movingU && this.y > 0) this.moveTo(this.x, this.y - sp)

        //check Attack
        if (attack) {
            this.shoot()
        }

        // check bullet obj

        this.draw(ctx)
    }

    shoot = (angle) => {
        const launchX = this.x + this.width / 2
        const launchY = this.y
        const bulletId = 'b' + Date.now()
        this.bulletSet[bulletId] = new Bullet(
            launchX,
            launchY,
            10,
            40,
            bulletImg[this.bulletLevel],
        )
    }
}

class Bullet extends GameObject {
    constructor(x, y, width, height, path, type) {
        super(x, y, width, height, path, type)
    }

    active = (ctx) => {
        // launch 실제 x, y 값 구하기 -> bullet위치 보정
        // 매 frame마다 moveTo 할거니까 위치 바꾸기
        // 충돌체크 어디서 하카마씸?
        this.draw(ctx)
    }
}

class Enemy extends Movable {
    constructor(x, y, width, height, path) {
        super(x, y, width, height, path)
        ;(this.width = 98), (this.height = 50)
        this.type = 'Enemy'
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5
            } else {
                console.log('Stopped at', this.y)
                clearInterval(id)
            }
        }, 300)
    }
}

//set up the window to listen for the keyup event, specifically if the left arrow is hit, emit a message to move the hero left
window.addEventListener('keydown', (evt) => {
    console.log(evt.key)
    switch (evt.key) {
        case 'ArrowLeft':
            movingL = true
            break
        case 'ArrowRight':
            movingR = true
            break
        case 'ArrowUp':
            movingU = true
            break
        case 'ArrowDown':
            movingD = true
            break
        case 'Shift':
            dash = true
            break
        case 'z':
        case 'Z':
            hpDash = 2.5
            break
    }
})

window.addEventListener('keyup', (evt) => {
    switch (evt.key) {
        case 'ArrowLeft':
            movingL = false
            break
        case 'ArrowRight':
            movingR = false
            break
        case 'ArrowUp':
            movingU = false
            break
        case 'ArrowDown':
            movingD = false
            break
        case 'Shift':
            dash = false
            break
    }
})
