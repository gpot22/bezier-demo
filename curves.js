import { lerp } from "./utils.js"
import Point from "./point.js"

export default class BezierCurve {
    constructor(p0, p1, controls, dt) {
        this.p0 = p0
        this.p1 = p1
        this.controls = controls
        this.dt = dt
        this.curvePts = []
        this.ptSize = 2
        this.ptColor = 'black'
        this.nodes = [this.p0, this.p1, ...this.controls]
        this.controller = new AbortController;
    }

    static draggingPoint = null

    init(canvas, ctx, cursor) {
        let dragPointColor = 'red'
        addEventListener('mousedown', (_) => {
            this.nodes.forEach( (p) => {
                if(p.isTouching(cursor.x, cursor.y, 5) && cursor.pressed && BezierCurve.draggingPoint == null) {
                    BezierCurve.draggingPoint = p
                    p.color = dragPointColor
                    p.update(ctx)
                }
            })
        }, {signal: this.controller.signal})

        addEventListener('mousemove', (_) => {
            if(BezierCurve.draggingPoint == null) return;
            BezierCurve.draggingPoint.x = Math.min(Math.max(cursor.x, BezierCurve.draggingPoint.r), canvas.width-BezierCurve.draggingPoint.r)
            BezierCurve.draggingPoint.y = Math.min(Math.max(cursor.y, BezierCurve.draggingPoint.r), canvas.height-BezierCurve.draggingPoint.r)
            BezierCurve.draggingPoint.update(ctx)
            this.calculateCurvePoints()
        }, {signal: this.controller.signal})
        
        
        addEventListener('mouseup', (_) => {
            if(BezierCurve.draggingPoint == null) return;
            BezierCurve.draggingPoint.color = BezierCurve.draggingPoint.defaultColor
            BezierCurve.draggingPoint.update(ctx)
            BezierCurve.draggingPoint = null
        }, {signal: this.controller.signal})
    }

    lerp (a0, a1, t) {
        return a0 + (a1-a0)*t
    }
    
    draw(ctx) {
        this.p0.update(ctx)
        this.p1.update(ctx)
        this.controls.forEach(p => p.update(ctx))
        this.curvePts.forEach(p => p.update(ctx))
    }

    delete() {
        this.controller.abort()
    }
}

export class LinearBezier extends BezierCurve {
    constructor(p0, p1, dt) {
        super(p0, p1, [], dt)
        this.calculateCurvePoints()
    }

    _calculatePoint(t) {
        let x = lerp(this.p0.x, this.p1.x, t)
        let y = lerp(this.p0.y, this.p1.y, t)

        return {x:x, y:y}
    }

    calculateCurvePoints() {
        this.curvePts = []
        for(let t=0;t<=1;t+=this.dt) {
            let p = this._calculatePoint(t)
            this.curvePts.push(new Point(p.x, p.y, this.ptSize, this.ptColor))
        }
    }

}

export class QuadraticBezier extends BezierCurve {
    constructor(p0, p1, controls, dt) {
        super(p0, p1, controls, dt)
        this.calculateCurvePoints()
    }

    _calculatePoint(t) {
        let ctrl1 = this.controls[0]
        let x1 = lerp(this.p0.x, ctrl1.x, t)
        let y1 = lerp(this.p0.y, ctrl1.y, t)
        let x2 = lerp(ctrl1.x, this.p1.x, t)
        let y2 = lerp(ctrl1.y, this.p1.y, t)
    
        let x = lerp(x1, x2, t)
        let y = lerp(y1, y2, t)
        return {x:x, y:y}
    }

    calculateCurvePoints() {
        this.curvePts = []
        for(let t=0;t <= 1; t+=this.dt) {
            let p = this._calculatePoint(t)
            this.curvePts.push(new Point(p.x, p.y, this.ptSize, this.ptColor))
        }
    }

}

export class CubicBezier extends BezierCurve {
    constructor(p0, p1, controls, dt) {
        super(p0, p1, controls, dt)
        this.calculateCurvePoints()
    }

    _calculatePoint(t) {
        let ctrl0 = this.controls[0]
        let ctrl1 = this.controls[1]
        let s = 1-t
        let x = this.p0.x * s**3 + ctrl0.x*3 * s**2*t + ctrl1.x*3 * s*(t**2) + this.p1.x*(t**3)
        let y = this.p0.y * s**3 + ctrl0.y*3 * s**2*t + ctrl1.y*3 * s*(t**2) + this.p1.y*(t**3)
        return {x:x, y:y}
    }

    calculateCurvePoints() {
        this.curvePts = []
        for(let t=0;t<= 1;t+=this.dt) {
            let p =this._calculatePoint(t)
            this.curvePts.push(new Point(p.x, p.y, this.ptSize, this.ptColor))
        }
    }
}