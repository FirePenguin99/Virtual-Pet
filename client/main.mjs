import { Bug } from './bugs.mjs';
import { Entity } from './entity.mjs';

window.addEventListener('load', ()=>{
    //Variables for initialising canvas in js
    const canvas = document.querySelector("#canvas1");
    const ctx = canvas.getContext('2d');
    
    const mapImage = document.querySelector("#map");
    
    
    //Variables for mouse movement and map movement
    let mouseHold = false;
    let canvasMousePos = {x: null, y: null};
    let visualOffset = {x: null, y: null};
    let oldPos = null;



    let previousTimeStamp = 0 //initialising previousTimeStamp for use in updateFrame()
    
    function updateFrame(timeStamp){ //function that happens every frame. timeStamp is a variable native to requestAnimationFrame function.
        //calculate deltaTime
        if (timeStamp == null){timeStamp = 16.6666} //This is because in the first frame the timestamp == null for some reason. Therefore when it does, just set it to what the value would approximately be so it doesn't break the rest of the code.
        const deltaTime = timeStamp - previousTimeStamp;
        previousTimeStamp = timeStamp; 
        
        
        if(mouseHold){
            moveMap(); //Calculates visual offset for map movement. Must be calculated before everything is drawn as to avoid a frames worth of delay.
        }
        
        //For clearing and redrawing the objects in the scene, as well as bug behaviour
        ctx.clearRect(0, 0, 1200, 800); //clears the entire canvas element
        
        mapObject.draw(ctx, visualOffset);
        
        for (let bug in bugsList){ //Loop through array containing all Bugs, and call their draw() method.
            bugsList[bug].draw(ctx, visualOffset);
            
            bugsList[bug].wanderMovement(deltaTime); //logic for each bug's behaviour
        }

        //call the function again
        requestAnimationFrame(updateFrame);
    }

    
    
    const mapObject = new Entity("map", -1000, -1000, mapImage);
    
    
    let currentBug;
    let bugsList = [];
    let bugNumber = 0;

    createNewBug("goob", "queen");
    
    

    addListeners();
    updateFrame();
    decreaseStatsInterval();


    function selectBug(){ //It compares the returned value of getMousePosition and compares it to the corner co-ordinates of all bugs in the game (probably slow).
        for (let bug in bugsList){
            if (canvasMousePos.x >= bugsList[bug].bounds.left + visualOffset.x &&       //Adds visualOffset to the bound calculates, rather than the bounds itself.
                canvasMousePos.x <= bugsList[bug].bounds.right + visualOffset.x &&      //This prevents the bug's bounds not being able to be used in collision detection later on,
                canvasMousePos.y >= bugsList[bug].bounds.top + visualOffset.y &&        //And also the moving of the map is a user and visual feature, so adding visualOffset in selectBug (a user and vusyal feature) only makes sense.
                canvasMousePos.y <= bugsList[bug].bounds.bottom + visualOffset.y){ //If canvasMousePos is within the bounds of a Bug, set currentBug as the currently iterated bug, and log it's name.
                    currentBug = bugsList[bug];      
                    console.log(currentBug.name);   //Log Bug data
            }else{
                console.log("No bug 'ere");
            }
        }
        
        //update all the attribute displays to represent the selected pet
        UpdateStatDisplays();
    }
    function toggleHold(){ //Called by event listeners on mouse down and mouse up. Toggles a bool variable which represents the mouse's state
        mouseHold = !mouseHold;
        oldPos = null; 
    }
    function calculateMousePos(event){ //Is run every time the mouse moves, and writes to a global variable.
        const bounds = canvas.getBoundingClientRect();
        canvasMousePos = {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
        }
    }
    function moveMap(){
        if (oldPos == null){
            oldPos = canvasMousePos
        }else{
            visualOffset.x += (canvasMousePos.x - oldPos.x); //calculates movement of the mouse between frames and adds them to a total offset
            visualOffset.y += (canvasMousePos.y - oldPos.y);
            oldPos = canvasMousePos;
        }
    }

    function createNewBug(newBugName, newBugType){ 
        //create object
        const randomColour = "rgb("+((Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)));
        bugsList.push(new Bug(newBugName, newBugType, (Math.floor(Math.random() * 1000)), (Math.floor(Math.random() * 800)), randomColour ));

        console.log(bugsList);

        currentBug = bugsList[bugNumber];
        bugNumber = bugNumber + 1;
        UpdateStatDisplays();
    }

    function checkBugDeath(bugObj){
        if (bugObj.food < 0){
            bugDeath(bugObj, "food");
        }else if (bugObj.sleep < 0){
            bugDeath(bugObj, "sleep");
        }else if (bugObj.cleanliness < 0){
            bugDeath(bugObj, "cleanliness");
        }else{
            return;
        }
    }
    function bugDeath(bugObj, cause){
        const bugIndex = bugsList.indexOf(bugObj);
        console.log("Your bug: " + bugObj.name + " has died due to a lack of " + cause);
        bugsList.splice(bugIndex, 1);
        bugNumber += -1;

    }

    
    function UpdateStatDisplays(){
        //update all the attribute displays to represent the selected pet
        document.querySelector('#nameDisplay').textContent = "name: " + currentBug.name;
        document.querySelector('#foodDisplay').textContent = "food: " + currentBug.food;
        document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + currentBug.cleanliness;
        document.querySelector('#sleepDisplay').textContent = "sleep: " + currentBug.sleep;
        document.querySelector('#happinessDisplay').textContent = "happiness: " + currentBug.happiness;
    }
    function decreaseStatsInterval(){ //loops through array of bug objects then reduces each of their stats, on a timer of 5 seconds.
        for(const bug in bugsList){
            bugsList[bug].reduceFood();
            bugsList[bug].reduceSleep();
            bugsList[bug].reduceCleanliness();
            bugsList[bug].calculateHappiness();

            checkBugDeath(bugsList[bug])
        }
        setTimeout(decreaseStatsInterval, 5000);

        //update all the attribute displays to represent the selected pet
        UpdateStatDisplays();
    }

    function addListeners(){ //Adds all the listeners to the elements and js variables. Event listeners usually cover user input.
        const feedButton = document.querySelector('#plusFood');
        feedButton.addEventListener('click', ()=>currentBug.increaseFood());
        const cleanButton = document.querySelector('#plusClean');
        cleanButton.addEventListener('click', ()=>currentBug.increaseCleanliness());
        const sleepButton = document.querySelector('#plusSleep');
        sleepButton.addEventListener('click', ()=>currentBug.increaseSleep());
        const starveButton = document.querySelector('#subFood');
        starveButton.addEventListener('click', ()=>currentBug.reduceFood());
        const dirtyButton = document.querySelector('#subClean');
        dirtyButton.addEventListener('click', ()=>currentBug.reduceCleanliness());
        const tireButton = document.querySelector('#subSleep');
        tireButton.addEventListener('click', ()=>currentBug.reduceSleep());

        const newPetButton = document.querySelector('#newPet');
        newPetButton.addEventListener('click', ()=>createNewBug(prompt("Insert new bug's Name",''), prompt("Insert new bug's Type",'')));

        const canvas = document.getElementById("canvas1");
        canvas.addEventListener('click', selectBug);
        
        canvas.addEventListener('mousemove', (e)=> calculateMousePos(e)); //Doubt this'll work as intended. Will need somekind of setTimeout or running in the updateAll function. If so, then may not be possible to use event listeners.
        canvas.addEventListener('mouseup', toggleHold);
        canvas.addEventListener('mousedown', toggleHold);
    }
});