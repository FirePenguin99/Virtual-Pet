export class Bug {
  constructor(id, name, type, spawnX, spawnY, image) {
    this.id = id;
    console.log(this.id);

    this.birthday = new Date();

    this.name = name;
    this.type = type;
    this.food = 100;
    this.sleep = 100;
    this.cleanliness = 100;

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

    this.targetId = '';
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
    if (this.sleep > 60) {
      return 5;
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

      switch (this.behaviour) {
        case 'harvesting':
          this.withdrawFood(10);
          break;
        case 'storing':
          this.depositFood(10);
          break;
        case 'moveToDen':
          this.enterDen();
          this.isInDen = true;
          break;
        case 'moveToBuilding':
          this.behaviour = 'building';
          break;
        case 'moveToFood':
          this.behaviour = 'feeding';
          break;
        case 'moveToCorpse':
          this.behaviour = 'cleaning';
          break;
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
    switch (arguments[0]) {
      case 'wandering':
        this.behaviour = 'wandering';
        this.movingState = 'idle'; // describes if the bug is moving or idle
        this.wanderInterval = 2000;
        this.wanderTimer = 0;
        break;
      case 'moveToFood':
        this.behaviour = 'moveToFood';
        this.entityTarget = arguments[1];
        break;
      case 'building':
        this.behaviour = 'moveToBuilding';
        this.entityTarget = arguments[1];
        break;
      case 'harvesting':
        this.behaviour = 'harvesting';
        this.harvestTarget = arguments[1];
        this.storeTarget = arguments[2];
        break;
      case 'moveToDen':
        this.behaviour = 'moveToDen';
        this.entityTarget = arguments[1];
        break;
      case 'sleeping':
        this.behaviour = 'sleeping';
        break;
      case 'cleaning':
        this.behaviour = 'moveToCorpse';
        this.entityTarget = arguments[1];
        break;
    }
  }

  runBehaviourLogic(deltaTime) {
    switch (this.behaviour) {
      case 'wandering':
        this.wanderingBehaviour(deltaTime);
        break;
      case 'feeding':
        this.startFeeding(deltaTime);
        break;
      case 'building':
        this.startBuilding(deltaTime);
        break;
      case 'harvesting':
        this.moveToBehaviour(this.harvestTarget);
        break;
      case 'storing':
        this.moveToBehaviour(this.storeTarget);
        break;
      case 'sleeping':
        this.sleepingBehaviour(deltaTime);
        break;
      case 'cleaning':
        this.cleaningBehaviour(deltaTime);
        break;
      case 'moveToDen':
      case 'moveToBuilding':
      case 'moveToFood':
      case 'moveToCorpse':
        this.moveToBehaviour(this.entityTarget);
        break;
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

  startFeeding(deltaTime) {
    if (this.entityTarget.foodInventory > 0 && this.food < 100) {
      this.food += (deltaTime / 1000 * 5);
      this.entityTarget.decreaseFood(deltaTime / 1000 * 5);
    } else {
      this.behaviour = 'wandering';
      this.entityTarget = null;
    }
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

  sleepingBehaviour() {
    if (this.sleep >= 100) { // if finished sleeping
      if (this.isInDen) { // if its in a den,
        this.entityTarget.removeTenant(this.id);
      } else { // if its sleeping on the floor,
        this.setBehaviour('wandering');
      }
    } else { // if sleeping,
      this.movingState = 'idle';
    }
  }

  cleaningBehaviour(deltaTime) {
    this.entityTarget.cleanCorpse(deltaTime / 1000);

    if (this.entityTarget.cleaningProgress > 5) {
      this.behaviour = 'wandering';
      this.entityTarget = null;
    }
  }

  enterDen() {
    this.entityTarget.addTenant(this.id);
  }

  withdrawFood(amount) {
    // when bugs are loaded from another save their target attributes are null (since JSON loses the class data of the target, therefore need to reassign)
    if (this.harvestTarget === null) {
      this.harvestTarget = this.findTargetObj();
    }

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
  constructor(id, name, spawnX, spawnY) {
    super(id, spawnX, spawnY);
    this.id = id;
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
  constructor(id, name, spawnX, spawnY) {
    super(id, spawnX, spawnY);
    this.id = id;
    this.x = spawnX;
    this.y = spawnY;

    this.width = 20;
    this.height = 20;

    this.name = name;
    this.type = 'worker';

    this.image = document.querySelector('#worker_sprite');
  }
}
