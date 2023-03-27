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

export class TemplateBuildingEntity extends Entity {
  constructor(name, spawnX, spawnY, width, height, image) {
    super(name, spawnX, spawnY, width, height, image);
    this.canPlace = true;

    document.querySelector('#acceptAndCancel').style.display = 'flex';

    document.querySelector('#acceptAndCancel').style.top = (this.bounds.bottom - 10) + 'px';
    document.querySelector('#acceptAndCancel').style.left = (this.bounds.left - 10) + 'px';
  }

  draw(context, offset) {
    if (this.canPlace) {
      context.globalAlpha = 0.5;
      context.fillStyle = '#00FF00'; // green highlight to the image
      context.fillRect(this.bounds.left + offset.x, this.bounds.top + offset.y, this.width, this.height);
    } else {
      context.globalAlpha = 0.5;
      context.fillStyle = '#FF0000'; // red highlight to the image
      context.fillRect(this.bounds.left + offset.x, this.bounds.top + offset.y, this.width, this.height);
    }
    context.drawImage(this.image, this.x + offset.x - (this.width / 2), this.y + offset.y - (this.height / 2), this.width, this.height); // Adds actual position with visual offset from moving the camera/map. Subtracting the half height and width makes the x and y coords of the bug represent it's center, rather than top left edge.
  }

  moveToCursor(cursorCoords, offset) {
    this.x = cursorCoords.x - offset.x;
    this.y = cursorCoords.y - offset.y;
    this.recalculateBounds();
  }

  moveAcceptCancelButtons(cursorCoords, offset) {
    document.querySelector('#acceptAndCancel').style.top = (this.bounds.bottom - 10 + offset.y) + 'px';
    document.querySelector('#acceptAndCancel').style.left = (this.bounds.left - 10 + offset.x) + 'px';
  }

  checkCollisions(entityList) {
    for (const entity of entityList) {
      if (this.bounds.left >= entity.bounds.left && // top left
      this.bounds.left <= entity.bounds.right &&
      this.bounds.top >= entity.bounds.top &&
      this.bounds.top <= entity.bounds.bottom) {
        this.canPlace = false;
        return;
      } else if (this.bounds.right >= entity.bounds.left && // top right
      this.bounds.right <= entity.bounds.right &&
      this.bounds.top >= entity.bounds.top &&
      this.bounds.top <= entity.bounds.bottom) {
        this.canPlace = false;
        return;
      } else if (this.bounds.left >= entity.bounds.left && // bottom left
      this.bounds.left <= entity.bounds.right &&
      this.bounds.bottom >= entity.bounds.top &&
      this.bounds.bottom <= entity.bounds.bottom) {
        this.canPlace = false;
        return;
      } else if (this.bounds.right >= entity.bounds.left && // bottom right
      this.bounds.right <= entity.bounds.right &&
      this.bounds.bottom >= entity.bounds.top &&
      this.bounds.bottom <= entity.bounds.bottom) {
        this.canPlace = false;
        return;
      } else if (this.x >= entity.bounds.left && // middle
      this.x <= entity.bounds.right &&
      this.y >= entity.bounds.top &&
      this.y <= entity.bounds.bottom) {
        this.canPlace = false;
        return;
      } else if (this.bounds.left >= entity.bounds.left && // middle of left edge (some buildings were too tall and missing all the other corners)
      this.bounds.left <= entity.bounds.right &&
      this.bounds.top + (this.height / 2) >= entity.bounds.top &&
      this.bounds.top + (this.height / 2) <= entity.bounds.bottom) {
        this.canPlace = false;
        return;
      } else if (this.bounds.right >= entity.bounds.left && // middle of right edge (some buildings were too tall and missing all the other corners)
      this.bounds.right <= entity.bounds.right &&
      this.bounds.top + (this.height / 2) >= entity.bounds.top &&
      this.bounds.top + (this.height / 2) <= entity.bounds.bottom) {
        this.canPlace = false;
        return;
      } else {
        this.canPlace = true;
      }
      // console.log(this.canPlace);
    }
  }
}
