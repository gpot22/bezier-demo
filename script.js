import Point, {DynamicPoint} from "./point.js"
import CursorHandler from './cursor_handler.js'
import { LinearBezier, QuadraticBezier, CubicBezier } from "./curves.js"

const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')

const CANVAS_W = canvas.width = 500
const CANVAS_H = canvas.height = 400
const cursor = new CursorHandler(canvas);

const selectCurve = document.getElementById('options')

// initialize canvas size + resize canvas when window is resized
function initCanvas() {
    window.addEventListener('resize', _resizeCanvas, false);
    _resizeCanvas();
}

// array storing curves that will be displayed on canvas
let curves = []

// resize canvas
function _resizeCanvas() {
    cursor.canvasRect = canvas.getBoundingClientRect()
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
}

// animation loop
function animate() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    curves.forEach(c => c.draw(ctx))
    requestAnimationFrame(animate)
}

function init() {
    let demoCurve;
    let DT = 0.05;
    let endPtColor = 'blue'
    let ctrlPtColor = 'purple'
    let endA = new DynamicPoint(40, 200, 5, endPtColor)
    let endB = new DynamicPoint(450, 300, 5, endPtColor)
    let ctrlA = new DynamicPoint(200, 40, 5, ctrlPtColor)
    let ctrlB = new DynamicPoint(270, 300, 5, ctrlPtColor)
    selectCurve.addEventListener('change', (_) => {
        switch(selectCurve.value) {
            case 'linear':
                demoCurve = new LinearBezier(endA.clone(), endB.clone(), DT)
                break;
            case 'quadratic':
                demoCurve = new QuadraticBezier(endA.clone(), endB.clone(), [ctrlA.clone()], DT)
                break;
            case 'cubic':
                demoCurve = new CubicBezier(endA.clone(), endB.clone(), [ctrlA.clone(), ctrlB.clone()], DT)
                break;
        }
        demoCurve.init(canvas, ctx, cursor)
        curves.pop().delete()
        curves.push(demoCurve)
    })
    selectCurve.value = 'linear'
    demoCurve = new LinearBezier(endA.clone(), endB.clone(), DT)
    demoCurve.init(canvas, ctx, cursor)
    curves.push(demoCurve)
}




initCanvas()
init()
animate()