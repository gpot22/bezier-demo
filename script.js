import Point, {DynamicPoint} from "./point.js"
import {dist, lerp} from './utils.js'
import CursorHandler from './cursor_handler.js'
const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')
const drawBtn = document.querySelector('#draw-btn')

const CANVAS_W = canvas.width = 500
const CANVAS_H = canvas.height = 400
const cursor = new CursorHandler(canvas);

// End Points
let p0 = new DynamicPoint(40, 200, 5, 'blue')
let p1 = new DynamicPoint(450, 300, 5, 'blue')

// Control Point(s)
let pA = new DynamicPoint(200, 40, 5, 'purple')
let pB = new DynamicPoint(270, 300, 5, 'purple')
let dragPointColor = 'red'

let nodes = [p0, pA, pB, p1]
let draggingPoint;

// let dt = 0.1

// let curve_points = []

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

function cubicBezier(start, controls, end, dt) {
    let points = []
    for(let t=0; t<=1;t+=dt) {
        let qp1 = quadraticBezierPoints(start, controls[0], controls[1], t)
        let qp2 = quadraticBezierPoints(controls[0], controls[1], end, t)
        let x = lerp(qp1.x, qp2.x, t)
        let y = lerp(qp1.y, qp2.y, t)
        points.push(new Point(x, y, 2, 'black'))
    }
    return points
}

function quadraticBezierPoints(start, control, end, t) {
    let x1 = lerp(start.x, control.x, t)
    let y1 = lerp(start.y, control.y, t)
    let x2 = lerp(control.x, end.x, t)
    let y2 = lerp(control.y, end.y, t)

    let x = lerp(x1, x2, t)
    let y = lerp(y1, y2, t)
    return {x:x, y:y}
}

function quadraticBezier(start, control, end, dt) {
    let points = []
    for(let t=0;t <= 1; t+=dt) {
        let p = quadraticBezierPoints(start, control, end, t)
        points.push(new Point(p.x, p.y, 2, 'black'))
    }
    return points
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    let curve_points = cubicBezier(p0, [pA, pB], p1, 0.05)
    // let curve_points = quadraticBezier(p0, pA, o1, 0.1)
    curve_points.forEach(p => p.update(ctx))

    p0.update(ctx)
    p1.update(ctx)
    pA.update(ctx)
    pB.update(ctx)
    requestAnimationFrame(animate)
}

addEventListener('mousedown', (_) => {
    nodes.forEach( (p) => {
        if(p.isTouching(cursor.x, cursor.y, 5) && cursor.pressed) {
            draggingPoint = p
            p.color = dragPointColor
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
    if(draggingPoint == null) return;
    draggingPoint.color = draggingPoint.defaultColor
    draggingPoint.update(ctx)
    draggingPoint = null
})
init()
animate()

// drawBtn.addEventListener('click', () => {
//     })