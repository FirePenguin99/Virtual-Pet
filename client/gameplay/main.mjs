import { Worker, Queen, Bug } from './bugs.mjs';
import { Entity, FoodEntity, CorpseEntity, GravestoneEntity, SelectionEntity, TemplateBuildingEntity } from './entity.mjs';
import { Building, FoodStorageBuilding, SleepingDenBuilding } from './building.mjs';

// GLOBAL VARIABLES

let entityId = 0;
function newEntityId() {
  const id = entityId;
  entityId += 1;
  return id;
}

let bugId = 0;
function newBugId() {
  const id = bugId;
  bugId += 1;
  return id;
}

// Variables for initialising canvas in js
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
ctx.canvas.height = document.querySelector('html').clientHeight;
ctx.canvas.width = document.querySelector('html').clientWidth;

// variables for the background image and entity
const mapImage = document.querySelector('#map');
const mapObject = new Entity('map', 0, 0, 5000, 5000, mapImage);

// variables for setting bug's behaviour to an activity via clicking (either Harvesting or Building)
let toggleActivitySelecting = false;
let currentActivity = '';

const selectedForActivity = [];

// variables for building placement and creation
let buildingTemplate = null;
let isPlacingBuilding = false;
let isTemplateSelected = false;

// Variables for mouse movement and map movement
let mouseHold = false;
let canvasMousePos = { x: null, y: null };
// setting the x and y to half the canvas' height and width makes it so the "camera" starts with (0, 0) in the game world, being in the middle of the screen
const visualOffset = { x: (ctx.canvas.width / 2), y: (ctx.canvas.height / 2) };
let oldPos = null;

// initialising previousTimeStamp for use in updateFrame()
const fpsCounter = document.querySelector('#fpsCounter');

let currentObj;
export const bugsList = [];
export const entityList = [];
let bugNumber = 0;

export const corpseList = [];

const selectEntity = new SelectionEntity();

// function that happens every frame, this one is responsible for drawing the frame with canvas and updating the html/css UI.
let timeStamp = 0;
let previousTimeStamp = 0;
function updateFrame() {
  //  calculate deltaTime, used to be used for more but now just shows a frame rate to check performance
  timeStamp = new Date().getTime();
  const deltaTime = timeStamp - previousTimeStamp;
  previousTimeStamp = timeStamp;

  fpsCounter.textContent = 'FPS: ' + Math.floor(1000 / deltaTime);

  //  ---- set the canvas dimensions to the dimensions of the window ----
  ctx.canvas.height = document.querySelector('html').clientHeight;
  ctx.canvas.width = document.querySelector('html').clientWidth;


  // for map movement and moving building templates around
  if (mouseHold) {
    if (isPlacingBuilding) {
      buildingTemplate.moveAcceptCancelButtons(visualOffset);
      if (isTemplateSelected) {
        buildingTemplate.moveToCursor(canvasMousePos, visualOffset);
      } else {
        moveMap();
      }
    } else {
      // two instances of moveMap since this one gets disabled if isPlacingBuilding is true, which is not correct, map should not move when moving the template
      moveMap();
    }
  }

  // ---- For clearing and redrawing the objects in the scene, as well as bug behaviour  ----
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // grey void behind the map image
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  mapObject.draw(ctx, visualOffset);

  selectEntity.drawSelectedObject(currentObj, ctx, visualOffset);

  // the idea of the draw function was lifted from "JavaScript Game Tutorial with HTML Canvas" https://youtu.be/c-1dBd1_G8A. However the code itself is completely written by me
  for (const bug of bugsList) {
    bug.draw(ctx, visualOffset);
  }

  for (const entity of entityList) {
    entity.draw(ctx, visualOffset);
  }

  for (const corpse of corpseList) {
    corpse.draw(ctx, visualOffset);
  }

  if (isPlacingBuilding) {
    buildingTemplate.checkCollisions(entityList);
    buildingTemplate.draw(ctx, visualOffset);
  }

  UpdateStatDisplays();

  requestAnimationFrame(updateFrame);
}

