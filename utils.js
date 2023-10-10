export function distX (x1, x2) {
    return x2 - x1
}

export function distY (y1, y2) {
    return y2 - y1
}

export function _dist_float(x1, y1, x2, y2) {
    return Math.sqrt(distX(x1, x2)**2 + distY(y1, y2)**2)
}

export function dist (x1, y1, x2, y2){
    return Math.floor(_dist_float(x1, y1, x2, y2))
}


export function lerp (a0, a1, t) {
    return a0 + (a1-a0)*t
}