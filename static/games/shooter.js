let enableTarget = false;

document.getElementById("startGame").addEventListener("click", () => {
    enableTarget = true;
})

const target = document.getElementById("target");
target.addEventListener("click", () => {
    if (enableTarget) {
        target.style.left = Math.random() * 1150 + "px";
        target.style.top = Math.random() * 550 + 100 + "px";
    }
})