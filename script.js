import Point from "./point.js"
import {dist, lerp} from './utils.js'
import CursorHandler from './cursor_handler.js'
const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')

const CANVAS_W = canvas.width = 500
const CANVAS_H = canvas.height = 500
const cursor = new CursorHandler(canvas);

// End Points
let p0 = new Point(40, 200)
let p1 = new Point(450, 300)

// Control Point(s)
let pA = new Point(200, 40)
// let pB = new Point(270, 400)

let nodes = [p0, pA, p1]
let draggingPoint;

let dt = 0.1

let curve_points = []

function drawCurve(start, end, points, dotted=true) {
    if(dotted) {
        points.forEach( (p) => {
            p.update(ctx)
        })
    } else {
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.strokeStyle = 'black'
        points.forEach( (p) => {
            ctx.lineTo(p.x, p.y)
            ctx.stroke()
        })
    }
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    for(let t=0;t <= 1; t+=dt) {
        let x1 = lerp(p0.x, pA.x, t)
        let y1 = lerp(p0.y, pA.y, t)
        let x2 = lerp(pA.x, p1.x, t)
        let y2 = lerp(pA.y, p1.y, t)

        let x = lerp(x1, x2, t)
        let y = lerp(y1, y2, t)

        curve_points.push(new Point(x, y, 2, 'black'))
        // ctx.beginPath()
        // ctx.moveTo(0, 0)
        // ctx.strokeStyle = 'black'
        // ctx.lineTo(x, y)
        // ctx.stroke()
        // points.push(new Point(x, y, 2, 'black'))
    }
    p0.update(ctx)
    p1.update(ctx)
    pA.update(ctx)
    // drawCurve(p0, p1, curve_points)
    // pB.update(ctx)
    // points.forEach(p => p.update(ctx))
    requestAnimationFrame(animate)
}

addEventListener('mousedown', (_) => {
    nodes.forEach( (p) => {
        if(p.isTouching(cursor.x, cursor.y, 5) && cursor.pressed) {
            draggingPoint = p
            p.color = 'blue'
            p.update(ctx)
        }
    })
})

addEventListener('mousemove', (_) => {
    if(draggingPoint == null) return;
    draggingPoint.x = Math.min(Math.max(cursor.x, draggingPoint.r), CANVAS_W-draggingPoint.r)
    draggingPoint.y = Math.min(Math.max(cursor.y, draggingPoint.r), CANVAS_H-draggingPoint.r)
    
    draggingPoint.update(ctx)
})


addEventListener('mouseup', (_) => {
    draggingPoint = null
})

animate()