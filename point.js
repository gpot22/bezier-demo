import {dist} from './utils.js'

export default class Point {
    constructor(_x, _y, _r = 5, _color = 'purple') {
        this.x = _x
        this.y = _y
        this.r = _r
        this.color = _color
    }

    clone() {
        return new Point(this.x, this.y, this.r, this.color)
    }
    
    setRGBA(r, g, b, a) {
        this.color = `rgba(${r},${g},${b},${a})`
    }
    
    isTouching(x, y, padding=0) {
        return dist(this.x, this.y, x, y) < this.r + padding
    }

    update (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.fillStyle = this.color
        ctx.fill()
    }
}