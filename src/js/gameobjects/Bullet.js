import { Movable } from './Movable.js'

export class Bullet extends Movable {
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
        const speed = this.level * 7 + 15
        if (this.angle) {
            const cosAngle = Math.tan((this.angle / 180) * Math.PI)
            this.x = this.x - cosAngle * speed
        }
        this.moveTo(this.x, this.y - speed)
        this.draw(ctx)
    }

    checkAlive = () => {
        if (this.y < -this.height) {
            return false
        }
        return true
    }
}
