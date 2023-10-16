import Point, {DynamicPoint} from "./point.js"
import {dist, lerp} from './utils.js'
import CursorHandler from './cursor_handler.js'
const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')

const CANVAS_W = canvas.width = 500
const CANVAS_H = canvas.height = 400
const cursor = new CursorHandler(canvas);

// End Points
let pA = new DynamicPoint(40, 200, 5, 'blue')
let pB = new DynamicPoint(450, 300, 5, 'blue')

// Control Point(s)
let ctrlA = new DynamicPoint(200, 40, 5, 'purple')
let ctrlB = new DynamicPoint(270, 300, 5, 'purple')
let dragPointColor = 'red'

// Curves
let curves = []

function init() {
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
}
  
function redraw() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = '1';
    ctx.strokeRect(0, 0, CANVAS_W, CANVAS_H);
}

function resizeCanvas() {
    cursor.canvasRect = canvas.getBoundingClientRect()
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    redraw();
}

class BezierCurve {
    constructor(p0, p1, controls, dt) {
        this.p0 = p0
        this.p1 = p1
        this.controls = controls
        this.dt = dt
        this.curvePts = []
        this.ptSize = 2
        this.ptColor = 'black'
        this.nodes = [this.p0, this.p1, ...this.controls]
        // console.log(controls)
        // console.log([this.p0, this.p1, ...this.controls])

        addEventListener('mousedown', (_) => {
            this.nodes.forEach( (p) => {
                if(p.isTouching(cursor.x, cursor.y, 5) && cursor.pressed && BezierCurve.draggingPoint == null) {
                    BezierCurve.draggingPoint = p
                    p.color = dragPointColor
                    p.update(ctx)
                }
            })
        })

        addEventListener('mousemove', (_) => {
            if(BezierCurve.draggingPoint == null) return;
            BezierCurve.draggingPoint.x = Math.min(Math.max(cursor.x, BezierCurve.draggingPoint.r), CANVAS_W-BezierCurve.draggingPoint.r)
            BezierCurve.draggingPoint.y = Math.min(Math.max(cursor.y, BezierCurve.draggingPoint.r), CANVAS_H-BezierCurve.draggingPoint.r)
            BezierCurve.draggingPoint.update(ctx)
            curves.forEach(c => c.calculateCurvePoints())
        })
        
        
        addEventListener('mouseup', (_) => {
            if(BezierCurve.draggingPoint == null) return;
            BezierCurve.draggingPoint.color = BezierCurve.draggingPoint.defaultColor
            BezierCurve.draggingPoint.update(ctx)
            BezierCurve.draggingPoint = null
        })
    }

    static draggingPoint = null

    lerp (a0, a1, t) {
        return a0 + (a1-a0)*t
    }
    
    draw(ctx) {
        this.p0.update(ctx)
        this.p1.update(ctx)
        this.controls.forEach(p => p.update(ctx))
        this.curvePts.forEach(p => p.update(ctx))
    }
}

class LinearBezier extends BezierCurve {
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

class QuadraticBezier extends BezierCurve {
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

class CubicBezier extends BezierCurve {
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

function animate() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    // b.draw(ctx)
    curves.forEach(c => c.draw(ctx))
    requestAnimationFrame(animate)
}





init()
let lb = new LinearBezier(pA.clone(), pB.clone(), 0.05)
let qb = new QuadraticBezier(pA.clone(), pB.clone(), [ctrlA], 0.05)
curves.push(lb)
curves.push(qb)

let cb = new CubicBezier(pA.clone(), pB.clone(), [ctrlA.clone(), ctrlB.clone()], 0.05)
curves.push(cb)
animate()