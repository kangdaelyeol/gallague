let movingL = false
let movingR = false
let movingU = false
let movingD = false
let dash = false
const MovingSpeed = 5
let hpDash = 1
let attack = false
const bulletSet = {}
let isEnergy = false
let motionRate = 100
let rateSpeed = 2
let spinRate = 0
let spinSpeed = 1
let aniLoopID = null
// image Src
const bulletImg = []
let lifeImg = null
let enemyImg = null

function iscollision(x, y) {
    return (
        x.x + x.width > y.x &&
        x.x < y.x + y.width &&
        x.y + x.height > y.y &&
        x.y < y.y + y.height
    )
}

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
    loadAsset('img/mylife.png').then((img) => {
        lifeImg = img
    })
    loadAsset('img/enemy.png').then((img) => {
        enemyImg = img
    })
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
        this.bulletLevel = 1
        this.bulletSpeed = 3
        this.energy = 0
        this.life = 3
    }

    active = (ctx) => {
        if (hpDash > 1) {
            hpDash /= 1.2
            if (hpDash < 1) hpDash = 1
        }

        // check move
        let sp = dash ? MovingSpeed * 2 * hpDash : MovingSpeed
        sp = hpDash > 1 ? sp * hpDash : sp
        if (movingL && this.x > 0) {
            this.x = this.x - sp < 0 ? 0 : this.x - sp
        }
        // 1400 (CanvasWidth)
        if (movingR && this.x < 1400 - this.width) {
            this.x = this.x + sp > 1400 ? 1400 : this.x + sp
        }
        if (movingD && this.y - this.height < 700) {
            this.y =
                this.y > 700 - this.height ? 700 - this.height : this.y + sp
        }
        if (movingU && this.y > 0) {
            this.y = this.y - sp < 0 ? 0 : this.y - sp
        }
        this.moveTo(this.x, this.y)

        //check Attack
        if (attack) {
            attack = false
            let angle
            if (this.bulletLevel < 2) angle = 0
            else if (this.bulletLevel < 4) angle = 10
            else angle = 20
            this.shot(angle)
        }

        // check bullet obj

        // Energy Print
        // Energy charging
        if (isEnergy) this.energy++
        else {
            // emit special shot when energy is gathered to some extent
            if (this.energy > 300) {
                this.energyPar()
            } else if (this.energy > 100) {
                this.specialShot()
            }
            this.energy = 0
            rateSpeed = 1
            spinSpeed = 2
        }

        this.paintLife(ctx)
        this.draw(ctx)
        // painting Energy after painting Hero
        if (this.energy > 20) {
            motionRate -= rateSpeed
            rateSpeed += 0.01
            spinRate += spinSpeed
            spinSpeed += 0.001
            this.paintEnergy(ctx, 0 + spinRate, 0)
            this.paintEnergy(ctx, 72 + spinRate, 20)
            this.paintEnergy(ctx, 144 + spinRate, 40)
            this.paintEnergy(ctx, 216 + spinRate, 60)
            this.paintEnergy(ctx, 288 + spinRate, 80)
        }
        return bulletSet
    }

    shot = (angle) => {
        const launchX = this.x + this.width / 2
        const launchY = this.y
        const bulletId = 'b' + Date.now()
        bulletSet[bulletId] = new Bullet(
            launchX,
            launchY,
            50,
            100,
            bulletImg[this.bulletLevel],
            this.bulletLevel,
            bulletId,
            0,
        )
        if (angle) {
            for (let i = 10; i <= angle; i += 10) {
                bulletSet[bulletId + 'R' + i] = new Bullet(
                    launchX,
                    launchY,
                    50,
                    100,
                    bulletImg[this.bulletLevel],
                    this.bulletLevel,
                    bulletId + 'R' + i,
                    i,
                )
                bulletSet[bulletId + 'L' + i] = new Bullet(
                    launchX,
                    launchY,
                    50,
                    100,
                    bulletImg[this.bulletLevel],
                    this.bulletLevel,
                    bulletId + 'L' + i,
                    -i,
                )
            }
        }
    }

    specialShot = () => {
        const MaxCount = 100
        let frameCount = 0
        const launchSpecialAttack = () => {
            const launchX = this.x + this.width / 2
            const launchY = this.y
            if (frameCount % 2 === 0) {
                const bulletLevel = Math.floor(Math.random() * 5)
                const bulletId = 'SC' + Date.now()
                console.log('shot', bulletId)
                bulletSet[bulletId] = new Bullet(
                    launchX,
                    launchY,
                    200,
                    150,
                    bulletImg[bulletLevel],
                    this.bulletLevel,
                    bulletId,
                    0,
                )
            } else {
                const launchX = this.x + this.width / 2
                const launchY = this.y
                const bulletLevel = Math.floor(Math.random() * 5)
                const bulletIdR = 'SR' + Date.now()
                const bulletIdL = 'SL' + Date.now()
                // console.log('shot', bulletId)
                bulletSet[bulletIdR] = new Bullet(
                    launchX + 10,
                    launchY,
                    200,
                    150,
                    bulletImg[bulletLevel],
                    this.bulletLevel,
                    bulletIdR,
                    0,
                )
                bulletSet[bulletIdL] = new Bullet(
                    launchX - 10,
                    launchY,
                    200,
                    150,
                    bulletImg[bulletLevel],
                    this.bulletLevel,
                    bulletIdL,
                    0,
                )
            }
            frameCount++
            aniLoopID = requestAnimationFrame(launchSpecialAttack)
            if (frameCount > MaxCount) return cancelAnimationFrame(aniLoopID)
        }

        launchSpecialAttack()
    }

    energyPar = () => {
        const MaxCount = 500
        let frameCount = 0
        const launchEnergyPar = () => {
            const launchX = this.x + this.width / 2
            const launchY = this.y

            if (frameCount >= 450 && frameCount % 2 === 0) {
                const bulletId = 'FB' + Date.now()
                const bulletLevel = Math.floor(Math.random() * 5)
                // console.log('shot', bulletId)
                bulletSet[bulletId] = new Bullet(
                    launchX,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletId,
                    0,
                )
            }
            if (frameCount >= 400 && frameCount % 2 === 0) {
                const bulletIdR = 'SR4' + Date.now()
                const bulletIdL = 'SL4' + Date.now()
                const bulletLevel = Math.floor(Math.random() * 5)
                // console.log('shot', bulletId)
                bulletSet[bulletIdR] = new Bullet(
                    launchX + 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdR,
                    -60,
                )
                bulletSet[bulletIdL] = new Bullet(
                    launchX - 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdL,
                    60,
                )
            }
            if (frameCount >= 300 && frameCount % 2 === 0) {
                const bulletIdR = 'SR3' + Date.now()
                const bulletIdL = 'SL3' + Date.now()
                const bulletLevel = Math.floor(Math.random() * 5)
                // console.log('shot', bulletId)
                bulletSet[bulletIdR] = new Bullet(
                    launchX + 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdR,
                    -40,
                )
                bulletSet[bulletIdL] = new Bullet(
                    launchX - 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdL,
                    40,
                )
            }
            if (frameCount >= 200 && frameCount % 2 === 0) {
                const bulletIdR = 'SR2' + Date.now()
                const bulletIdL = 'SL2' + Date.now()
                const bulletLevel = Math.floor(Math.random() * 5)
                // console.log('shot', bulletId)
                bulletSet[bulletIdR] = new Bullet(
                    launchX + 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdR,
                    -20,
                )
                bulletSet[bulletIdL] = new Bullet(
                    launchX - 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdL,
                    20,
                )
            }

            if (frameCount % 2 === 0) {
                const bulletLevel = Math.floor(Math.random() * 5)
                const bulletId = 'SC' + Date.now()
                console.log('shot', bulletId)
                bulletSet[bulletId] = new Bullet(
                    launchX,
                    launchY,
                    1000,
                    300,
                    bulletImg[bulletLevel],
                    4,
                    bulletId,
                    0,
                )
            } else {
                const launchX = this.x + this.width / 2
                const launchY = this.y
                const bulletLevel = Math.floor(Math.random() * 5)
                const bulletIdR = 'SR' + Date.now()
                const bulletIdL = 'SL' + Date.now()
                // console.log('shot', bulletId)
                bulletSet[bulletIdR] = new Bullet(
                    launchX + 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdR,
                    0,
                )
                bulletSet[bulletIdL] = new Bullet(
                    launchX - 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdL,
                    0,
                )
            }
            frameCount++
            aniLoopID = requestAnimationFrame(launchEnergyPar)
            if (frameCount > MaxCount) return cancelAnimationFrame(aniLoopID)
        }
        aniLoopID = requestAnimationFrame(launchEnergyPar)
    }

    paintEnergy = (ctx, rad, rate) => {
        const heroCenterX = this.x + this.width / 2
        const heroCenterY = this.y + this.height / 2
        const radius = this.height / 2 + 50
        if (motionRate < 0) motionRate = 100
        const myRate = (motionRate + rate) % 100

        const radian = (rad / 180) * Math.PI

        const energyX =
            heroCenterX + (radius * Math.cos(radian) * myRate) / 100 - 25
        const energyY =
            heroCenterY + (radius * Math.sin(radian) * myRate) / 100 - 25
        // ctx.translate(energyX, energyY)
        // ctx.rotate(radian)
        ctx.drawImage(bulletImg[this.bulletLevel], energyX, energyY, 50, 50)
        // ctx.rotate(-radian)
        // ctx.translate(-energyX, -energyY)
    }

    paintLife = (ctx) => {
        const interval = 20
        const dx = 1350
        const dy = 650
        ctx.font = '30px Arial'
        ctx.fillStyle = 'white'
        ctx.fillText('Life', dx - (this.life - 1) * interval, dy - 10)
        for (let i = 0; i < this.life; i++)
            ctx.drawImage(lifeImg, dx - interval * i, dy, 50, 50)
    }

    lifeDown = () => {
        this.life--
    }
}

