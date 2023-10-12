const selectOptions = document.querySelector('#options')
selectOptions.addEventListener('change', (e) => {
    selectOptions.style.width = getTextWidth(e.target.value, e.target)
})

window.addEventListener('load', (_) => {
    selectOptions.style.width = getTextWidth(selectOptions.value, selectOptions)
})

function getTextWidth(text, container) {
    const selectSize = 33;  // width of select box + border with no text
    let textElem = document.createElement('span')
    textElem.innerHTML = text
    textElem.style.position = 'absolute'
    textElem.style.visibility =  'hidden'
    textElem.style.whiteSpace = 'nowrap'
    textElem.style.left = '-9999px'
    textElem.style.fontSize = getFontSize(container)
    textElem.style.fontFamily = getFontFamily(container)
    document.body.appendChild(textElem)
    const width = parseFloat(window.getComputedStyle(textElem).width)
    document.body.removeChild(textElem)
    return (width+selectSize) + 'px'
}

function getFontFamily(container) {
    return window.getComputedStyle(container).getPropertyValue('font-family')
}

function getFontSize(container) {
    return window.getComputedStyle(container).getPropertyValue('font-size')
}