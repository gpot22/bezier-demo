export default class CursorHandler {
    constructor(_canvas) {
        this.canvas = _canvas
        this.canvasRect = this.canvas.getBoundingClientRect()
        this.x;
        this.y;
        this.pressed = false;
        addEventListener('mousedown', (e) => {
            this.pressed = true
            
        })
        addEventListener('mousemove', (e) => {
            this.x = e.clientX - this.canvasRect.left;
            this.y = e.clientY - this.canvasRect.top;
        })
        addEventListener('mouseup', (e) => {
            this.pressed = false
        })
    }
}