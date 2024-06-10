document.addEventListener("DOMContentLoaded", () => {
  const canvas_container = document.getElementById("canvas-container");
  canvas_container.style.width = "100%";
  canvas_container.style.height = "90vh";

  //canvas
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas_container.clientWidth;
  canvas.height = canvas_container.clientHeight;
  canvas.style.border = "2px solid red";

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
    }

    createCircle() {
      ctx.beginPath();
      ctx.arc(this.xPosition, this.yPosition, this.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = this.ballColor;
      ctx.fill();
      ctx.closePath();
    }

    // Control the movement of the ball
    ballMovement() {
      this.xPosition += this.xVelocity;
      this.yPosition += this.yVelocity;

      // Checking collision with the boundary on x-axis
      if (this.xPosition - this.ballRadius <= 0) {
        this.xPosition = this.ballRadius;
        this.xVelocity *= -1;
      }
      if (this.xPosition + this.ballRadius >= canvas.width) {
        this.xPosition = canvas.width - this.ballRadius;
        this.xVelocity *= -1;
      }

      // Checking collision with the boundary on y-axis
      if (this.yPosition - this.ballRadius <= 0) {
        this.yPosition = this.ballRadius;
        this.yVelocity *= -1;
      }
      if (this.yPosition + this.ballRadius >= canvas.height) {
        this.yPosition = canvas.height - this.ballRadius;
        this.yVelocity *= -1;
      }
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

        // Calculating overlap and adjusting position
        const overlapDistance =
          this.ballRadius + nextBall.ballRadius - totalDistance;
        const collisionAngle = Math.atan2(yDistance, xDistance);
        const overlapXAdjustment = overlapDistance * Math.cos(collisionAngle);
        const overlapYAdjustment = overlapDistance * Math.sin(collisionAngle);

        this.xPosition += overlapXAdjustment / 2;
        this.yPosition += overlapYAdjustment / 2;
        nextBall.xPosition -= overlapXAdjustment / 2;
        nextBall.yPosition -= overlapYAdjustment / 2;
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

    const maxX = canvas.width - randomRadius;
    const maxY = canvas.height - randomRadius;
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
  const ballCount = 100 + Math.floor(Math.random() * 300);
  for (let i = 0; i < ballCount; i++) {
    const { xPosition, yPosition, ballRadius, ballColor, ballSpeed } =
      randomProperty();
    const ball = new Ball(
      xPosition,
      yPosition,
      ballRadius,
      ballColor,
      ballSpeed
    );
    ballArray.push(ball);
  }

  function movingBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ballArray.forEach((ball1) => {
      ball1.ballMovement();

      for (let i = 0; i < ballArray.length; i++) {
        if (ball1 !== ballArray[i]) {
          ball1.ballCollision(ballArray[i]);
        }
      }

      ball1.createCircle();
    });

    requestAnimationFrame(movingBall);
  }

  movingBall();
});