// function that happens every frame, this one is responsible for bug's logic execution and uses setInterval to make it work in the background
// for some reason no matter what the interval is set to, when in the background the interval jumps to around 1000ms, so bug's actions slow down when alt-tabbed
function updateLogic() {
  const rate = 16.6666;
  for (const bug of bugsList) {
    bug.runBehaviourLogic(rate);
  }
}

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
  let bugsAndEntityAndCorpses = bugsList.concat(entityList);
  // need to concat twice to get all three arrays joined into one
  bugsAndEntityAndCorpses = bugsAndEntityAndCorpses.concat(corpseList);
  for (const obj of bugsAndEntityAndCorpses) {
    if (canvasMousePos.x >= obj.bounds.left + visualOffset.x && // Adds visualOffset to the bound calculates, rather than the bounds itself.
        canvasMousePos.x <= obj.bounds.right + visualOffset.x && // This prevents the bug's bounds not being able to be used in collision detection later on, And also the moving of the map is a user and visual feature, so adding visualOffset in selectBug (a user and visual feature) only makes sense.
        canvasMousePos.y >= obj.bounds.top + visualOffset.y && // If canvasMousePos is within the bounds of a Bug, set currentObj as the currently iterated bug, and log it's name.
        canvasMousePos.y <= obj.bounds.bottom + visualOffset.y) {
      console.log(obj.name);

      if (toggleActivitySelecting) {
        selectedForActivity.push(obj);

        if (currentActivity === 'harvesting') {
          harvestLogic();
        } else if (currentActivity === 'building') {
          buildingLogic();
        } else if (currentActivity === 'cleaning') {
          cleaningCorpseLogic();
        }
      } else {
        // if the currently selected object will be selected again, skip a loop so that the next object below it is selected instead.
        if (currentObj !== obj) {
          currentObj = obj;
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
    // calculates movement of the mouse between frames and adds them to a total offset
    visualOffset.x += (canvasMousePos.x - oldPos.x);
    visualOffset.y += (canvasMousePos.y - oldPos.y);
    oldPos = canvasMousePos;
  }
}

function createNewBug(newBugName, newBugType, x, y) {
  // create object
  if (newBugType === 'queen') {
    bugsList.push(new Queen(newBugId(), newBugName, x, y));
  } else if (newBugType === 'worker') {
    bugsList.push(new Worker(newBugId(), newBugName, x, y));
  }

  console.log(bugsList);

  currentObj = bugsList[bugNumber];
  bugNumber = bugNumber + 1;
}
function spawnNewBug(newBugName) {
  if (bugsList[0].food < 50) {
    return;
  }
  bugsList.push(new Worker(newBugId(), newBugName, (Math.random() * 100) - 50 + bugsList[0].x, (Math.random() * 100) - 50 + bugsList[0].y));

  console.log(bugsList);

  bugsList[0].food -= 45;

  currentObj = bugsList[bugNumber];
  bugNumber = bugNumber + 1;
}
function checkBugDeath(bugObj) {
  bugObj.debuffList.splice(0, bugObj.debuffList.length);

  if (bugObj.food <= 25) {
    bugObj.debuffList.push(document.querySelector('#hungry_sprite'));
  }
  if (bugObj.sleep <= 25) {
    bugObj.debuffList.push(document.querySelector('#tired_sprite'));
  }
  if (bugObj.cleanliness <= 25) {
    bugObj.debuffList.push(document.querySelector('#dirty_sprite'));
  }

  if (bugObj.food <= 0) {
    bugDeath(bugObj, 'food');
  } else if (bugObj.cleanliness <= 0) {
    bugDeath(bugObj, 'hygine');
  }
}
function bugDeath(bugObj, cause) {
  const bugIndex = bugsList.indexOf(bugObj);
  console.log('Your bug: ' + bugObj.name + ' has died due to a lack of ' + cause);
  corpseList.push(new CorpseEntity(newEntityId(), bugObj, cause));

  bugsList.splice(bugIndex, 1);
  bugNumber += -1;
  if (currentObj === bugObj) {
    currentObj = null;
  }
}
function deleteGrave(graveObj) {
  const graveIndex = entityList.indexOf(graveObj);
  console.log('Cleaned ' + graveObj.name);
  entityList.splice(graveIndex, 1);
  if (currentObj === graveObj) {
    currentObj = null;
  }
}

function activitySelecting(activity) {
  currentActivity = activity;
  toggleActivitySelecting = true;

  if (currentActivity === 'harvesting') {
    document.querySelector('#activityAlert').textContent = 'Click on food source you want the bug to harvest';
    document.querySelector('#building_1_Name').style.display = 'block';
    document.querySelector('#building_2_Name').style.display = 'block';
  } else if (currentActivity === 'building') {
    document.querySelector('#activityAlert').textContent = 'Click on building you want the bug to help build';
    document.querySelector('#building_1_Name').style.display = 'none';
    document.querySelector('#building_2_Name').style.display = 'none';
  } else if (currentActivity === 'cleaning') {
    document.querySelector('#activityAlert').textContent = 'Click on corpse you want the bug to clean away';
    document.querySelector('#building_1_Name').style.display = 'none';
    document.querySelector('#building_2_Name').style.display = 'none';
  }
}

function harvestLogic() {
  if (selectedForActivity[0] instanceof FoodEntity) {
    document.querySelector('#building_1_Name').textContent = selectedForActivity[0].name;
    document.querySelector('#activityAlert').textContent = 'Select the food storage building for food to be deposited into';
  } else {
    selectedForActivity.splice(0, 1);
    document.querySelector('#building_1_Name').textContent = '--';
    document.querySelector('#activityAlert').textContent = 'Select the food source target';
    return;
  }
  if (selectedForActivity[1] instanceof FoodStorageBuilding && !(selectedForActivity[1].underConstruction)) {
    document.querySelector('#building_2_Name').textContent = selectedForActivity[1].name;
    toggleActivitySelecting = false;
    currentObj.setBehaviour('harvesting', selectedForActivity[0], selectedForActivity[1]);
    // clear entire array for reuse later
    selectedForActivity.splice(0, selectedForActivity.length);
  } else {
    selectedForActivity.splice(1, 1);
    document.querySelector('#building_2_Name').style.display = 'block';
    document.querySelector('#building_2_Name').textContent = '--';
    document.querySelector('#activityAlert').textContent = 'Select the food storage building for food to be deposited into';
  }
}
function buildingLogic() {
  if (selectedForActivity[0] instanceof Building) {
    currentObj.setBehaviour('building', selectedForActivity[0]);
    toggleActivitySelecting = false;
    selectedForActivity.splice(0, selectedForActivity.length);
  } else {
    console.log('selected entity is not a building');
  }
}
function cleaningCorpseLogic() {
  if (selectedForActivity[0] instanceof CorpseEntity) {
    currentObj.setBehaviour('cleaning', selectedForActivity[0]);
    toggleActivitySelecting = false;
    selectedForActivity.splice(0, selectedForActivity.length);
  } else {
    console.log('selected entity is not a corpse');
  }
}
function cancelActivity() {
  toggleActivitySelecting = false;
  // clear array of already chosen entities
  selectedForActivity.splice(0, selectedForActivity.length);

  currentObj.cancelActivity();
}

function findClosestDen() {
  // if already sleeping, then wake up
  if (currentObj.behaviour === 'sleeping') {
    currentObj.setBehaviour('wandering');
    document.querySelector('#findDen').textContent = 'Press to send the bug to the closest sleeping den';
    if (currentObj.isInDen) {
      currentObj.entityTarget.removeTenant(currentObj);
    } else {
      currentObj.setBehaviour('wandering');
    }
    // find closest den and set behaviour to moveToDen
  } else {
    let closestDenValue = null;
    let closestDenObj = null;
    // Loop through array containing all buildings
    for (const building of entityList) {
      if (building instanceof SleepingDenBuilding && building.occupancy !== building.maxOccupancy && !(building.underConstruction)) {
        const distanceFromDen = Math.abs(Math.sqrt(Math.pow(currentObj.x - building.x, 2) + Math.pow(currentObj.y - building.y, 2)));
        if (closestDenValue === null || distanceFromDen < closestDenValue) {
          closestDenValue = distanceFromDen;
          closestDenObj = building;
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
function findClosestFood() {
  // if already eating, then stop eating
  if (currentObj.behaviour === 'feeding') {
    currentObj.setBehaviour('wandering');
    document.querySelector('#findFood').textContent = 'Press to send the bug to the closest food source';
    // find closest food source and set behaviour to moveToFood
  } else {
    let closestFoodValue = null;
    let closestFoodObj = null;
    // Loop through array containing all buildings
    for (const building of entityList) {
      if (building instanceof FoodStorageBuilding && building.foodInventory > 0 && !(building.underConstruction)) {
        const distanceFromDen = Math.abs(Math.sqrt(Math.pow(currentObj.x - building.x, 2) + Math.pow(currentObj.y - building.y, 2)));
        if (closestFoodValue === null || distanceFromDen < closestFoodValue) {
          closestFoodValue = distanceFromDen;
          closestFoodObj = building;
        }
      }
    }

    if (closestFoodObj === null) {
      console.log('no food source found');
    } else {
      currentObj.setBehaviour('moveToFood', closestFoodObj);
    }
  }
}


function createNewEntity(newEntityType, spawnX, spawnY) {
  if (newEntityType === 'food') {
    entityList.push(new FoodEntity(newEntityId(), spawnX, spawnY));
  }
}
function createNewBuilding(newBuildingType, spawnX, spawnY) {
  if (newBuildingType === 'food_storage') {
    entityList.push(new FoodStorageBuilding(newEntityId(), spawnX, spawnY));
  } else if (newBuildingType === 'sleeping_den') {
    entityList.push(new SleepingDenBuilding(newEntityId(), spawnX, spawnY));
  }
}

function placeNewBuilding(newBuildingType) {
  if (newBuildingType === 'den') {
    buildingTemplate = (new TemplateBuildingEntity('denTemplate', (ctx.canvas.width / 2) - visualOffset.x, (ctx.canvas.height / 2) - visualOffset.y, 150, 100, document.querySelector('#sleeping_den_sprite'), visualOffset));
    console.log(buildingTemplate);
    isPlacingBuilding = true;
  } else if (newBuildingType === 'storage') {
    buildingTemplate = (new TemplateBuildingEntity('storageTemplate', (ctx.canvas.width / 2) - visualOffset.x, (ctx.canvas.height / 2) - visualOffset.y, 150, 150, document.querySelector('#food_storage_sprite'), visualOffset));
    isPlacingBuilding = true;
  }
}
function acceptPlacement() {
  if (buildingTemplate.canPlace) {
    if (buildingTemplate.name === 'denTemplate') {
      entityList.push(new SleepingDenBuilding(newEntityId(), buildingTemplate.x, buildingTemplate.y));
    } else if (buildingTemplate.name === 'storageTemplate') {
      entityList.push(new FoodStorageBuilding(newEntityId(), buildingTemplate.x, buildingTemplate.y));
    }
    document.querySelector('#acceptAndCancel').style.display = 'none';
    isPlacingBuilding = false;
  } else {
    console.log('no can do pal, cant place building here');
  }
}
function cancelPlacement() {
  buildingTemplate = null;
  document.querySelector('#acceptAndCancel').style.display = 'none';
  isPlacingBuilding = false;
}

// update all the attribute displays to represent the selected pet
function UpdateStatDisplays() {
  // Hide all child elements of the UI div
  const childOfDiv = document.querySelector('#UI').children;
  for (let index = 0; index < childOfDiv.length; index++) {
    childOfDiv[index].classList.add('hidden');
  }

  // if nothing is selected,
  if (currentObj === null) {
    // display nothing.
    return;
  }

  if (toggleActivitySelecting) {
    document.querySelector('#activityElems').classList.remove('hidden');
    document.querySelector('#activityBugName').textContent = currentObj.name;
    return;
  }

  document.querySelector('#nameDisplay').classList.remove('hidden');
  document.querySelector('#nameDisplay').textContent = 'name: ' + currentObj.name;

  // Show and update only the relevent child elements
  if (currentObj instanceof Bug) {
    document.querySelector('#foodDisplay').classList.remove('hidden');
    document.querySelector('#bugStats').classList.remove('hidden');

    document.querySelector('#foodDisplay').textContent = 'food: ' + Math.trunc(currentObj.food);
    document.querySelector('#cleanlinessDisplay').textContent = 'cleanliness: ' + currentObj.cleanliness;
    document.querySelector('#sleepDisplay').textContent = 'sleep: ' + currentObj.sleep;
    document.querySelector('#happinessDisplay').textContent = 'happiness: ' + Math.trunc((currentObj.food + currentObj.cleanliness + currentObj.sleep) / 3);
    document.querySelector('#currentBehaviour').textContent = 'current behaviour: ' + currentObj.behaviour;

    if (currentObj.behaviour === 'wandering') {
      document.querySelector('#bugButtons').classList.remove('hidden');
    } else {
      document.querySelector('#cancelCurrentActivity').classList.remove('hidden');
    }

    if (currentObj instanceof Queen) {
      document.querySelector('#newBug').classList.remove('hidden');
    }
  } else if (currentObj instanceof FoodEntity || currentObj instanceof FoodStorageBuilding) {
    document.querySelector('#foodDisplay').classList.remove('hidden');
    document.querySelector('#foodDisplay').textContent = 'food stored: ' + Math.trunc(currentObj.foodInventory);
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
  const cleanlinessAmount = 4 - corpseList.length * 2;

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
      bug.increaseCleanliness(cleanlinessAmount);
    }


    checkBugDeath(bug);
  }
  setTimeout(decreaseStatsInterval, 5000);
}


// Adds all the listeners to the elements and js variables. Event listeners usually cover user input.
function addListeners() {
  const newBugButton = document.querySelector('#newBug');
  newBugButton.addEventListener('click', () => spawnNewBug(prompt("Insert new bug's Name", '')));

  const deleteGraveButton = document.querySelector('#deleteGrave');
  deleteGraveButton.addEventListener('click', () => deleteGrave(currentObj));

  document.querySelector('#startHarvest').addEventListener('click', () => activitySelecting('harvesting'));
  document.querySelector('#startConstruction').addEventListener('click', () => activitySelecting('building'));
  document.querySelector('#cleanCorpse').addEventListener('click', () => activitySelecting('cleaning'));
  document.querySelector('#findDen').addEventListener('click', findClosestDen);
  document.querySelector('#findFood').addEventListener('click', findClosestFood);

  document.querySelector('#cancelCurrentActivity').addEventListener('click', cancelActivity);

  document.querySelector('#cancelActivity').addEventListener('click', cancelActivity);

  document.querySelector('#findDen').addEventListener('click', findClosestDen);
  document.querySelector('#findFood').addEventListener('click', findClosestFood);

  document.querySelector('#tenant_1').addEventListener('click', () => removeTenantButton(0));
  document.querySelector('#tenant_2').addEventListener('click', () => removeTenantButton(1));
  document.querySelector('#tenant_3').addEventListener('click', () => removeTenantButton(2));
  document.querySelector('#tenant_4').addEventListener('click', () => removeTenantButton(3));
  document.querySelector('#tenant_5').addEventListener('click', () => removeTenantButton(4));

  document.querySelector('#buildADen').addEventListener('click', () => placeNewBuilding('den'));
  document.querySelector('#buildAStorage').addEventListener('click', () => placeNewBuilding('storage'));

  const canvas = document.getElementById('canvas1');

  canvas.addEventListener('mousemove', (e) => calculateMousePos(e)); // Doubt this'll work as intended. Will need somekind of setTimeout or running in the updateAll function. If so, then may not be possible to use event listeners.
  canvas.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('mousedown', mouseDown);

  document.querySelector('#accept').addEventListener('click', acceptPlacement);
  document.querySelector('#cancel').addEventListener('click', cancelPlacement);

  document.querySelector('#saveAndExit').addEventListener('click', saveHive);
}

function removeTenantButton(i) {
  console.log(currentObj.tenants[i]);
  currentObj.removeTenant(currentObj.tenants[i]);
}

async function saveHive() {
  const payload = {
    id: bugsList[0].name + "'s Hive",
    bugsList,
    entityList,
    bugId,
    entityId,
    corpseList,
  };
  console.log('Payload', payload);

  // not sure if window.location.origin is good practice, but I couldn't find anyway to go backwards in the directory/tree.
  const response = await fetch(window.location.origin + '/hives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    exitGame();
  } else {
    console.log('failed to send message', response);
  }
}

function exitGame() {
  window.location.href = '/index.html';
}

function startNewGame() {
  createNewEntity('food', ((Math.random() * 4600) - 2300), ((Math.random() * 4600) - 2300));
  createNewEntity('food', ((Math.random() * 4600) - 2300), ((Math.random() * 4600) - 2300));
  createNewEntity('food', ((Math.random() * 4600) - 2300), ((Math.random() * 4600) - 2300));
  createNewEntity('food', ((Math.random() * 4600) - 2300), ((Math.random() * 4600) - 2300));

  createNewBug(prompt("Insert new Queen's name", ''), 'queen', 0, 0);
  createNewBuilding('food_storage', 0, 100);

  localStorage.setItem('newOrLoad', null);
}

function findTargetById(id) {
  for (const entity of entityList) {
    if (id === entity.id) {
      console.log(entity);
      return entity;
    }
  }
}

function loadGame(hiveObj) {
  const hive = JSON.parse(hiveObj);
  console.log(hive);
  currentObj = null;

  bugId = hive.bugId;
  entityId = hive.entityId;

  // terrible scalability, need to manually add more conditions if i were to add more bug, entity or building types
  // what an awful, awful solution. its the only time using Classes has come back to bite me, and right at the finish line too.
  // originally used entity = " Object.assign(Entity.prototype, entity); " which worked but i needed to get specific.
  for (const entity of hive.entityList) {
    let newEntity = {};
    switch (entity.type) {
      case 'food_entity':
        newEntity = new FoodEntity(entity.id, entity.x, entity.y);

        newEntity.foodInventory = entity.foodInventory;
        break;
      case 'gravestone_entity':
        newEntity = new GravestoneEntity(entity.ownerBug, entity.cause);
        break;
      case 'food_storage':
        newEntity = new FoodStorageBuilding(entity.id, entity.x, entity.y);

        newEntity.foodInventory = entity.foodInventory;

        newEntity.stage = entity.stage;
        newEntity.underConstruction = entity.underConstruction;
        newEntity.constructionProgress = entity.constructionProgress;

        newEntity.image = newEntity.imageStages[newEntity.stage - 1];
        break;
      case 'sleeping_den':
        newEntity = new SleepingDenBuilding(entity.id, entity.x, entity.y);

        newEntity.occupancy = entity.occupancy;
        newEntity.maxOccupancy = entity.maxOccupancy;
        newEntity.tenants = entity.tenants;

        newEntity.stage = entity.stage;
        newEntity.underConstruction = entity.underConstruction;
        newEntity.constructionProgress = entity.constructionProgress;

        newEntity.image = newEntity.imageStages[newEntity.stage - 1];
        break;
    }
    entityList.push(newEntity);
  }

  for (const corpse of hive.corpseList) {
    let newCorpse = {};

    newCorpse = new CorpseEntity(corpse.id, corpse.ownerBug, corpse.cause);

    newCorpse.cleaningProgress = corpse.cleaningProgress;
  }

  // bugs are made last as they need references to entities in entityList to do their activities, therefore entities must be made first
  for (const bug of hive.bugsList) {
    let newBug = {};
    if (bug.type === 'queen') {
      newBug = new Queen(bug.id, bug.name, bug.x, bug.y);
    } else {
      newBug = new Worker(bug.id, bug.name, bug.x, bug.y);
    }
    newBug.food = bug.food;
    newBug.sleep = bug.sleep;
    newBug.cleanliness = bug.cleanliness;
    newBug.behaviour = bug.behaviour;
    newBug.movingState = bug.movingState;
    newBug.moveDestination = bug.moveDestination;

    newBug.harvestTarget = bug.harvestTarget;
    newBug.storeTarget = bug.storeTarget;
    newBug.foodInventory = bug.foodInventory;

    newBug.isInDen = bug.isInDen;

    newBug.entityTarget = bug.entityTarget;

    switch (bug.behaviour) {
      case 'harvesting':
        console.log(findTargetById(bug.harvestTarget.id));
        newBug.setBehaviour(bug.behaviour, findTargetById(bug.harvestTarget.id), findTargetById(bug.storeTarget.id));
        break;
      case 'moveToFood':
      case 'building':
      case 'moveToDen':
      case 'cleaning':
        newBug.setBehaviour(bug.behaviour, findTargetById(bug.entityTarget.id));
        break;
      case 'sleeping':
      case 'wandering':
        newBug.setBehaviour(bug.behaviour);
        break;
    }

    bugsList.push(newBug);
    console.log('bug loaded');
  }
}

if (localStorage.getItem('newOrLoad') === 'new') {
  startNewGame();
} else if (localStorage.getItem('newOrLoad') === 'load') {
  loadGame(localStorage.getItem('loadedHive'));
}

addListeners();
updateFrame();
setInterval(updateLogic, 16.6666);
decreaseStatsInterval();
