

let leftX
let leftY
let leftHeight
let leftWidth
let leftVelocity
let leftGameOver

let rightX
let rightY
let rightHeight
let rightWidth
let rightVelocity
let rightGameOver


let circleX
let circleY
let circleRadius
let circleVX
let circleVY

let bouncesInSet = 0
let leftScore = 0
let rightScore = 0


function initGameVars() {
    leftX = 0.1 * width;
    leftY = 0.5 * height;
    leftHeight = 0.1 * height;
    leftWidth = leftHeight / 4;
    leftVelocity = 0.25 * height;

    rightX = 0.9 * width;
    rightY = 0.5 * height;
    rightHeight = 0.1 * height;
    rightWidth = rightHeight / 4;
    rightVelocity = 0.15 * height;

    circleRadius = 0.01 * width;
    initBall();

    leftGameOver = leftX - leftWidth - circleRadius;
    rightGameOver = rightX + rightWidth + circleRadius;

    rectMode(CENTER)
}

function initBall() {
    circleX = 0.5 * width;
    circleY = 0.5 * height;
    [circleVX, circleVY] = initialBallVelocities(400);
    if (Math.abs(circleVY) > Math.abs(circleVX)) {
        [circleVX, circleVY] = [circleVY, circleVX];
    }
}

function initialBallVelocities(amplitude) {
    const rot = Math.random() * 2 * Math.PI;
    return rotateVector(amplitude, 0, rot);
}


function setup() {
    let navbarHeight = document.querySelector('.navbar').offsetHeight;
    createCanvas(windowWidth, windowHeight - navbarHeight);
    initGameVars()
}

function draw() {
    background('lightgrey');

    drawBall();
    drawLeftPaddle();
    drawRightPaddle();
    drawScore();

    // collisions with paddles
    if (circleVX < 0) {
        // ball going left
        if (collision(circleX, circleY, circleRadius, leftX, leftY, leftHeight, leftWidth)) {
            circleVX = -circleVX;
            bouncesInSet += 1;
            speedUpBall();
        }
    }
    else if (circleVX > 0) {
        // ball going right
        if (collision(circleX, circleY, circleRadius, rightX, rightY, rightHeight, rightWidth)) {
            circleVX = -circleVX;
            bouncesInSet += 1;
            speedUpBall();
        }
    }
    else {
        alert("So the ball is stuck, huh.");
    }

    // bouncing on the top and bottom border
    if (circleY + circleRadius >= height && circleVY > 0) {
        circleVY = -circleVY;
    }
    else if (circleY - circleRadius <= 0 && circleVY < 0) {
        circleVY = -circleVY;
    }

    if (circleX < leftGameOver || circleX > rightGameOver) {
        initBall();
        if (circleX < leftGameOver) {
            leftScore += 1;
        }
        else {
            rightScore += 1;
        }
    }
}

function drawBall() {
    circleX += deltaTime/1000 * circleVX;
    circleY += deltaTime/1000 * circleVY;
    fill('black');
    stroke('black');
    circle(circleX, circleY, circleRadius * 2);
}

function drawLeftPaddle() {
    if (keyIsPressed) {
        if (keyCode === 87) {
            //up
            leftY -= deltaTime/1000 * leftVelocity;
        }
        if (keyCode === 83) {
            //down
            leftY += deltaTime/1000 * leftVelocity;
        }
    }

    fill('black');
    stroke('black');
    rect(leftX, leftY, leftWidth, leftHeight);
}

function drawRightPaddle() {
    let targetY = circleY;
    if (deltaTime/1000 * rightVelocity >= Math.abs(targetY - rightY)) {
        // snap to target, we are close enough
        rightY = targetY;
    }
    else {
        if (targetY < rightY) {
            rightY -= deltaTime/1000 * rightVelocity;
        }
        else {
            rightY += deltaTime/1000 * rightVelocity;
        }
    }

    fill('black');
    stroke('black');
    rect(rightX, rightY, rightWidth, rightHeight);
}

function drawScore() {
    text(`${leftScore}:${rightScore}`, 0.5 * width, 0.05 * height)
}

function speedUpBall() {
    // ball becomes faster every three hits
    if (bouncesInSet % 3 == 0) {
        circleVX *= 1.1;
        circleVY *= 1.1;
    }
}

function distancePythagoras(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(ax-bx, 2) + Math.pow(ay-by, 2));
}

/**
 *
 * @param {*} x x of vector
 * @param {*} y y fo vector
 * @param {*} radians rotate by that much in positive (ccw) sense
 * @returns array with two entries, x and y of new vector
 */
function rotateVector(x, y, radians) {
    return [
        x*Math.cos(radians) - y*Math.sin(radians),
        x*Math.sin(radians) + y*Math.cos(radians)
    ];
}

/**
 *
 * @param {*} cx circle, x, center
 * @param {*} cy circle, y, center
 * @param {*} cr circle, radius
 * @param {*} rx rectangle, x, center
 * @param {*} ry rectangle, y, center
 * @param {*} rh rectangle, height
 * @param {*} rw rectangle, width
 * @returns true if circle and rect collide, false otherwise
 */
function collision(cx, cy, cr, rx, ry, rh, rw) {
    // get closest point on rectangle edge to circle
    let closestX = Math.max(rx-rw/2, Math.min(cx, rx+rw/2));
    let closestY = Math.max(ry-rh/2, Math.min(cy, ry+rh/2));

    // x and y distance of that point to circle center
    let dx = cx - closestX;
    let dy = cy - closestY;

    // pythagoras without the square root, therefore radius of circle squared
    return dx*dx + dy*dy <= cr*cr
}