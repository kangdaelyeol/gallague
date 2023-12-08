//set up the class GameObject
export class GameObject {
  constructor(x, y, width, height, path, type) {
      this.x = x
      this.y = y
      this.dead = false
      this.type = type
      this.width = width
      this.height = height
      this.img = path
      this.canvasWidth = 0
      this.canvasHeight = 0
  }

  draw(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  setCanvasSize = (w, h) => {
      this.canvasWidth = w
      this.canvasHeight = h
  }
}
