import { Worker, Queen, Bug } from './bugs.mjs';
import { Entity, FoodEntity, GravestoneEntity, SelectionEntity } from './entity.mjs';
import { FoodStorageBuilding, SleepingDenBuilding } from './building.mjs';

window.addEventListener('load', () => {
  // Variables for initialising canvas in js
  const canvas = document.querySelector('#canvas1');
  const ctx = canvas.getContext('2d');

  const mapImage = document.querySelector('#map');

  let toggleHarvestSelecting = false;
  const selectedForHarvest = [];

  // Variables for mouse movement and map movement
  let mouseHold = false;
  let canvasMousePos = { x: null, y: null };
  const visualOffset = { x: null, y: null };
  let oldPos = null;

  let previousTimeStamp = 0; // initialising previousTimeStamp for use in updateFrame()
  const fpsCounter = document.querySelector('#fpsCounter');

  function updateFrame(timeStamp) { // function that happens every frame. timeStamp is a variable native to requestAnimationFrame function.
    //  ---- calculate deltaTime ----
    if (timeStamp == null) { timeStamp = 16.6666; } // This is because in the first frame the timestamp == null for some reason. Therefore when it does, just set it to what the value would approximately be so it doesn't break the rest of the code.
    const deltaTime = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;
    fpsCounter.textContent = 'FPS: ' + Math.floor(1000 / deltaTime);

    //  ---- set the canvas dimensions to the dimensions of the window ----
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    if (mouseHold) {
      moveMap(); // Calculates visual offset for map movement. Must be calculated before everything is drawn as to avoid a frames worth of delay.
    }

    // ---- For clearing and redrawing the objects in the scene, as well as bug behaviour  ----
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clears the entire canvas element

    ctx.fillStyle = '#808080'; // grey void behind the map image
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    mapObject.draw(ctx, visualOffset); // draw map image

    selectEntity.drawSelectedObject(currentObj, ctx, visualOffset);

    for (const bug of bugsList) { // Loop through array containing all Bugs, and call their draw() method.
      bug.draw(ctx, visualOffset);
      bug.runBehaviourLogic(deltaTime); // logic for each bug's behaviour
    }
    for (const entity of entityList) { // Loop through array containing all Entities, and call their draw() method.
      entity.draw(ctx, visualOffset);
    }

    entityList[1].construct(deltaTime / 1000);

    requestAnimationFrame(updateFrame); // call the function again
  }

  const mapObject = new Entity('map', 1000, 500, 3000, 3000, mapImage);

  let currentObj;
  const bugsList = [];
  const entityList = [];
  let bugNumber = 0;

  const selectEntity = new SelectionEntity();

  createNewBug('goob', 'queen');
  createNewBug('dude', 'worker');
  createNewBug('the dude', 'worker');
  createNewBug('dudest', 'worker');
  createNewBug('duderino', 'worker');
  createNewBug('the dudester', 'worker');
  createNewBug('dudeman', 'worker');


  createNewEntity('selection');
  console.log(entityList);

  createNewEntity('food');
  createNewBuilding('food_storage', 1000, 400);

  createNewBuilding('sleeping_den', 100, 100);
  createNewBuilding('sleeping_den', 300, 300);


  addListeners();
  updateFrame();
  decreaseStatsInterval();


  function selectObject() { // It compares the returned value of getMousePosition to the corner co-ordinates of all bugs in the game (probably slow).
    const bugsAndEntity = bugsList.concat(entityList); // combine bugs and entity arrays
    for (const obj of bugsAndEntity) {
      if (canvasMousePos.x >= obj.bounds.left + visualOffset.x && // Adds visualOffset to the bound calculates, rather than the bounds itself.
        canvasMousePos.x <= obj.bounds.right + visualOffset.x && // This prevents the bug's bounds not being able to be used in collision detection later on, And also the moving of the map is a user and visual feature, so adding visualOffset in selectBug (a user and visual feature) only makes sense.
        canvasMousePos.y >= obj.bounds.top + visualOffset.y && // If canvasMousePos is within the bounds of a Bug, set currentObj as the currently iterated bug, and log it's name.
        canvasMousePos.y <= obj.bounds.bottom + visualOffset.y) {
        console.log(obj.name);

        if (toggleHarvestSelecting) { // if selecting is in harvest mode,
          selectedForHarvest.push(obj);
          harvestLogic();
        } else { // if selecting is in normal mode,
          if (currentObj === obj) { // if the currently selected object will be selected again, skip a loop so that the next object below it is selected instead.
            // skip this round of the loop
          } else {
            currentObj = obj;
            UpdateStatDisplays();
            return;
          }
        }
      } else {
        console.log("No bug 'ere");
      }
    }
  }

  function toggleHold() { // Called by event listeners on mouse down and mouse up. Toggles a bool variable which represents the mouse's state
    mouseHold = !mouseHold;
    oldPos = null;
  }
  function calculateMousePos(event) { // Is run every time the mouse moves, and writes to a global variable.
    const bounds = canvas.getBoundingClientRect();
    canvasMousePos = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  }
  function moveMap() {
    if (oldPos == null) {
      oldPos = canvasMousePos;
    } else {
      visualOffset.x += (canvasMousePos.x - oldPos.x); // calculates movement of the mouse between frames and adds them to a total offset
      visualOffset.y += (canvasMousePos.y - oldPos.y);
      oldPos = canvasMousePos;
    }
  }

  function createNewBug(newBugName, newBugType) {
    // create object
    if (newBugType === 'queen') {
      bugsList.push(new Queen(newBugName, (Math.floor(Math.random() * 1000)), (Math.floor(Math.random() * 800))));
    } else if (newBugType === 'worker') {
      bugsList.push(new Worker(newBugName, (Math.floor(Math.random() * 1000)), (Math.floor(Math.random() * 800))));
    }

    console.log(bugsList);

    currentObj = bugsList[bugNumber];
    bugNumber = bugNumber + 1;
    UpdateStatDisplays();
  }
  function checkBugDeath(bugObj) {
    if (bugObj.food <= 0) {
      bugDeath(bugObj, 'food');
    } else if (bugObj.cleanliness <= 0) {
      bugDeath(bugObj, 'hygine');
    }
  }
  function bugDeath(bugObj, cause) {
    const bugIndex = bugsList.indexOf(bugObj);
    console.log('Your bug: ' + bugObj.name + ' has died due to a lack of ' + cause);
    entityList.push(new GravestoneEntity(bugObj, cause));
    bugsList.splice(bugIndex, 1);
    bugNumber += -1;
    if (currentObj === bugObj) {
      currentObj = null;
      UpdateStatDisplays();
    }
  }
  function deleteGrave(graveObj) {
    const graveIndex = entityList.indexOf(graveObj);
    console.log('Cleaned ' + graveObj.name);
    entityList.splice(graveIndex, 1);
    if (currentObj === graveObj) {
      currentObj = null;
      UpdateStatDisplays();
    }
  }

  function harvestSelecting() {
    if (currentObj.behaviour !== 'harvesting') { // start harvesting
      toggleHarvestSelecting = true;
      UpdateStatDisplays();
    } else { // cancel harvesting
      currentObj.setBehaviour('wandering');
      document.querySelector('#startHarvest').textContent = 'Press to start harvesting';
    }
  }
  function harvestLogic() {
    if (selectedForHarvest[0] instanceof FoodEntity) {
      // works
      document.querySelector('#foodSourceName').textContent = selectedForHarvest[0].name;
      document.querySelector('#harvestAlert').textContent = 'Select the food storage building for food to be deposited into';
    } else {
      selectedForHarvest.splice(0, 1);
      document.querySelector('#foodSourceName').textContent = '--';
      document.querySelector('#harvestAlert').textContent = 'Select the food source target';
      return;
    }
    if (selectedForHarvest[1] instanceof FoodStorageBuilding) {
      // works
      document.querySelector('#foodStorageName').textContent = selectedForHarvest[1].name;
      toggleHarvestSelecting = false;
      currentObj.setBehaviour('harvesting', selectedForHarvest[0], selectedForHarvest[1]);
      selectedForHarvest.splice(0, selectedForHarvest.length); // clear entire array for reuse later
      UpdateStatDisplays();
    } else {
      selectedForHarvest.splice(1, 1);
      document.querySelector('#foodStorageName').textContent = '--';
      document.querySelector('#harvestAlert').textContent = 'Select the food storage building for food to be deposited into';
    }
  }

  function findClosestDen() {
    if (currentObj.behaviour === 'sleeping') { // if already sleeping, then wake up
      currentObj.setBehaviour('wandering');
      document.querySelector('#findDen').textContent = 'Press to send the bug to the closest sleeping den';
      if (currentObj.isInDen) {
        currentObj.denTarget.removeTenant(currentObj);
      } else {
        currentObj.setBehaviour('wandering');
      }
    } else { // find closest den and set behaviour to moveToDen
      let closestDenValue = null;
      let closestDenObj = null;
      for (const building of entityList) { // Loop through array containing all buildings
        if (building instanceof SleepingDenBuilding && building.occupancy !== building.maxOccupancy) { // check if the building is a Den and that it is not full
          const distanceFromDen = Math.abs(Math.sqrt(Math.pow(currentObj.x - building.x, 2) + Math.pow(currentObj.y - building.y, 2)));
          // console.log(distanceFromDen);
          if (closestDenValue === null || distanceFromDen < closestDenValue) {
            closestDenValue = distanceFromDen;
            closestDenObj = building;
            // console.log(closestDenObj);
          }
        }
      }

      if (closestDenObj === null) {
        console.log('no dens found');
      } else {
        currentObj.setBehaviour('moveToDen', closestDenObj);
      }
    }
  }

  function createNewEntity(newEntityType) {
    if (newEntityType === 'food') {
      entityList.push(new FoodEntity(1000, 1000));
    }
  }
  function createNewBuilding(newBuildingType, spawnX, spawnY) {
    if (newBuildingType === 'food_storage') {
      entityList.push(new FoodStorageBuilding(spawnX, spawnY));
    } else if (newBuildingType === 'sleeping_den') {
      entityList.push(new SleepingDenBuilding(spawnX, spawnY));
    }
  }


  function UpdateStatDisplays() {
    // update all the attribute displays to represent the selected pet
    const childOfDiv = document.querySelector('#UI').children; // Hide all child elements of the UI div
    for (let index = 0; index < childOfDiv.length; index++) {
      childOfDiv[index].style.display = 'none';
    }

    if (currentObj === null) {
      return;
    }

    if (toggleHarvestSelecting) {
      document.querySelector('#harvestingElems').style.display = 'block';
      document.querySelector('#harvestBugName').textContent = currentObj.name;
      return;
    }

    document.querySelector('#nameDisplay').style.display = 'block';
    document.querySelector('#nameDisplay').textContent = 'name: ' + currentObj.name;

    if (currentObj instanceof Bug) { // Show and update only the relevent child elements
      document.querySelector('#bugButtons').style.display = 'block';

      document.querySelector('#foodDisplay').style.display = 'block';
      document.querySelector('#bugStats').style.display = 'block';

      document.querySelector('#foodDisplay').textContent = 'food: ' + currentObj.food;
      document.querySelector('#cleanlinessDisplay').textContent = 'cleanliness: ' + currentObj.cleanliness;
      document.querySelector('#sleepDisplay').textContent = 'sleep: ' + currentObj.sleep;
      document.querySelector('#happinessDisplay').textContent = 'happiness: ' + currentObj.happiness;

      if (currentObj.behaviour === 'harvesting') {
        document.querySelector('#startHarvest').textContent = 'Press to cancel harvesting';
      } else {
        document.querySelector('#startHarvest').textContent = 'Press to start harvesting';
      }

      if (currentObj.behaviour === 'sleeping') {
        document.querySelector('#findDen').textContent = 'Press to wake up';
      } else {
        document.querySelector('#findDen').textContent = 'Press to send the bug to the closest sleeping den';
      }

      if (currentObj instanceof Queen) {
        document.querySelector('#newBug').style.display = 'block';
      }
    } else if (currentObj instanceof FoodEntity || currentObj instanceof FoodStorageBuilding) {
      document.querySelector('#foodDisplay').style.display = 'block';
      document.querySelector('#foodDisplay').textContent = 'food stored: ' + currentObj.foodInventory;
    } else if (currentObj instanceof GravestoneEntity) {
      document.querySelector('#graveElems').style.display = 'block';
      document.querySelector('#birthdayDisplay').textContent = 'date of birth: ' + currentObj.bugBirthday.getDate() + '/' + (currentObj.bugBirthday.getMonth() + 1) + '/' + currentObj.bugBirthday.getFullYear();
      document.querySelector('#deathdayDisplay').textContent = 'date of death: ' + currentObj.bugDeathday.getDate() + '/' + (currentObj.bugDeathday.getMonth() + 1) + '/' + currentObj.bugDeathday.getFullYear();
      document.querySelector('#timeAliveDisplay').textContent = 'time survived: ' + currentObj.bugTimeAlive.hours + ':' + currentObj.bugTimeAlive.minutes + ':' + currentObj.bugTimeAlive.seconds;
      document.querySelector('#causeDisplay').textContent = 'cause of death: lack of ' + currentObj.causeOfDeath;
    } else if (currentObj instanceof SleepingDenBuilding) {
      document.querySelector('#denElems').style.display = 'block';
      document.querySelector('#occupancy').textContent = 'occupancy: ' + currentObj.occupancy + '/' + currentObj.maxOccupancy;
      for (const tenantButton of document.querySelector('#tenantButtons').children) { // loops through button elements and hides them all
        tenantButton.style.display = 'none';
      }
      for (const tenant of currentObj.tenants) { // loops through tenants in the den, and displays and updates buttons depending on the amount of tenants.
        const button = document.querySelector('#tenant_' + (currentObj.tenants.indexOf(tenant) + 1));
        button.style.display = 'block';
        button.textContent = tenant.name + "'s sleep: " + tenant.sleep + '/100' + '\n' + ' Press to wake up';
      }
    }
  }
  function decreaseStatsInterval() { // loops through array of bug objects then reduces each of their stats, on a timer of 5 seconds.
    for (const bug of bugsList) {
      if (bug.sleep <= 0 || bug.behaviour === 'sleeping') {
        bug.setBehaviour('sleeping');
        if (bug.isInDen) {
          bug.increaseSleep(10);
        } else {
          bug.increaseSleep(5);
        }
      } else {
        bug.reduceFood();
        bug.reduceSleep();
        bug.reduceCleanliness();
        bug.calculateHappiness();
      }


      checkBugDeath(bug);
    }
    setTimeout(decreaseStatsInterval, 5000);

    // update all the attribute displays to represent the selected pet
    UpdateStatDisplays();
  }

  function addListeners() { // Adds all the listeners to the elements and js variables. Event listeners usually cover user input.
    const feedButton = document.querySelector('#plusFood');
    feedButton.addEventListener('click', () => currentObj.increaseFood(2));
    const cleanButton = document.querySelector('#plusClean');
    cleanButton.addEventListener('click', () => currentObj.increaseCleanliness(2));
    const sleepButton = document.querySelector('#plusSleep');
    sleepButton.addEventListener('click', () => currentObj.increaseSleep(2));
    const starveButton = document.querySelector('#subFood');
    starveButton.addEventListener('click', () => currentObj.reduceFood());
    const dirtyButton = document.querySelector('#subClean');
    dirtyButton.addEventListener('click', () => currentObj.reduceCleanliness());
    const tireButton = document.querySelector('#subSleep');
    tireButton.addEventListener('click', () => currentObj.reduceSleep());

    const newBugButton = document.querySelector('#newBug');
    newBugButton.addEventListener('click', () => createNewBug(prompt("Insert new bug's Name", ''), 'worker'));

    const deleteGraveButton = document.querySelector('#deleteGrave');
    deleteGraveButton.addEventListener('click', () => deleteGrave(currentObj));

    const toggleHarvestButton = document.querySelector('#startHarvest');
    toggleHarvestButton.addEventListener('click', harvestSelecting);

    const findDenButton = document.querySelector('#findDen');
    findDenButton.addEventListener('click', () => findClosestDen());

    const canvas = document.getElementById('canvas1');
    canvas.addEventListener('click', selectObject);

    document.querySelector('#tenant_1').addEventListener('click', () => removeTenantButton(0));
    document.querySelector('#tenant_2').addEventListener('click', () => removeTenantButton(1));
    document.querySelector('#tenant_3').addEventListener('click', () => removeTenantButton(2));
    document.querySelector('#tenant_4').addEventListener('click', () => removeTenantButton(3));
    document.querySelector('#tenant_5').addEventListener('click', () => removeTenantButton(4));

    canvas.addEventListener('mousemove', (e) => calculateMousePos(e)); // Doubt this'll work as intended. Will need somekind of setTimeout or running in the updateAll function. If so, then may not be possible to use event listeners.
    canvas.addEventListener('mouseup', toggleHold);
    canvas.addEventListener('mousedown', toggleHold);
  }

  function removeTenantButton(i) {
    console.log(currentObj.tenants[i]);
    currentObj.removeTenant(currentObj.tenants[i]);
    UpdateStatDisplays();
  }
});
