export class Entity {
  constructor(name, spawnX, spawnY, width, height, image) {
    this.name = name;

    this.x = spawnX;
    this.y = spawnY;

    this.width = width;
    this.height = height;

    this.image = image;

    this.bounds = {
      left: this.x - (this.width / 2),
      right: this.x + (this.width / 2),
      top: this.y - (this.height / 2),
      bottom: this.y + (this.height / 2),
    };
  }

  draw(context, offset) {
    context.drawImage(this.image, this.x + offset.x - (this.width / 2), this.y + offset.y - (this.height / 2), this.width, this.height); // Adds actual position with visual offset from moving the camera/map. Subtracting the half height and width makes the x and y coords of the bug represent it's center, rather than top left edge.
    // context.fillRect(this.x + offset.x, this.y + offset.y, 5, 5);

    // context.fillRect(this.bounds.left + offset.x, this.bounds.top + offset.y, 5, 5); // top left
    // context.fillRect(this.bounds.right + offset.x, this.bounds.top + offset.y, 5, 5); // top right
    // context.fillRect(this.bounds.left + offset.x, this.bounds.bottom + offset.y, 5, 5); // bottom left
    // context.fillRect(this.bounds.right + offset.x, this.bounds.bottom + offset.y, 5, 5); // bottom right
  }

  recalculateBounds() {
    this.bounds = {
      left: this.x - (this.width / 2),
      right: this.x + (this.width / 2),
      top: this.y - (this.height / 2),
      bottom: this.y + (this.height / 2),
    };
  }
}


export class FoodEntity extends Entity {
  constructor(spawnX, spawnY) {
    super(spawnX, spawnY);
    this.x = spawnX;
    this.y = spawnY;
    this.type = 1;

    this.width = 150;
    this.height = 65;

    this.bounds = { // need to instantiate bounds as the object doesn't move, and therefore won't use the function recalcuateBounds()
      left: this.x - (this.width / 2),
      right: this.x + (this.width / 2),
      top: this.y - (this.height / 2),
      bottom: this.y + (this.height / 2),
    };

    this.foodInventory = 100;

    this.name = 'large leaf';
    this.image = document.querySelector('#food_resource_1');
  }

  decreaseFood(amount) {
    this.foodInventory -= amount;
  }
}

export class FoodStorageBuilding extends Entity {
  constructor(spawnX, spawnY) {
    super();
    this.x = spawnX;
    this.y = spawnY;

    this.width = 150;
    this.height = 150;

    this.bounds = { // need to instantiate bounds as the object doesn't move, and therefore won't use the function recalcuateBounds()
      left: this.x - (this.width / 2),
      right: this.x + (this.width / 2),
      top: this.y - (this.height / 2),
      bottom: this.y + (this.height / 2),
    };

    this.constructionProgress = { // building construction time in seconds
      current: 0,
      complete: 15,
    };

    this.foodInventory = 0;

    this.name = 'food storage';
    this.image = document.querySelector('#food_storage_sprite');
  }

  increaseFood(amount) {
    this.foodInventory += amount;
  }

  decreaseFood(amount) {
    this.foodInventory -= amount;
  }
}

export class SleepingDenBuilding extends Entity {
  constructor(spawnX, spawnY) {
    super();
    this.x = spawnX;
    this.y = spawnY;

    this.width = 150;
    this.height = 100;

    this.bounds = { // need to instantiate bounds as the object doesn't move, and therefore won't use the function recalcuateBounds()
      left: this.x - (this.width / 2),
      right: this.x + (this.width / 2),
      top: this.y - (this.height / 2),
      bottom: this.y + (this.height / 2),
    };

    this.constructionProgress = { // building construction time in seconds
      current: 0,
      complete: 10,
    };

    this.occupancy = 0;
    this.maxOccupancy = 5;
    this.tenants = [];

    this.name = 'sleeping den';
    this.image = document.querySelector('#sleeping_den_sprite');
  }

  addTenant(bugObj) {
    if (this.occupancy === this.maxOccupancy) {
      console.log('den is full');
    } else {
      this.tenants.push(bugObj);
      this.occupancy += 1;
      bugObj.x = 10000;
      bugObj.y = 10000; // teleport bug far away to look like they've entered the den
      bugObj.recalculateBounds();
      bugObj.setBehaviour('sleeping');
    }
  }

  removeTenant(bugObj) {
    const tenantIndex = this.tenants.indexOf(bugObj);
    this.tenants.splice(tenantIndex, 1);
    this.occupancy -= 1;
    bugObj.x = this.x;
    bugObj.y = this.y; // teleport bug back to the den to look like they've left the den
    bugObj.setBehaviour('wandering');
    bugObj.isInDen = false;
  }
}

export class GravestoneEntity extends Entity {
  constructor(bugObj, cause) {
    super(bugObj);
    this.ownerBug = bugObj;
    this.x = this.ownerBug.x;
    this.y = this.ownerBug.y;
    this.width = 30;
    this.height = 30;

    this.name = this.ownerBug.name + "'s grave";

    this.bounds = { // need to instantiate bounds as the object doesn't move, and therefore won't use the function recalcuateBounds()
      left: this.x - (this.width / 2),
      right: this.x + (this.width / 2),
      top: this.y - (this.height / 2),
      bottom: this.y + (this.height / 2),
    };

    this.bugBirthday = this.ownerBug.birthday;
    this.bugDeathday = new Date();
    this.bugTimeAlive = this.calculateTimeAlive();
    this.causeOfDeath = cause;

    this.image = document.querySelector('#gravestone_sprite');
  }

  calculateTimeAlive() {
    const hours = Math.floor((new Date() - this.bugBirthday) / 1000 / 60 / 60);
    const minutes = Math.floor((new Date() - this.bugBirthday) / 1000 / 60) - (60 * hours);
    const seconds = Math.floor((new Date() - this.bugBirthday) / 1000) - (60 * minutes);
    return { hours, minutes, seconds };
  }
}

export class SelectionEntity extends Entity {
  constructor() {
    super();
    this.name = 'selection';
    this.bounds = null;
    this.image = document.querySelector('#selection_sprite');
  }

  drawSelectedObject(currentObj, context, offset) {
    if (currentObj === null) {
      return;
    }
    this.x = currentObj.x;
    this.y = currentObj.y + (currentObj.height / 2); // moves to the bottom of the selected object
    this.width = currentObj.width * 1.1;
    this.height = currentObj.width * 1.1 / 3;

    this.draw(context, offset);
  }
}
