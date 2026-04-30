

let leftX
let leftY
let leftHeight
let leftWidth
let leftVelocity

let rightX
let rightY
let rightHeight
let rightWidth
let rightVelocity


let circleX
let circleY
let circleRadius
let circleVX
let circleVY

function initGameVars() {
  leftX = 0.1 * width;
  leftY = 0.5 * height;
  leftHeight = 0.1 * height;
  leftWidth = leftHeight / 4;
  leftVelocity = 0.15 * height;

  rightX = 0.9 * width;
  rightY = 0.5 * height;
  rightHeight = 0.1 * height;
  rightWidth = rightHeight / 4;
  rightVelocity = 0.15 * height;

  circleX = 0.5 * width;
  circleY = 0.5 * height;
  circleRadius = 0.01 * width;
  circleVX = -200;
  circleVY = 20;

  rectMode(CENTER)
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

    if (circleVX < 0) {
        // ball going left
        if (collision(circleX, circleY, circleRadius, leftX, leftY, leftHeight, leftWidth)) {
            circleVX = -circleVX;
        }
    }
    else if (circleVX > 0) {
        // ball going right
        if (rightCollision()) {
            circleVX = -circleVX;
        }
    }
    else {
        alert("So the ball is stuck, huh.");
    }
    if (circleY + circleRadius >= height && circleVY > 0) {
        circleVY = -circleVY;
    }
    else if (circleY + circleRadius <= 0 && circleVY < 0) {
        circleVY = -circleVY;
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
    if (keyIsPressed) {
        if (keyCode === 87) {
            //up
            rightY -= deltaTime/1000 * rightVelocity;
        }
        if (keyCode === 83) {
            //down
            rightY += deltaTime/1000 * rightVelocity;
        }
    }

    fill('black');
    stroke('black');
    rect(rightX, rightY, rightWidth, rightHeight);
}

function distancePythagoras(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(ax-bx, 2) + Math.pow(ay-by, 2));
}

function leftCollision() {
    if (leftX - leftWidth / 2 < circleX && circleX < leftX + leftWidth / 2) {
        // circle is above or below the horizontal edges of rectangle
        // check if distance between centres is less than radius + half the height
        return Math.abs(circleY - leftY) < (circleRadius + leftHeight / 2)
    }
    if (circleX > leftX + leftWidth / 2) {
        // ball is somewhere in front of the paddle
        if (circleY < leftY - leftHeight / 2) {
            // the center is above and to the right of the top right corner
            // if it is closer to the corner than the radius, the corner is within the circle -> collision
            return distancePythagoras(leftX + leftWidth/2, leftY - leftHeight/2, circleX, circleY) < circleRadius
        }
        if (circleY > leftY + leftHeight / 2) {
            // the center is below and to the right of the bottom right corner
            // if it is closer to the corner than the radius, the corner is within the circle -> collision
            return distancePythagoras(leftX + leftWidth/2, leftY + leftHeight/2, circleX, circleY) < circleRadius
        }
        // remaining case: circle is right in front of the right edge of the rectangle
        // if the x distance between the centres is less than half the width + radius, then collision
        return Math.abs(leftX - circleX) < Math.abs(leftWidth / 2 + circleRadius)
    }
    // ball is behind the paddle, we no longer care
    return false;
}

function rightCollision() {
    if (rightX - rightWidth / 2 < circleX && circleX < rightX + rightWidth / 2) {
        // circle is above or below the horizontal edges of rectangle
        // check if distance between centres is less than radius + half the height
        return Math.abs(circleY - rightY) < (circleRadius + rightHeight / 2)
    }
    if (circleX < rightX - rightWidth / 2) {
        // ball is somewhere in front of the paddle
        if (circleY < rightY - rightHeight / 2) {
            // the center is above and to the left of the top left corner
            // if it is closer to the corner than the radius, the corner is within the circle -> collision
            return distancePythagoras(rightX - rightWidth/2, rightY - rightHeight/2, circleX, circleY) < circleRadius
        }
        if (circleY > rightY + rightHeight / 2) {
            // the center is below and to the left of the bottom left corner
            // if it is closer to the corner than the radius, the corner is within the circle -> collision
            return distancePythagoras(rightX - rightWidth/2, rightY + rightHeight/2, circleX, circleY) < circleRadius
        }
        // remaining case: circle is right in front of the left edge of the rectangle
        // if the x distance between the centres is less than half the width + radius, then collision
        return Math.abs(rightX - circleX) < Math.abs(rightWidth / 2 + circleRadius)
    }
    // ball is behind the paddle, we no longer care
    return false;
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