export default class CursorHandler {
    constructor(_canvas) {
        this.canvas = _canvas
        this.canvasRect = this.canvas.getBoundingClientRect()
        this.x;
        this.y;
        this.pressed = false;
        addEventListener('mousedown', (e) => {
            if(e.button != 0) return;
            this.pressed = true
            
        })
        addEventListener('mousemove', (e) => {
            this.x = e.clientX - this.canvasRect.left;
            this.y = e.clientY - this.canvasRect.top;
        })
        addEventListener('mouseup', (e) => {
            if(e.button != 0) return;
            this.pressed = false
        })
    }
}