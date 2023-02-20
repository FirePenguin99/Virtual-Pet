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

export class GravestoneEntity extends Entity {
  constructor(bugObj) {
    super(bugObj);
    this.x = bugObj.x;
    this.y = bugObj.y;
    this.width = 30;
    this.height = 30;

    this.name = bugObj.name + "'s grave";

    this.bounds = { // need to instantiate bounds as the object doesn't move, and therefore won't use the function recalcuateBounds()
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };

    this.bugStats = {
      bugBirthday: bugObj.birthday,
      bugDeathday: new Date(),
      bugTimeAlive: Math.floor((new Date() - bugObj.birthday) / 1000 / 60 / 60) + ':' + Math.floor((new Date() - bugObj.birthday) / 1000 / 60) + ':' + Math.floor((new Date() - bugObj.birthday) / 1000),
    };

    this.image = document.querySelector('#gravestone_sprite');
  }
}
