import { Enemy } from './enemy.js'
import { loadAsset, isCollision } from './factory.js'

let enemyImg = null
loadAsset('img/enemy.png').then((img) => {
    enemyImg = img
})

export class EnemySet {
    constructor() {
        this.enemySet = {}
        this.activeCount = 0
        this.canvasWidth = 0
        this.canvasHeight = 0
        this.round = 0
        this.activeDelay = 50
    }
    setCanvasSize = (w, h) => {
        this.canvasWidth = w
        this.canvasHeight = h
        Object.keys(this.enemySet).forEach((i) => {
            this.enemySet[i].setCanvasSize(w, h)
        })
    }

    setRound = (round) => {
        this.round = round
        this.activeDelay = Math.floor(50 / this.round)
    }

    active = (ctx) => {
        if (this.activeCount % this.activeDelay === 0) this.createEnemy()
        Object.keys(this.enemySet).forEach((i) => {
            this.enemySet[i].active(ctx)
        })
        this.activeCount++
    }

    createEnemy = () => {
        const enemyWidth = 50 + 200 * Math.random()
        const enemyHeight = 20 + 100 * Math.random()
        const speedX = (Math.random() * this.canvasWidth) / 200 + 5
        const speedY = this.canvasHeight / 200
        const score = Math.floor(enemyWidth + enemyHeight + speedX * speedY)
        const x = Math.floor(Math.random() * this.canvasWidth) - enemyWidth
        const y = Math.random() * 50
        const enemyId = 'E' + Date.now()
        this.enemySet[enemyId] = new Enemy(
            x,
            y,
            enemyWidth,
            enemyHeight,
            enemyImg,
            enemyId,
            speedX,
            speedY,
            score,
        )
        this.enemySet[enemyId].setCanvasSize(
            this.canvasWidth,
            this.canvasHeight,
        )
    }

    collisionCheckWithHero = (hero) => {
        Object.keys(this.enemySet).forEach((k) => {
            const en = this.enemySet[k]
            if (!isCollision(hero, en)) return
            this.removeEnemy(en.id)
            hero.lifeDown()
        })
    }

    collisionCheckWithBulletSet = (bulletSet, gameInfo) => {
        const bullets = bulletSet.getBulletSet()
        Object.keys(this.enemySet).forEach((k) => {
            const en = this.enemySet[k]
            bullets.forEach((b) => {
                if (!isCollision(en, b)) return
                this.removeEnemy(en.id)
                gameInfo.score += en.score
                bulletSet.removeBullet(b.id)
            })
        })
    }

    removeEnemy = (id) => {
        delete this.enemySet[id]
    }
}