class Bullet extends Movable {
    constructor(x, y, width, height, path, level, id, angle) {
        const startX = x - width / 2
        const startY = y - height / 2
        super(startX, startY, width, height, path, 'bullet')
        this.level = level
        this.id = id
        this.angle = angle
    }

    active = (ctx) => {
        // 매 frame마다 moveTo 할거니까 위치 바꾸기
        const speed = this.level * 5 + 3
        if (this.angle) {
            const cosAngle = Math.tan((this.angle / 180) * Math.PI)
            this.x = this.x - cosAngle * speed
        }
        this.moveTo(this.x, this.y - speed)
        this.draw(ctx)
    }

    checkPosition = () => {
        if (this.y < -500 || this.x < -1000 || this.x > 2500) {
            this.removeBullet()
        }
        return bulletSet
    }
    removeBullet = () => {
        delete bulletSet[this.id]
    }
}

class Enemy extends Movable {
    constructor(x, y, width, height, path, id) {
        super(x, y, width, height, path)
        this.type = 'Enemy'
        this.id = id
        const rn = Math.random()
        this.movingDown = rn > 0.5 ? true : false
        this.movingRight = rn > 0.5 ? true : false
    }

    active = (ctx) => {
        // movingPattern
        const movingX = Math.floor(Math.random() * 5) + 5
        const movingY = Math.floor(Math.random() * 5)

        if (this.movingRight) {
            this.x += movingX
            if (this.x - this.width >= 1400) {
                this.x = 1400
                this.movingRight = false
            }
        } else {
            this.x -= movingX
            if (this.x <= 0) {
                this.x = 0
                this.movingRight = true
            }
        }

        if (this.movingDown) {
            this.y += movingY
            if (this.y + this.height >= 700) {
                this.y = 700
                this.movingDown = false
            }
        } else {
            this.y -= movingY
            if (this.y <= 0) {
                this.y = 0
                this.movingDown = true
            }
        }

        this.moveTo(this.x, this.y)
        this.draw(ctx)
    }
}

