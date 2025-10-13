document.getElementById("startRoulette").addEventListener("click" , () => {
    if (animatorID == null) {
        animatorID = setInterval(rotate, interval * 1000);
        degreesPerInterval = 360 / hertz;
        timePassed = 0;
    }
})

let hertz = 60;
let interval = 1.0 / hertz;
var degreesPerInterval = 360 / hertz;

var animatorID = null;
var timePassed = 0;


function rotate() {
    let wheel = document.getElementById("rouletteWheel");
    let rotation = parseFloat(wheel.dataset.rotation) + degreesPerInterval;
    wheel.style.rotate = (rotation)+"deg";
    wheel.dataset.rotation = rotation;
    timePassed += interval;
    if (timePassed > 2) {
        degreesPerInterval = degreesPerInterval * 0.985;
        if (degreesPerInterval < 0.05) {
            clearInterval(animatorID);
            animatorID = null;
        }
    }
}

function getDegreesPerInterval() {
    return degreesPerInterval;
}

function setDegreesPerInterval(d) {
    degreesPerInterval = d;
}