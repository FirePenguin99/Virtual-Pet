export class Bug {
  constructor(name, type, spawnX, spawnY, image) {
    this.birthday = new Date();

    this.name = name;
    this.type = type;
    this.food = 50;
    this.sleep = 50;
    this.cleanliness = 50;
    this.happiness = 50;

    this.x = spawnX;
    this.y = spawnY;

    this.width = 20;
    this.height = 20;
    this.image = image;

    this.bounds = {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };

    this.behaviour = 'wants_to_wander';
    this.wanderInterval = 2000;
    this.wanderTimer = 0;
    this.moveDestination = { x: null, y: null };
  }

  reduceFood() {
    this.food -= 2;
    document.querySelector('#foodDisplay').textContent = 'food: ' + this.food;
  }

  updateStat(stat, value) {
    this.stat += value;
    document.querySelector('#' + stat + 'Display').textContent = stat + ': ' + this.stat;
  }

  reduceCleanliness() {
    this.cleanliness -= 2;
    document.querySelector('#cleanlinessDisplay').textContent = 'cleanliness: ' + this.cleanliness;
  }

  reduceSleep() {
    this.sleep -= 2;
    document.querySelector('#sleepDisplay').textContent = 'sleep: ' + this.sleep;
  }

  increaseFood() {
    this.food += 2;
    if (this.food > 100) { // Sets max number to 100
      this.food = 100;
    }
    document.querySelector('#foodDisplay').textContent = 'food: ' + this.food;
  }

  increaseCleanliness() {
    this.cleanliness += 2;
    if (this.cleanliness > 100) { // Sets max number to 100
      this.cleanliness = 100;
    }
    document.querySelector('#cleanlinessDisplay').textContent = 'cleanliness: ' + this.cleanliness;
  }

  increaseSleep() {
    this.sleep += 2;
    if (this.sleep > 100) { // Sets max number to 100
      this.sleep = 100;
    }
    document.querySelector('#sleepDisplay').textContent = 'sleep: ' + this.sleep;
  }

  calculateHappiness() {
    this.happiness = (this.food + this.cleanliness + this.sleep) / 3;
    document.querySelector('#happinessDisplay').textContent = 'happiness: ' + this.happiness;
  }


  draw(context, offset) {
    context.drawImage(this.image, this.x + offset.x, this.y + offset.y, this.width, this.height); // Adds actual position with visual offset from moving the camera/map.
  }

  recalculateBounds() {
    this.bounds = {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };
  }


  moveLerp(overallSpeed) { // speed is amount per second
    if (this.moveDestination.x === this.x && this.moveDestination.y === this.y) { // If the bug is at its destination then break
      this.behaviour = 'wants_to_wander';
      return;
    }

    const timeNeeded = Math.sqrt(Math.pow(this.moveDestination.x - this.x, 2) + Math.pow(this.moveDestination.y - this.y, 2)) / overallSpeed; // time = distance / speed: distance is the difference between current position and destination position (pythagaros)

    const xSpeed = (this.moveDestination.x - this.x) / timeNeeded;
    const ySpeed = (this.moveDestination.y - this.y) / timeNeeded;


    if (Math.abs(this.moveDestination.x - this.x) <= Math.abs(xSpeed) && Math.abs(this.moveDestination.y - this.y) <= Math.abs(ySpeed)) { // If the bug is too close to the destination and the xSpeed and ySpeed will overshoot, teleport to final destination
      this.x = this.moveDestination.x;
      this.y = this.moveDestination.y;

      this.behaviour = 'wants_to_wander';
      return;
    }

    this.x += xSpeed;
    this.y += ySpeed;

    this.recalculateBounds(); // bug has moved, and therefore must recalculate its bounds so it can be clicked on correctly
  }

  wanderMovement(deltaTime) {
    if (this.wanderTimer > this.wanderInterval) { // If the wander timer is up, and the bug is ready to begin wandering:
      this.wanderTimer = 0;

      this.moveDestination = { x: ((Math.random() * 500 - 250 + this.x)), y: ((Math.random() * 500 - 250 + this.y)) };
      console.log(this.moveDestination);
      this.behaviour = 'moving'; // We get him moving

      this.wanderInterval = (Math.random() * 10000);
    }

    if (this.behaviour === 'moving') {
      this.moveLerp(2);
      // console.log(this.x + ", " + this.y);
    }
    this.wanderTimer += deltaTime;
  }
}

export class Queen extends Bug {
  constructor(name, spawnX, spawnY) {
    super(spawnX, spawnY);
    this.x = spawnX;
    this.y = spawnY;

    this.width = 50;
    this.height = 50;

    this.name = name;
    this.type = 'queen';

    this.image = document.querySelector('#queen_sprite');
  }
}

export class Worker extends Bug {
  constructor(name, spawnX, spawnY) {
    super(spawnX, spawnY);
    this.x = spawnX;
    this.y = spawnY;

    this.width = 20;
    this.height = 20;

    this.name = name;
    this.type = 'worker';

    this.image = document.querySelector('#worker_sprite');
  }
}
