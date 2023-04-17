export class Bug {
  constructor(name, type, spawnX, spawnY, image) {
    this.birthday = new Date();

    this.name = name;
    this.type = type;
    this.food = 30;
    this.sleep = 30;
    this.cleanliness = 30;
    this.happiness = 100;

    this.x = spawnX;
    this.y = spawnY;

    this.width = 20;
    this.height = 20;
    this.image = image;

    this.debuffList = [];


    this.bounds = {
      left: this.x - (this.width / 2),
      right: this.x + (this.width / 2),
      top: this.y - (this.height / 2),
      bottom: this.y + (this.height / 2),
    };

    this.behaviour = 'wandering'; // describes the actions the bug wants to do or is currently doing
    this.movingState = 'idle'; // describes if the bug is moving or idle
    this.wanderInterval = 2000;
    this.wanderTimer = 0;
    this.moveDestination = { x: null, y: null };

    this.harvestTarget = null;
    this.storeTarget = null;
    this.foodInventory = 0;

    this.isInDen = false;

    this.entityTarget = null;
  }


  reduceFood() {
    this.food -= 2;
    document.querySelector('#foodDisplay').textContent = 'food: ' + this.food;
  }

  reduceCleanliness() {
    this.cleanliness -= 2;
    document.querySelector('#cleanlinessDisplay').textContent = 'cleanliness: ' + this.cleanliness;
  }

  reduceSleep() {
    this.sleep -= 2;
    document.querySelector('#sleepDisplay').textContent = 'sleep: ' + this.sleep;
  }

  increaseFood(amount) {
    this.food += amount;
    if (this.food > 100) { // Sets max number to 100
      this.food = 100;
    }
    document.querySelector('#foodDisplay').textContent = 'food: ' + this.food;
  }

  increaseCleanliness(amount) {
    this.cleanliness += amount;
    if (this.cleanliness > 100) { // Sets max number to 100
      this.cleanliness = 100;
    }
    document.querySelector('#cleanlinessDisplay').textContent = 'cleanliness: ' + this.cleanliness;
  }

  increaseSleep(amount) {
    this.sleep += amount;
    if (this.sleep > 100) { // Sets max number to 100
      this.sleep = 100;
    }
    document.querySelector('#sleepDisplay').textContent = 'sleep: ' + this.sleep;
  }


  draw(context, offset) {
    context.drawImage(this.image, this.x + offset.x - (this.width / 2), this.y + offset.y - (this.height / 2)); // Adds actual position with visual offset from moving the camera/map. Subtracting the half height and width makes the x and y coords of the bug represent it's center, rather than top left edge.
    this.drawDebuffs(context, offset);
  }

  drawDebuffs(context, offset) {
    // debuffScaler calculates the amount left (x) the debuffs will need to start.
    const debuffScaler = ((0.5 * this.debuffList.length)) - 0.5;
    for (let i = 0; i < this.debuffList.length; i++) {
      // debuffs start being placed at the debuffScaler, then add by 1 every next debuff. The '* 20' is the amount scaled up to be the correct amount of pixels.
      context.drawImage(this.debuffList[i], this.x + offset.x - ((-1 * debuffScaler + i) * 20) - 10, this.y + offset.y - (this.height) - 10);
    }
  }

  recalculateBounds() {
    this.bounds = {
      left: this.x - (this.width / 2),
      right: this.x + (this.width / 2),
      top: this.y - (this.height / 2),
      bottom: this.y + (this.height / 2),
    };
  }


  calculateSpeed() {
    if (this.sleep > 80) {
      return 4;
    } else if (this.sleep < 20) {
      return 1;
    } else {
      return this.sleep / 20;
    }
  }

  moveLerp(overallSpeed) { // speed is amount per second
    // If the bug is at its destination then depending on why they travelled, do something
    if (this.moveDestination.x === this.x && this.moveDestination.y === this.y) {
      this.movingState = 'idle';

      if (this.behaviour === 'harvesting') {
        this.withdrawFood(10);
      } else if (this.behaviour === 'storing') {
        this.depositFood(10);
      } else if (this.behaviour === 'moveToDen') {
        this.enterDen();
        this.isInDen = true;
      } else if (this.behaviour === 'moveToBuilding') {
        this.behaviour = 'building';
      } else if (this.behaviour === 'moveToFood') {
        this.behaviour = 'feeding';
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

  moveToBehaviour(target) {
    this.moveDestination.x = target.x;
    this.moveDestination.y = target.y;
    this.movingState = 'moving';
  }

  setBehaviour() { // first argument will always be the behaviour to set, the others will be specific parameters to the behaviour specified
    if (arguments.length === 0) {
      // return;
    } else if (arguments[0] === 'wandering') {
      this.behaviour = 'wandering';
      this.movingState = 'idle'; // describes if the bug is moving or idle
      this.wanderInterval = 2000;
      this.wanderTimer = 0;
    } else if (arguments[0] === 'harvesting') {
      this.behaviour = 'harvesting';
      this.harvestTarget = arguments[1];
      this.storeTarget = arguments[2];
    } else if (arguments[0] === 'sleeping') {
      this.behaviour = 'sleeping';
    } else if (arguments[0] === 'moveToDen') {
      this.behaviour = 'moveToDen';
      this.entityTarget = arguments[1];
    } else if (arguments[0] === 'building') {
      this.behaviour = 'moveToBuilding';
      this.entityTarget = arguments[1];
    } else if (arguments[0] === 'moveToFood') {
      this.behaviour = 'moveToFood';
      this.entityTarget = arguments[1];
    }
  }

  runBehaviourLogic(deltaTime) {
    if (this.behaviour === 'wandering') {
      this.wanderingBehaviour(deltaTime);
    } else if (this.behaviour === 'harvesting') { // if harvesting then set its movement target to the coords of the harvest target
      this.moveToBehaviour(this.harvestTarget);
    } else if (this.behaviour === 'storing') { // if storing then set its movement target to the coords of the storing target
      this.moveToBehaviour(this.storeTarget);
    } else if (this.behaviour === 'sleeping') {
      this.sleepingBehaviour(deltaTime);
    } else if (this.behaviour === 'moveToDen') {
      this.moveToBehaviour(this.entityTarget);
    } else if (this.behaviour === 'moveToBuilding') {
      this.moveToBehaviour(this.entityTarget);
    } else if (this.behaviour === 'building') {
      this.startBuilding(deltaTime);
    } else if (this.behaviour === 'moveToFood') {
      this.moveToBehaviour(this.entityTarget);
    } else if (this.behaviour === 'feeding') {
      this.startFeeding(deltaTime);
    }

    if (this.movingState === 'moving') {
      this.moveLerp(this.calculateSpeed());
    }
  }

  wanderingBehaviour(deltaTime) {
    if (this.wanderTimer > this.wanderInterval) { // If the wander timer is up, and the bug is ready to begin wandering:
      this.wanderTimer = 0;

      this.moveDestination = { x: ((Math.random() * 500 - 250 + this.x)), y: ((Math.random() * 500 - 250 + this.y)) };
      this.movingState = 'moving'; // We get him moving. Don't call moveLerp here, as this section only occurs once every time the wander timer has ran out, therefore won't activate every frame.

      this.wanderInterval = (Math.random() * 10000);
    }
    this.wanderTimer += deltaTime;
  }

  sleepingBehaviour() {
    if (this.sleep >= 100) { // if finished sleeping
      if (this.isInDen) { // if its in a den,
        this.entityTarget.removeTenant(this);
      } else { // if its sleeping on the floor,
        this.setBehaviour('wandering');
      }
    } else { // if sleeping,
      this.movingState = 'idle';
    }
  }

  enterDen() {
    this.entityTarget.addTenant(this);
  }

  startBuilding(deltaTime) {
    if (!this.entityTarget.underConstruction) {
      this.behaviour = 'wandering';
      this.entityTarget = null;
      return;
    }
    if (this.wanderTimer > this.wanderInterval) { // If the wander timer is up, and the bug is ready to begin wandering:
      this.wanderTimer = 0;

      this.moveDestination = { x: ((Math.random() * this.entityTarget.width - (this.entityTarget.width / 2) + this.entityTarget.x)), y: ((Math.random() * this.entityTarget.height - (this.entityTarget.height / 2) + this.entityTarget.y)) };

      this.movingState = 'moving'; // We get him moving. Don't call moveLerp here, as this section only occurs once every time the wander timer has ran out, therefore won't activate every frame.

      this.wanderInterval = (Math.random() * 3000);
    }
    this.wanderTimer += deltaTime;

    this.entityTarget.construct(deltaTime / 1000);
  }

  startFeeding(deltaTime) {
    if (this.entityTarget.foodInventory > 0 && this.food < 100) {
      this.food += (deltaTime / 1000 * 5);
      this.entityTarget.decreaseFood(deltaTime / 1000 * 5);
    } else {
      this.behaviour = 'wandering';
      this.entityTarget = null;
    }
  }


  withdrawFood(amount) {
    if (this.harvestTarget.foodInventory <= 0) {
      this.behaviour = 'wandering';
    } else {
      this.harvestTarget.decreaseFood(amount);
      this.foodInventory += amount;
      this.behaviour = 'storing';
    }
  }

  depositFood(amount) {
    if (this.storeTarget.foodInventory >= this.storeTarget.foodMax) {
      this.behaviour = 'wandering';
    } else {
      this.storeTarget.increaseFood(amount);
      this.foodInventory -= amount;
      this.behaviour = 'harvesting';
    }
  }

  cancelActivity() {
    this.behaviour = 'wandering';
    this.movingState = 'idle';

    this.harvestTarget = null;
    this.storeTarget = null;
    this.entityTarget = null;
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
