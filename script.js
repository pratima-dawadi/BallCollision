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
    x_position = 0,
    y_position = 0,
    ball_radius = 20,
    ball_color = "red",
    ball_speed = 2
  ) {
    this.x_position = x_position;
    this.y_position = y_position;
    this.ball_radius = ball_radius;
    this.ball_color = ball_color;
    this.ball_speed = ball_speed;

    this.x_velocity = (Math.random() * 4 - 2) * this.ball_speed;
    this.y_velocity = (Math.random() * 4 - 2) * this.ball_speed;

    this.element = document.createElement("div");
    this.element.style.left = `${this.x_position}px`;
    this.element.style.top = `${this.y_position}px`;
    this.element.style.width = `${this.ball_radius * 2}px`;
    this.element.style.height = `${this.ball_radius * 2}px`;
    this.element.style.background = this.ball_color;
    this.element.style.position = "absolute";
    this.element.style.borderRadius = "50%";
  }

  // Control the movement of the ball
  ball_movement() {
    this.x_position += this.x_velocity;
    this.y_position += this.y_velocity;

    // Checking collision with the boundary on x-axis
    if (this.x_position <= 0) {
      this.x_position = 0;
      this.x_velocity *= -1;
    }
    if (this.x_position + this.ball_radius * 2 >= boundary.clientWidth) {
      this.x_position = boundary.clientWidth - this.ball_radius * 2;
      this.x_velocity *= -1;
    }

    // Checking collision with the boundary on y-axis
    if (this.y_position <= 0) {
      this.y_position = 0;
      this.y_velocity *= -1;
    }
    if (this.y_position + this.ball_radius * 2 >= boundary.clientHeight) {
      this.y_position = boundary.clientHeight - this.ball_radius * 2;
      this.y_velocity *= -1;
    }

    this.element.style.left = `${this.x_position}px`;
    this.element.style.top = `${this.y_position}px`;
  }

  // Checking collision with another ball
  ball_collision(next_ball) {
    const x_distance = this.x_position - next_ball.x_position;
    const y_distance = this.y_position - next_ball.y_position;
    const total_distance = Math.sqrt(
      x_distance * x_distance + y_distance * y_distance
    );

    if (total_distance < this.ball_radius + next_ball.ball_radius) {
      // Elastic collision
      const v1x =
        (this.x_velocity * (this.ball_radius - next_ball.ball_radius) +
          2 * next_ball.ball_radius * next_ball.x_velocity) /
        (this.ball_radius + next_ball.ball_radius);
      const v1y =
        (this.y_velocity * (this.ball_radius - next_ball.ball_radius) +
          2 * next_ball.ball_radius * next_ball.y_velocity) /
        (this.ball_radius + next_ball.ball_radius);
      const v2x =
        (next_ball.x_velocity * (next_ball.ball_radius - this.ball_radius) +
          2 * this.ball_radius * this.x_velocity) /
        (this.ball_radius + next_ball.ball_radius);
      const v2y =
        (next_ball.y_velocity * (next_ball.ball_radius - this.ball_radius) +
          2 * this.ball_radius * this.y_velocity) /
        (this.ball_radius + next_ball.ball_radius);

      this.x_velocity = v1x;
      this.y_velocity = v1y;
      next_ball.x_velocity = v2x;
      next_ball.y_velocity = v2y;

      // Calculating overalap and adjusting position
      const overlap_distance =
        this.ball_radius + next_ball.ball_radius - total_distance;
      const collision_angle = Math.atan2(y_distance, x_distance);
      const overlapX = overlap_distance * Math.cos(collision_angle);
      const overlapY = overlap_distance * Math.sin(collision_angle);

      this.x_position += overlapX / 2;
      this.y_position += overlapY / 2;
      next_ball.x_position -= overlapX / 2;
      next_ball.y_position -= overlapY / 2;
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

  const random_color = randomColor();
  const random_radius = 5 + Math.floor(Math.random() * 16);

  const maxX = boundary.clientWidth - random_radius * 2;
  const maxY = boundary.clientHeight - random_radius * 2;
  const random_x = Math.ceil(Math.random() * maxX);
  const random_y = Math.ceil(Math.random() * maxY);
  const random_speed = Math.random() * (5 - 2) + 2;

  return {
    x_position: random_x,
    y_position: random_y,
    ball_radius: random_radius,
    ball_color: random_color,
    ball_speed: random_speed,
  };
}

// Creating the ball array
const ballArray = [];
const ball_count = 100 + Math.floor(Math.random() * 300);
for (let i = 0; i < ball_count; i++) {
  const { x_position, y_position, ball_radius, ball_color, ball_speed } =
    randomProperty();
  const ball = new Ball(
    x_position,
    y_position,
    ball_radius,
    ball_color,
    ball_speed
  );
  boundary.appendChild(ball.element);
  ballArray.push(ball);
}

function moving_ball() {
  ballArray.forEach((ball1) => {
    ball1.ball_movement();

    for (let i = 0; i < ballArray.length; i++) {
      if (ball1 !== ballArray[i]) {
        ball1.ball_collision(ballArray[i]);
      }
    }
  });

  requestAnimationFrame(moving_ball);
}

moving_ball();