export class EnemySet {
    constructor() {
        this.enemySet = {}
        this.activeCount = 0
    }

    active = (ctx) => {
        if (this.activeCount % 50 === 0) this.createEnemy()

        Object.keys(this.enemySet).forEach((i) => {
            this.enemySet[i].active(ctx)
        })
        this.activeCount++
    }

    createEnemy = () => {
        const enemyWidth = 50 + 200 * Math.random()
        const enemyHeight = 20 + 100 * Math.random()
        const x = Math.floor(Math.random() * 1400) - enemyWidth
        const y = Math.random() * 50
        const enemyId = 'E' + Date.now()
        this.enemySet[enemyId] = new Enemy(
            x,
            y,
            enemyWidth,
            enemyHeight,
            enemyImg,
            enemyId,
        )
    }

    collisionCheck = (object) => {
        Object.keys(this.enemySet).forEach((k) => {
            const en = this.enemySet[k]
            switch (object.type) {
                case 'hero':
                    if (!iscollision(object, en)) break
                    this.removeEnemy(en.id)
                    object.lifeDown()
                    break
                case 'bullet':
                    if (!iscollision(object, en)) break
                    this.removeEnemy(en.id)
                    object.removeBullet()
                    break
            }
        })
    }

    removeEnemy = (id) => {
        delete this.enemySet[id]
    }
}

//set up the window to listen for the keyup event, specifically if the left arrow is hit, emit a message to move the hero left
window.addEventListener('keydown', (evt) => {
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
        case ' ':
            attack = true
            isEnergy = true
            break
    }
})

window.addEventListener('keyup', (evt) => {
    console.log(evt.key)
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
        case ' ':
            isEnergy = false
            break
    }
})
