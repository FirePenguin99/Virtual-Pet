export class Entity {
  constructor(name, spawnX, spawnY, image) {
    this.name = name;

    this.x = spawnX;
    this.y = spawnY;

    this.width = 3000;
    this.height = 3000;

    this.image = image;

    this.bounds = {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };
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
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };

    this.foodInventory = 100;

    this.name = 'large leaf';
    this.image = document.querySelector('#food_resource_1');
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
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };

    this.foodInventory = 0;

    this.name = 'food storage';
    this.image = document.querySelector('#food_storage_sprite');
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
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
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
