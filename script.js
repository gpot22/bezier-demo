import Point, {DynamicPoint, AnimatedPoint} from "./point.js"
import CursorHandler from './cursor_handler.js'
import { LinearBezier, QuadraticBezier, CubicBezier } from "./curves.js"

const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')

let canvasDim = _dimensionCanvas()
canvas.width = canvasDim.width
canvas.height = canvasDim.height
const cursor = new CursorHandler(canvas);

const controlsDiv = document.querySelector('.controls')
const playBtn = controlsDiv.querySelector('.play-btn')
const playBtnIcon = playBtn.querySelector('i')

const selectCurve = document.getElementById('options')

// initialize canvas size + resize canvas when window is resized
function initCanvas() {
    window.addEventListener('resize', _resizeCanvas, false);
    _resizeCanvas();
}

// array storing curves that will be displayed on canvas
let curves = []
let actor;
let playing = false;
// resize canvas
function _resizeCanvas() {
    cursor.canvasRect = canvas.getBoundingClientRect()
    canvasDim = _dimensionCanvas()
    canvas.width = canvasDim.width
    canvas.height = canvasDim.height
}

// Calculate canvas dimensions for given aspect ratio
function _dimensionCanvas() {
    const ASPECT_RATIO = 5/4 
    const ADJ_FACTOR = 0.75
    let w = window.innerWidth * ADJ_FACTOR
    let h = window.innerHeight * ADJ_FACTOR
    let ratioW = h*ASPECT_RATIO
    let ratioH = w/ASPECT_RATIO
    if(ratioH > h) {
        return {'width':ratioW, 'height':h}
    } else if (ratioW > w) {
        return {'width': w, 'height': ratioH}
    } 
    else {
        return {'width': 500, 'height': 400}
    }
}

// animation loop
let anim_t = 0.1
let anim_dt = 0.01
let p;
function animate() {
    ctx.clearRect(0, 0, canvasDim.width, canvasDim.height)
    curves.forEach(c => c.draw(ctx))
    actor.update(ctx)
    if(playing) {
        anim_t += anim_dt
        if(anim_t >= 1 || anim_t < 0){
            anim_dt = anim_dt * -1
        }
    }
    p = actor.parentCurve._calculatePoint(anim_t)
    actor.x = p.x
    actor.y = p.y
    
    requestAnimationFrame(animate)
}

function init() {
    let demoCurve;
    let DT = 0.05;  // 0 < DT < 1 ; smaller DT = more dots on curve
    let endPtColor = 'blue'
    let ctrlPtColor = 'purple'
    let ptSize = 5
    let endA = new DynamicPoint(40, 200, ptSize, endPtColor)
    let endB = new DynamicPoint(450, 300, ptSize, endPtColor)
    let ctrlA = new DynamicPoint(200, 40, ptSize, ctrlPtColor)
    let ctrlB = new DynamicPoint(270, 300, ptSize, ctrlPtColor)
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
        actor.parentCurve = demoCurve
        demoCurve.init(canvas, ctx, cursor)
        curves.pop().delete()
        curves.push(demoCurve)
        pause()
        // reset variables
        anim_t = 0.1
        anim_dt = 0.01

    })
    selectCurve.value = 'linear'
    demoCurve = new LinearBezier(endA.clone(), endB.clone(), DT)
    demoCurve.init(canvas, ctx, cursor)
    curves.push(demoCurve)
    
    let actorVel = 3
    actor = new AnimatedPoint(endA.x, endA.y, 8, 'green', demoCurve, actorVel)
    
}

function initControls() {
    playBtn.addEventListener('click', (e) => {
        playBtnIcon.classList.toggle('fa-play-circle')
        playBtnIcon.classList.toggle('fa-pause-circle')
        playing = !playing
    })
}

function play() {
    playBtnIcon.classList.remove('fa-play-circle')
    playBtnIcon.classList.add('fa-pause-circle')
    playing = true;
}

function pause() {
    playBtnIcon.classList.add('fa-play-circle')
    playBtnIcon.classList.remove('fa-pause-circle')
    playing = false
}




initCanvas()
initControls()
init()
animate()