import { Worker, Queen, Bug } from './bugs.mjs';
import { Entity, FoodEntity, GravestoneEntity, SelectionEntity, TemplateBuildingEntity } from './entity.mjs';
import { Building, FoodStorageBuilding, SleepingDenBuilding } from './building.mjs';

window.addEventListener('load', () => {
  // Variables for initialising canvas in js
  const canvas = document.querySelector('#canvas1');
  const ctx = canvas.getContext('2d');

  ctx.canvas.width = window.innerWidth;

  const mapImage = document.querySelector('#map');

  // variables for setting bug's behaviour to an activity (either Harvesting or Building)
  let toggleHarvestSelecting = false;
  const selectedForActivity = [];
  let toggleBuildingSelecting = false;

  // variables for building placement and creation
  let buildingTemplate = null;
  let isPlacingBuilding = false;
  let isTemplateSelected = false;

  // Variables for mouse movement and map movement
  let mouseHold = false;
  let canvasMousePos = { x: null, y: null };
  const visualOffset = { x: 0, y: 0 };
  let oldPos = null;

  // initialising previousTimeStamp for use in updateFrame()
  let previousTimeStamp = 0;
  const fpsCounter = document.querySelector('#fpsCounter');

  // function that happens every frame. timeStamp is a variable native to requestAnimationFrame function.
  function updateFrame(timeStamp) {
    //  ---- calculate deltaTime ----
    // This is because in the first frame the timestamp == null for some reason. Therefore when it does, just set it to what the value would approximately be so it doesn't break the rest of the code.
    if (timeStamp == null) { timeStamp = 16.6666; }
    const deltaTime = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;
    fpsCounter.textContent = 'FPS: ' + Math.floor(1000 / deltaTime);

    //  ---- set the canvas dimensions to the dimensions of the window ----
    ctx.canvas.height = document.querySelector('html').clientHeight;

    // if holding down mouse
    if (mouseHold) {
      // if currently trying to place building
      if (isPlacingBuilding) {
        buildingTemplate.moveAcceptCancelButtons(visualOffset);
        if (isTemplateSelected) {
          // move it to the mouse position
          buildingTemplate.moveToCursor(canvasMousePos, visualOffset);
        } else {
          // Calculates visual offset for map movement. Must be calculated before everything is drawn as to avoid a frames worth of delay.
          moveMap();
        }
      } else {
        // two instances of moveMap since this one gets disabled if isPlacingBuilding is true, which is not correct, map should not move when moving the template
        moveMap();
      }
    }

    // ---- For clearing and redrawing the objects in the scene, as well as bug behaviour  ----
    // clears the entire canvas element
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // grey void behind the map image
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // draw map image
    mapObject.draw(ctx, visualOffset);

    selectEntity.drawSelectedObject(currentObj, ctx, visualOffset);

    // Loop through array containing all Bugs, and call their draw() method and behaviour logic.
    for (const bug of bugsList) {
      // draw each bug
      bug.draw(ctx, visualOffset);
      // logic for each bug's behaviour
      bug.runBehaviourLogic(deltaTime);
    }
    // Loop through array containing all Entities, and call their draw() method.
    for (const entity of entityList) {
      entity.draw(ctx, visualOffset);
    }

    if (isPlacingBuilding) {
      buildingTemplate.checkCollisions(entityList);
      buildingTemplate.draw(ctx, visualOffset);
    }

    // call the function again
    requestAnimationFrame(updateFrame);
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

  createNewBuilding('sleeping_den', 0, 0);

  createNewBuilding('sleeping_den', 100, 100);
  createNewBuilding('sleeping_den', 300, 300);

  addListeners();
  updateFrame();
  decreaseStatsInterval();

  // It compares the returned value of getMousePosition to the corner co-ordinates of all bugs in the game (probably slow).
  function selectObject() {
    // if the user is trying to place a new building,
    if (isPlacingBuilding) {
      // if mouse is within the bounds of the building template
      if (canvasMousePos.x >= buildingTemplate.bounds.left + visualOffset.x &&
        canvasMousePos.x <= buildingTemplate.bounds.right + visualOffset.x &&
        canvasMousePos.y >= buildingTemplate.bounds.top + visualOffset.y &&
        canvasMousePos.y <= buildingTemplate.bounds.bottom + visualOffset.y) {
        isTemplateSelected = true;
      // if cursor not in bounds
      } else {
        isTemplateSelected = false;
      }
      return;
    }

    // combine bugs and entity arrays
    const bugsAndEntity = bugsList.concat(entityList);
    for (const obj of bugsAndEntity) {
      if (canvasMousePos.x >= obj.bounds.left + visualOffset.x && // Adds visualOffset to the bound calculates, rather than the bounds itself.
        canvasMousePos.x <= obj.bounds.right + visualOffset.x && // This prevents the bug's bounds not being able to be used in collision detection later on, And also the moving of the map is a user and visual feature, so adding visualOffset in selectBug (a user and visual feature) only makes sense.
        canvasMousePos.y >= obj.bounds.top + visualOffset.y && // If canvasMousePos is within the bounds of a Bug, set currentObj as the currently iterated bug, and log it's name.
        canvasMousePos.y <= obj.bounds.bottom + visualOffset.y) {
        console.log(obj.name);

        // if selecting is in harvest mode,
        if (toggleHarvestSelecting) {
          selectedForActivity.push(obj);
          harvestLogic();
        // if selecting is in building mode,
        } else if (toggleBuildingSelecting) {
          selectedForActivity[0] = obj;
          buildingLogic();
        // if selecting is in normal mode,
        } else {
          // if the currently selected object will be selected again, skip a loop so that the next object below it is selected instead.
          if (currentObj !== obj) {
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

  // Called by event listeners on mouse down and mouse up. Toggles a bool variable which represents the mouse's state
  function mouseDown() {
    mouseHold = true;
    oldPos = null;

    selectObject();
  }
  function mouseUp() {
    mouseHold = false;
    oldPos = null;
    isTemplateSelected = false;
  }
  // Is run every time the mouse moves, and writes to a global variable.
  function calculateMousePos(event) {
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

      document.querySelector('#activityAlert').textContent = 'Click on building you want the bug to help build';
      document.querySelector('#building_1_Name').style.display = 'block';
      document.querySelector('#building_2_Name').style.display = 'block';

      UpdateStatDisplays();
    } else { // cancel harvesting
      currentObj.setBehaviour('wandering');
      document.querySelector('#startHarvest').textContent = 'Press to start harvesting';
    }
  }
  function harvestLogic() {
    if (selectedForActivity[0] instanceof FoodEntity) { // if the first selected object is a food entity,
      document.querySelector('#building_1_Name').textContent = selectedForActivity[0].name;
      document.querySelector('#activityAlert').textContent = 'Select the food storage building for food to be deposited into';
    } else {
      selectedForActivity.splice(0, 1);
      document.querySelector('#building_1_Name').textContent = '--';
      document.querySelector('#activityAlert').textContent = 'Select the food source target';
      return;
    }
    if (selectedForActivity[1] instanceof FoodStorageBuilding) { // if the second selected object is a food storage,
      document.querySelector('#building_2_Name').textContent = selectedForActivity[1].name;
      toggleHarvestSelecting = false;
      currentObj.setBehaviour('harvesting', selectedForActivity[0], selectedForActivity[1]);
      selectedForActivity.splice(0, selectedForActivity.length); // clear entire array for reuse later
      UpdateStatDisplays();
    } else {
      selectedForActivity.splice(1, 1);
      document.querySelector('#building_2_Name').style.display = 'block';
      document.querySelector('#building_2_Name').textContent = '--';
      document.querySelector('#activityAlert').textContent = 'Select the food storage building for food to be deposited into';
    }
  }

  function buildingSelecting() {
    if (currentObj.behaviour !== 'building') { // start building
      toggleBuildingSelecting = true;

      document.querySelector('#activityAlert').textContent = 'Click on building you want the bug to help build';
      document.querySelector('#building_1_Name').style.display = 'none';
      document.querySelector('#building_2_Name').style.display = 'none';

      UpdateStatDisplays();
    } else { // cancel building
      currentObj.setBehaviour('wandering');
      document.querySelector('#startConstruction').textContent = 'Press to start construction';
    }
  }
  function buildingLogic() {
    if (selectedForActivity[0] instanceof Building) {
      currentObj.setBehaviour('building', selectedForActivity[0]);
      toggleBuildingSelecting = false;

      UpdateStatDisplays();
    } else {
      console.log('bruh');
    }
  }
  function cancelActivity() {
    toggleBuildingSelecting = false;
    toggleHarvestSelecting = false;
    selectedForActivity.splice(0, selectedForActivity.length); // clear array of already chosen entities

    UpdateStatDisplays();
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

  function placeNewBuilding(newBuildingType) {
    if (newBuildingType === 'den') {
      buildingTemplate = (new TemplateBuildingEntity('denTemplate', ctx.canvas.width / 2, ctx.canvas.height / 2, 150, 100, document.querySelector('#sleeping_den_sprite'), visualOffset));
      isPlacingBuilding = true;
    } else if (newBuildingType === 'storage') {
      buildingTemplate = (new TemplateBuildingEntity('storageTemplate', ctx.canvas.width / 2, ctx.canvas.height / 2, 150, 150, document.querySelector('#food_storage_sprite'), visualOffset));
      isPlacingBuilding = true;
    }
  }
  function acceptPlacement() {
    if (buildingTemplate.canPlace) {
      if (buildingTemplate.name === 'denTemplate') {
        entityList.push(new SleepingDenBuilding(buildingTemplate.x, buildingTemplate.y));
      } else if (buildingTemplate.name === 'storageTemplate') {
        entityList.push(new FoodStorageBuilding(buildingTemplate.x, buildingTemplate.y));
      }
      document.querySelector('#acceptAndCancel').style.display = 'none';
      isPlacingBuilding = false;
    } else {
      console.log('no can do pal');
    }
  }
  function cancelPlacement() {
    buildingTemplate = null;
    document.querySelector('#acceptAndCancel').style.display = 'none';
    isPlacingBuilding = false;
  }


  function UpdateStatDisplays() {
    // update all the attribute displays to represent the selected pet
    const childOfDiv = document.querySelector('#UI').children; // Hide all child elements of the UI div
    for (let index = 0; index < childOfDiv.length; index++) {
      childOfDiv[index].classList.add('hidden');
    }

    if (currentObj === null) { // if nothing is selected,
      return; // display nothing.
    }

    if (toggleHarvestSelecting) {
      document.querySelector('#activityElems').classList.remove('hidden');
      document.querySelector('#activityBugName').textContent = currentObj.name;
      return;
    } else if (toggleBuildingSelecting) {
      document.querySelector('#activityElems').classList.remove('hidden');
      document.querySelector('#activityBugName').textContent = currentObj.name;
      return;
    }

    document.querySelector('#nameDisplay').classList.remove('hidden');
    document.querySelector('#nameDisplay').textContent = 'name: ' + currentObj.name;

    if (currentObj instanceof Bug) { // Show and update only the relevent child elements
      document.querySelector('#bugButtons').classList.remove('hidden');

      document.querySelector('#foodDisplay').classList.remove('hidden');
      document.querySelector('#bugStats').classList.remove('hidden');

      document.querySelector('#foodDisplay').textContent = 'food: ' + currentObj.food;
      document.querySelector('#cleanlinessDisplay').textContent = 'cleanliness: ' + currentObj.cleanliness;
      document.querySelector('#sleepDisplay').textContent = 'sleep: ' + currentObj.sleep;
      document.querySelector('#happinessDisplay').textContent = 'happiness: ' + currentObj.happiness;

      if (currentObj.behaviour === 'harvesting') {
        document.querySelector('#startHarvest').textContent = 'Press to cancel harvesting';
      } else {
        document.querySelector('#startHarvest').textContent = 'Press to start harvesting';
      }
      if (currentObj.behaviour === 'building') {
        document.querySelector('#startConstruction').textContent = 'Press to cancel building';
      } else {
        document.querySelector('#startConstruction').textContent = 'Press to start building';
      }

      if (currentObj.behaviour === 'sleeping') {
        document.querySelector('#findDen').textContent = 'Press to wake up';
      } else {
        document.querySelector('#findDen').textContent = 'Press to send the bug to the closest sleeping den';
      }

      if (currentObj instanceof Queen) {
        document.querySelector('#newBug').classList.remove('hidden');
      }
    } else if (currentObj instanceof FoodEntity || currentObj instanceof FoodStorageBuilding) {
      document.querySelector('#foodDisplay').classList.remove('hidden');
      document.querySelector('#foodDisplay').textContent = 'food stored: ' + currentObj.foodInventory;
    } else if (currentObj instanceof GravestoneEntity) {
      document.querySelector('#graveElems').classList.remove('hidden');
      document.querySelector('#birthdayDisplay').textContent = 'date of birth: ' + currentObj.bugBirthday.getDate() + '/' + (currentObj.bugBirthday.getMonth() + 1) + '/' + currentObj.bugBirthday.getFullYear();
      document.querySelector('#deathdayDisplay').textContent = 'date of death: ' + currentObj.bugDeathday.getDate() + '/' + (currentObj.bugDeathday.getMonth() + 1) + '/' + currentObj.bugDeathday.getFullYear();
      document.querySelector('#timeAliveDisplay').textContent = 'time survived: ' + currentObj.bugTimeAlive.hours + ':' + currentObj.bugTimeAlive.minutes + ':' + currentObj.bugTimeAlive.seconds;
      document.querySelector('#causeDisplay').textContent = 'cause of death: lack of ' + currentObj.causeOfDeath;
    } else if (currentObj instanceof SleepingDenBuilding) {
      document.querySelector('#denElems').classList.remove('hidden');
      document.querySelector('#occupancy').textContent = 'occupancy: ' + currentObj.occupancy + '/' + currentObj.maxOccupancy;
      for (const tenantButton of document.querySelector('#tenantButtons').children) { // loops through button elements and hides them all
        tenantButton.classList.add('hidden');
      }
      for (const tenant of currentObj.tenants) { // loops through tenants in the den, and displays and updates buttons depending on the amount of tenants.
        const button = document.querySelector('#tenant_' + (currentObj.tenants.indexOf(tenant) + 1));
        button.classList.remove('hidden');
        button.textContent = tenant.name + "'s sleep: " + tenant.sleep + '/100' + '\n' + ' Press to wake up';
      }
    }
  }
  // loops through array of bug objects then reduces each of their stats, on a timer of 5 seconds.
  function decreaseStatsInterval() {
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

  // Adds all the listeners to the elements and js variables. Event listeners usually cover user input.
  function addListeners() {
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

    document.querySelector('#startHarvest').addEventListener('click', harvestSelecting);
    document.querySelector('#startConstruction').addEventListener('click', buildingSelecting);
    document.querySelector('#cancelActivity').addEventListener('click', cancelActivity);

    const findDenButton = document.querySelector('#findDen');
    findDenButton.addEventListener('click', () => findClosestDen());

    const canvas = document.getElementById('canvas1');

    document.querySelector('#tenant_1').addEventListener('click', () => removeTenantButton(0));
    document.querySelector('#tenant_2').addEventListener('click', () => removeTenantButton(1));
    document.querySelector('#tenant_3').addEventListener('click', () => removeTenantButton(2));
    document.querySelector('#tenant_4').addEventListener('click', () => removeTenantButton(3));
    document.querySelector('#tenant_5').addEventListener('click', () => removeTenantButton(4));

    document.querySelector('#buildADen').addEventListener('click', () => placeNewBuilding('den'));
    document.querySelector('#buildAStorage').addEventListener('click', () => placeNewBuilding('storage'));

    canvas.addEventListener('mousemove', (e) => calculateMousePos(e)); // Doubt this'll work as intended. Will need somekind of setTimeout or running in the updateAll function. If so, then may not be possible to use event listeners.
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousedown', mouseDown);

    document.querySelector('#accept').addEventListener('click', acceptPlacement);
    document.querySelector('#cancel').addEventListener('click', cancelPlacement);
  }

  function removeTenantButton(i) {
    console.log(currentObj.tenants[i]);
    currentObj.removeTenant(currentObj.tenants[i]);
    UpdateStatDisplays();
  }
});
