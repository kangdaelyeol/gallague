import { Bullet } from './Bullet.js'

export class BulletSet {
    constructor() {
        this.bulletSet = {}
    }

    active = (ctx) => {
        // check Position -> whether if the bullet is available to be painted or not
        this.checkPosition()
        // active bullets
        Object.keys(this.bulletSet).forEach((k) => {
            this.bulletSet[k].active(ctx, this.removeBullet)
        })
    }

    createBullet = (x, y, width, height, path, level, id, angle) => {
        this.bulletSet[id] = new Bullet(
            x,
            y,
            width,
            height,
            path,
            level,
            id,
            angle,
        )
    }

    getBulletSet = () => {
        const arr = []
        Object.keys(this.bulletSet).forEach((v) => {
            arr.push(this.bulletSet[v])
        })
        return arr
    }

    removeBullet = (id) => {
        delete this.bulletSet[id]
    }

    checkPosition = () => {
        Object.keys(this.bulletSet).forEach((k) => {
            const isAlive = this.bulletSet[k].checkAlive()
            if (!isAlive) this.removeBullet(k)
        })
    }
}
