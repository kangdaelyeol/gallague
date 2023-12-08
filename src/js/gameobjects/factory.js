export const loadAsset = (path) => {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = path
        img.onload = () => {
            // image loaded and ready to be used
            resolve(img)
        }
    })
}

export function isCollision(x, y) {
    return (
        x.x + x.width > y.x &&
        x.x < y.x + y.width &&
        x.y + x.height > y.y &&
        x.y < y.y + y.height
    )
}
