export default class InputHandler {

    constructor(_canvas) {
        this.canvas = _canvas
        this.canvasRect = this.canvas.getBoundingClientRect()
        // cursor variables
        this.x;
        this.y;
        this.pressed = false;
        // keypress variables
        this.keys = []
        this.releasedKeys = []
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

        addEventListener('keydown', (e) => {
            if(this.isValidKey(e.key)) {
                this.keys.push(e.key)
            }
            
        })

        addEventListener('keyup', (e) => {
            if(this.isValidKey(e.key)) {
                this.keys.splice(this.keys.indexOf(e.key), 1)
            }
            if(this.isReleaseKey(e.key)) {
                this.releasedKeys.push(e.key)
            }
        })
    }

    isValidKey(key) {
        return InputHandler.VALID_KEYS.includes(key)
    }

    isReleaseKey(key) {
        return InputHandler.RELEASE_KEYS.includes(key)
    }

    static get VALID_KEYS() {
        return [" "];
    }

    static get RELEASE_KEYS() {
        return [" "];
    }
}