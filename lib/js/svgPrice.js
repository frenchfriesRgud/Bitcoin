// Created by Anthony.media
// 2020-11-21

const svgDiv = document.querySelector('.svg-bg');
const svgContainer = document.querySelector('.svg-element');
const svgLines = document.querySelector('.svg-lines-animated');
let lineScale = 1.5;

updateAngle = (direction) => {
    if(direction > 0){
        svgLines.setAttribute('style', `transform: rotate(45deg) scale(${lineScale});`);
    } else {
        svgLines.setAttribute('style', `transform: rotate(135deg) scale(${lineScale})`);
    }
}

updateColor = (direction) => {
    if(direction > 0){
        svgContainer.classList.add('svg-price-gain');
    } else {
        svgContainer.classList.remove('svg-price-gain');
    }
}

svgRender = (direction) => {
        updateAngle(direction);
        updateColor(direction);
}
