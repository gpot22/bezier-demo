import {dist} from './utils.js'

export default class Point {
    constructor(_x, _y, _r = 5, _color = 'black') {
        this.x = _x
        this.y = _y
        this.r = _r
        this.color = _color
        this.defaultColor = _color
    }

    clone() {
        return new Point(this.x, this.y, this.r, this.color)
    }

    // drawCoordinates(ctx) {
    //     ctx.font = "18px Calibri"
    //     ctx.strokeText(`(${this.x}, ${this.y})`, this.x, this.y)
    // }

    update (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

export class DynamicPoint extends Point {
    constructor(_x, _y, _r=5, _color='black', _parentCurve=null) {
        super(_x, _y, _r, _color)
        this.parentCurve = _parentCurve
    }

    static showCoordinates = false

    setRGBA(r, g, b, a) {
        this.color = `rgba(${r},${g},${b},${a})`
    }
    
    isTouching(x, y, padding=0) {
        return dist(this.x, this.y, x, y) < this.r + padding
    }

    update(ctx) {
        super.update(ctx)
        if(DynamicPoint.showCoordinates) {
           ctx.font = "18px Calibri"
            ctx.fillStyle = "black"
            ctx.fillText(`(${Math.round(this.x)}, ${Math.round(this.y)})`, this.x, this.y)
        }
    }

    clone() {
        return new DynamicPoint(this.x, this.y, this.r, this.color, this.parentCurve)
    }
}

export class AnimatedPoint extends DynamicPoint {
    constructor(_x, _y, _r=5, _color='black', _parentCurve=null, _vel) {
        super(_x, _y, _r, _color, _parentCurve, _vel)
        this.vel = _vel
    }

    clone() {
        return new AnimatedPoint(this.x, this.y, this.r, this.color, this.parentCurve, this.vel)
    }
}