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

    this.behaviour = 'wandering';
    this.movingState = 'idle';
    this.wanderInterval = 2000;
    this.wanderTimer = 0;
    this.moveDestination = { x: null, y: null };

    this.harvestTarget = null;
    this.storeTarget = null;
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
      this.movingState = 'idle';
      if (this.behaviour === 'harvesting') {
        this.behaviour = 'storing';
      } else if (this.behaviour === 'storing') {
        this.behaviour = 'harvesting';
      }
      return;
    }

    const timeNeeded = Math.sqrt(Math.pow(this.moveDestination.x - this.x, 2) + Math.pow(this.moveDestination.y - this.y, 2)) / overallSpeed; // time = distance / speed: distance is the difference between current position and destination position (pythagaros)

    const xSpeed = (this.moveDestination.x - this.x) / timeNeeded;
    const ySpeed = (this.moveDestination.y - this.y) / timeNeeded;


    if (Math.abs(this.moveDestination.x - this.x) <= Math.abs(xSpeed) && Math.abs(this.moveDestination.y - this.y) <= Math.abs(ySpeed)) { // If the bug is too close to the destination and the xSpeed and ySpeed will overshoot, teleport to final destination
      this.x = this.moveDestination.x;
      this.y = this.moveDestination.y;

      this.movingState = 'idle';
      return;
    }

    this.x += xSpeed;
    this.y += ySpeed;

    this.recalculateBounds(); // bug has moved, and therefore must recalculate its bounds so it can be clicked on correctly
  }

  behaviourLogic(deltaTime) {
    if (this.behaviour === 'wandering') {
      if (this.wanderTimer > this.wanderInterval) { // If the wander timer is up, and the bug is ready to begin wandering:
        this.wanderTimer = 0;

        this.moveDestination = { x: ((Math.random() * 500 - 250 + this.x)), y: ((Math.random() * 500 - 250 + this.y)) };
        this.movingState = 'moving'; // We get him moving. Don't call moveLerp here, as this section only occurs once every time the wander timer has ran out, therefore won't activate every frame.

        this.wanderInterval = (Math.random() * 10000);
      }
      this.wanderTimer += deltaTime;
    } else if (this.behaviour === 'harvesting') { // if harvesting then set its movement target to the coords of the harvest target
      this.moveDestination.x = this.harvestTarget.x;
      this.moveDestination.y = this.harvestTarget.y;
      this.movingState = 'moving';
    } else if (this.behaviour === 'storing') { // if storing then set its movement target to the coords of the storing target
      this.moveDestination.x = this.storeTarget.x;
      this.moveDestination.y = this.storeTarget.y;
      this.movingState = 'moving';
    }

    if (this.movingState === 'moving') {
      this.moveLerp(2);
    }
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
