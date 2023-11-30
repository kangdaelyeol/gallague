//set up the class GameObject
class GameObject {
    constructor(x, y, width, height, path) {
        this.x = x
        this.y = y
        this.dead = false
        this.type = ''
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
    constructor(x, y, width, height, path) {
        super(x, y, width, height, path)
    }

    //this movable object can be moved on the screen
    moveTo(x, y) {
        this.x = x
        this.y = y
    }
}

//this is a specific class that extends the Movable class, so it can take advantage of all the properties that it inherits
class Hero extends Movable {
    constructor(x, y, width, height, path) {
        super(x, y, width, height, path)
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

//set up an EventEmitter class that contains listeners
class EventEmitter {
    constructor() {
        this.listeners = {}
    }
    //when a message is received, let the listener to handle its payload
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = []
        }
        this.listeners[message].push(listener)
    }
    //when a message is sent, send it to a listener with some payload
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload))
        }
    }
}

//set up a message structure
const Messages = {
    HERO_MOVE_LEFT: 'HERO_MOVE_LEFT',
}
//invoke the eventEmitter you set up above
const eventEmitter = new EventEmitter()
//set up a hero
//let the eventEmitter know to watch for messages pertaining to the hero moving left, and act on it

//set up the window to listen for the keyup event, specifically if the left arrow is hit, emit a message to move the hero left
window.addEventListener('keydown', (evt) => {
    if (evt.key === 'ArrowLeft') {
        // eventEmitter.emit(Messages.HERO_MOVE_LEFT)
        console.log('ArrowLeft')
    }
})
