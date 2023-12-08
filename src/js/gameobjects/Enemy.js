import { Movable } from './Movable.js'
import { loadAsset } from './factory.js'

let enemyImg = null
loadAsset('../../img/enemy.png').then((img) => {
    enemyImg = img
})

export class Enemy extends Movable {
    constructor(x, y, width, height, path, id, speedX, speedY) {
        super(x, y, width, height, enemyImg)
        this.type = 'Enemy'
        this.id = id
        const rn = Math.random()
        this.movingDown = rn > 0.5 ? true : false
        this.movingRight = rn > 0.5 ? true : false
        this.speedX = speedX
        this.speedY = speedY
    }

    active = (ctx) => {
        // movingPattern
        const movingX = Math.floor(Math.random() * this.speedX) + 5
        const movingY = Math.floor(Math.random() * this.speedY)

        if (this.movingRight) {
            this.x += movingX
            if (this.x + this.width >= this.canvasWidth) {
                this.x = this.canvasWidth - this.width
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
            if (this.y + this.height >= this.canvasHeight) {
                this.y = this.canvasHeight - this.height
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
