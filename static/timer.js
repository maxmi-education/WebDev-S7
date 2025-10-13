var timerPeriodicID = null;

document.getElementById("setTimerButton").addEventListener("click", () => {
    let startingMinutes = document.getElementById("minutes").value;
    let startingSeconds = document.getElementById("seconds").value;
    let seconds = parseInt(startingMinutes) * 60 + parseInt(startingSeconds);
    setTime(seconds)
});

document.getElementById("startTimerButton").addEventListener("click", () => {
    if (timerPeriodicID == null) { //only start the timer if it is not running
        timerPeriodicID = setInterval(reduceTimer, 1000);
    }
})

document.getElementById("stopTimerButton").addEventListener("click", () => {
    if (timerPeriodicID != null) {
        clearInterval(timerPeriodicID);
        timerPeriodicID = null;
    }
})

function reduceTimer() {
    let time = document.getElementById("showTime").dataset.time;
    time = time - 1;  
    setTime(time);
    if (time <= 0) {
        window.alert("time's up");
        clearInterval(timerPeriodicID);
        timerPeriodicID = null;
    }
}

function setTime(seconds) {
    document.getElementById("showTime").dataset.time = seconds;
    let timeString = (Math.floor(seconds / 60)).toLocaleString("de-DE", {minimumIntegerDigits:2})
        + ":" + 
        (seconds % 60).toLocaleString("de-DE", {minimumIntegerDigits:2}) 
        
    document.getElementById("showTime").innerText = timeString;
}