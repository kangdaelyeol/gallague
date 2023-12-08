import { Movable } from './Movable.js'
import { loadAsset } from './factory.js'
import { BulletSet } from './BulletSet.js'
let heroImg = null
let lifeImg = null
let movingL = false
let movingR = false
let movingU = false
let movingD = false
let dash = false
let hpDash = 1
let attack = false
let isEnergy = false
let motionRate = 100
let rateSpeed = 2
let spinRate = 0
let spinSpeed = 1
let aniLoopID = null
const bulletImg = []

loadAsset('../../img/hero.png').then((img) => {
    heroImg = img
})

for (let i = 0; i < 5; i++) {
    loadAsset(`../../img/b0${i + 1}.png`).then((img) => {
        bulletImg[i] = img
    })
}

loadAsset('../../img/mylife.png').then((img) => {
    lifeImg = img
})

//this is a specific class that extends the Movable class, so it can take advantage of all the properties that it inherits
export class Hero extends Movable {
    constructor(x, y, width, height) {
        super(x, y, width, height, heroImg, 'hero')
        this.bulletLevel = 1
        this.bulletSpeed = 3
        this.energy = 0
        this.life = 3
        this.bulletSet = new BulletSet()
        this.movingSpeed = 5
    }

    active = (ctx) => {
        if (hpDash > 1) {
            hpDash /= 1.1
            if (hpDash < 1) hpDash = 1
        }

        // check move
        let sp = dash ? this.movingSpeed * 2 * hpDash : this.movingSpeed
        sp = hpDash > 1 ? sp * hpDash : sp
        movingL && (this.x -= sp)
        movingR && (this.x += sp)
        movingD && (this.y += sp)
        movingU && (this.y -= sp)

        this.x < 0 && (this.x = 0)
        this.x + this.width > this.canvasWidth &&
            (this.x = this.canvasWidth - this.width)
        this.y < 0 && (this.y = 0)
        this.y + this.height > this.canvasHeight &&
            (this.y = this.canvasHeight - this.height)

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
        this.bulletSet.active(ctx)
        // painting Energy after painting Hero
        if (this.energy > 100) {
            const increaseRate = this.energy > 300 ? 1 : 0.01
            motionRate -= rateSpeed
            rateSpeed += increaseRate
            spinRate += spinSpeed
            spinSpeed += increaseRate / 10
            this.paintEnergy(ctx, 0 + spinRate, 0)
            this.paintEnergy(ctx, 72 + spinRate, 20)
            this.paintEnergy(ctx, 144 + spinRate, 40)
            this.paintEnergy(ctx, 216 + spinRate, 60)
            this.paintEnergy(ctx, 288 + spinRate, 80)
        }
    }

    shot = (angle) => {
        const launchX = this.x + this.width / 2
        const launchY = this.y
        const bulletId = 'b' + Date.now()
        this.bulletSet.createBullet(
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
                this.bulletSet.createBullet(
                    launchX,
                    launchY,
                    50,
                    100,
                    bulletImg[this.bulletLevel],
                    this.bulletLevel,
                    bulletId + 'R' + i,
                    i,
                )
                this.bulletSet.createBullet(
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
                this.bulletSet.createBullet(
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
                this.bulletSet.createBullet(
                    launchX + 10,
                    launchY,
                    200,
                    150,
                    bulletImg[bulletLevel],
                    this.bulletLevel,
                    bulletIdR,
                    0,
                )
                this.bulletSet.createBullet(
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
                this.bulletSet.createBullet(
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
                this.bulletSet.createBullet(
                    launchX + 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdR,
                    -60,
                )
                this.bulletSet.createBullet(
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
                this.bulletSet.createBullet(
                    launchX + 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdR,
                    -40,
                )
                this.bulletSet.createBullet(
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
                this.bulletSet.createBullet(
                    launchX + 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdR,
                    -20,
                )
                this.bulletSet.createBullet(
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
                this.bulletSet.createBullet(
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
                this.bulletSet.createBullet(
                    launchX + 10,
                    launchY,
                    1000,
                    200,
                    bulletImg[bulletLevel],
                    4,
                    bulletIdR,
                    0,
                )
                this.bulletSet.createBullet(
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
        const dx = this.canvasWidth - 50
        const dy = this.canvasHeight - 50
        for (let i = 0; i < this.life; i++)
            ctx.drawImage(lifeImg, dx - interval * i, dy, 50, 50)
    }

    lifeDown = () => {
        this.life--
    }
}

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
