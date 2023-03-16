import { Entity } from './entity.mjs';

export class Building extends Entity {
  constructor(name, spawnX, spawnY, width, height, image) {
    super(spawnX, spawnY);
    this.name = name;

    this.x = spawnX;
    this.y = spawnY;

    this.width = width;
    this.height = height;

    this.image = image;

    this.stage = 0;
    this.imageStages = []; // stage_1, stage_2, ... , complete

    this.underConstruction = true;
    this.constructionProgress = { // building construction time in seconds
      current: 0,
      complete: 10,
    };
  }

  construct(amount) {
    this.constructionProgress.current += amount;
    if (this.constructionProgress.current > this.constructionProgress.complete) {
      this.underConstruction = false;
    } else if (this.underConstruction && this.constructionProgress.current > (this.constructionProgress.complete / this.imageStages.length) * this.stage + 1) {
      console.log('stage: ' + this.stage);
      this.image = this.imageStages[this.stage];
      this.stage += 1;
    }
  }
}

export class FoodStorageBuilding extends Building {
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

    this.constructionProgress.complete = 15; // building completion time in seconds

    this.imageStages[0] = document.querySelector('#food_storage_stage_0_sprite');
    this.imageStages[1] = document.querySelector('#food_storage_stage_1_sprite');
    this.imageStages[2] = document.querySelector('#food_storage_stage_2_sprite');
    this.imageStages[3] = document.querySelector('#food_storage_sprite');


    this.foodInventory = 0;

    this.name = 'food storage';
    this.image = this.imageStages[0];
  }

  increaseFood(amount) {
    this.foodInventory += amount;
  }

  decreaseFood(amount) {
    this.foodInventory -= amount;
  }
}

export class SleepingDenBuilding extends Building {
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

    this.constructionProgress.complete = 10; // building completion time in seconds

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
