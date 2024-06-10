const body = document.querySelector("body");
body.style.backgroundColor = "#f0f0f0";

// Creating the boundary
const boundary = document.createElement("div");
boundary.style.width = "90vw";
boundary.style.height = "90vh";
boundary.style.border = "2px solid red";
boundary.style.position = "relative";
boundary.style.margin = "auto";
boundary.style.marginTop = "2%";
document.body.appendChild(boundary);

// Creating the ball
class Ball {
  constructor(
    xPosition = 0,
    yPosition = 0,
    ballRadius = 20,
    ballColor = "red",
    ballSpeed = 2
  ) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.ballRadius = ballRadius;
    this.ballColor = ballColor;
    this.ballSpeed = ballSpeed;

    this.xVelocity = (Math.random() * 4 - 2) * this.ballSpeed;
    this.yVelocity = (Math.random() * 4 - 2) * this.ballSpeed;

    this.element = document.createElement("div");
    this.element.style.left = `${this.xPosition}px`;
    this.element.style.top = `${this.yPosition}px`;
    this.element.style.width = `${this.ballRadius * 2}px`;
    this.element.style.height = `${this.ballRadius * 2}px`;
    this.element.style.background = this.ballColor;
    this.element.style.position = "absolute";
    this.element.style.borderRadius = "50%";
  }

  // Control the movement of the ball
  ballMovement() {
    this.xPosition += this.xVelocity;
    this.yPosition += this.yVelocity;

    // Checking collision with the boundary on x-axis
    if (this.xPosition <= 0) {
      this.xPosition = 0;
      this.xVelocity *= -1;
    }
    if (this.xPosition + this.ballRadius * 2 >= boundary.clientWidth) {
      this.xPosition = boundary.clientWidth - this.ballRadius * 2;
      this.xVelocity *= -1;
    }

    // Checking collision with the boundary on y-axis
    if (this.yPosition <= 0) {
      this.yPosition = 0;
      this.yVelocity *= -1;
    }
    if (this.yPosition + this.ballRadius * 2 >= boundary.clientHeight) {
      this.yPosition = boundary.clientHeight - this.ballRadius * 2;
      this.yVelocity *= -1;
    }

    this.element.style.left = `${this.xPosition}px`;
    this.element.style.top = `${this.yPosition}px`;
  }

  // Checking collision with another ball
  ballCollision(nextBall) {
    const xDistance = this.xPosition - nextBall.xPosition;
    const yDistance = this.yPosition - nextBall.yPosition;
    const totalDistance = Math.sqrt(
      xDistance * xDistance + yDistance * yDistance
    );

    if (totalDistance < this.ballRadius + nextBall.ballRadius) {
      // Elastic collision
      const v1x =
        (this.xVelocity * (this.ballRadius - nextBall.ballRadius) +
          2 * nextBall.ballRadius * nextBall.xVelocity) /
        (this.ballRadius + nextBall.ballRadius);
      const v1y =
        (this.yVelocity * (this.ballRadius - nextBall.ballRadius) +
          2 * nextBall.ballRadius * nextBall.yVelocity) /
        (this.ballRadius + nextBall.ballRadius);
      const v2x =
        (nextBall.xVelocity * (nextBall.ballRadius - this.ballRadius) +
          2 * this.ballRadius * this.xVelocity) /
        (this.ballRadius + nextBall.ballRadius);
      const v2y =
        (nextBall.yVelocity * (nextBall.ballRadius - this.ballRadius) +
          2 * this.ballRadius * this.yVelocity) /
        (this.ballRadius + nextBall.ballRadius);

      this.xVelocity = v1x;
      this.yVelocity = v1y;
      nextBall.xVelocity = v2x;
      nextBall.yVelocity = v2y;

      // Calculating overalap and adjusting position
      const overlapDistance =
        this.ballRadius + nextBall.ballRadius - totalDistance;
      const collisionAngle = Math.atan2(yDistance, xDistance);
      const overlapX = overlapDistance * Math.cos(collisionAngle);
      const overlapY = overlapDistance * Math.sin(collisionAngle);

      this.xPosition += overlapX / 2;
      this.yPosition += overlapY / 2;
      nextBall.xPosition -= overlapX / 2;
      nextBall.yPosition -= overlapY / 2;
    }
  }
}

// Random values for the ball properties
function randomProperty() {
  function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  const randomColour = randomColor();
  const randomRadius = 5 + Math.floor(Math.random() * 16);

  const maxX = boundary.clientWidth - randomRadius * 2;
  const maxY = boundary.clientHeight - randomRadius * 2;
  const randomX = Math.ceil(Math.random() * maxX);
  const randomY = Math.ceil(Math.random() * maxY);
  const randomSpeed = Math.random() * (5 - 2) + 2;

  return {
    xPosition: randomX,
    yPosition: randomY,
    ballRadius: randomRadius,
    ballColor: randomColour,
    ballSpeed: randomSpeed,
  };
}

// Creating the ball array
const ballArray = [];
const balllCount = 100 + Math.floor(Math.random() * 300);
for (let i = 0; i < balllCount; i++) {
  const { xPosition, yPosition, ballRadius, ballColor, ballSpeed } =
    randomProperty();
  const ball = new Ball(xPosition, yPosition, ballRadius, ballColor, ballSpeed);
  boundary.appendChild(ball.element);
  ballArray.push(ball);
}

function movingBall() {
  ballArray.forEach((ball1) => {
    ball1.ballMovement();

    for (let i = 0; i < ballArray.length; i++) {
      if (ball1 !== ballArray[i]) {
        ball1.ballCollision(ballArray[i]);
      }
    }
  });

  requestAnimationFrame(movingBall);
}

movingBall();
