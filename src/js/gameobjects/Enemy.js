import { Movable } from './Movable.js'

export class Enemy extends Movable {
    constructor(x, y, width, height, path, id, speedX, speedY, score) {
        super(x, y, width, height, path)
        this.type = 'Enemy'
        this.id = id
        const rn = Math.random()
        this.movingDown = rn > 0.5 ? true : false
        this.movingRight = rn > 0.5 ? true : false
        this.speedX = speedX
        this.speedY = speedY
        this.score = score
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
