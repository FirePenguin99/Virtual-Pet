import { Bug } from './bugs.mjs';

window.addEventListener('load', ()=>{
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    
    function updateFrame(){ //function that happens every frame
        ctx.clearRect(0, 0, 1200, 800); //clears the entire canvas element
        
        for (let bug in bugsList){ //Loop through array containing all Bugs, and call their draw() method.
            bugsList[bug].draw(ctx);
        }
        
        // Move bug1
        //bug1.x += 1;
        //bug1.recalculateBounds();
        
        requestAnimationFrame(updateFrame);
    }

    let currentBug;
    let bugsList = [];
    let bugNumber = 0;

    const randomColour = "rgb("+((Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)));
    let bug1 = new Bug("goob", "queen", 100, 100, randomColour ); 
    
    console.log(bug1);
    bugsList.push(bug1);
    currentBug = bug1;
    
    document.querySelector('#nameDisplay').textContent = "name: " + currentBug.name; //Upon startup, game never used to display first pets name until the user had clicked on one. This line fixes this.


    addListeners();
    updateFrame();
    decreaseStatsInterval();


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

    function getMousePosition(canvas, event){ //Taken off the web, don't fully understand what getBoundingClientRect does.
        const bounds = canvas.getBoundingClientRect();
        const mousePos = {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
        }
        return mousePos;
    }

    function selectBug(event){ //It compares the returned value of getMousePosition and compares it to the corner co-ordinates of all bugs in the game (probably slow).
        const mousePos = getMousePosition(canvas, event); //Takes the event parameter for use in getMousePosition
        for (let bug in bugsList){
            if (mousePos.x >= bugsList[bug].bounds.left &&
                mousePos.x <= bugsList[bug].bounds.right &&
                mousePos.y >= bugsList[bug].bounds.top && 
                mousePos.y <= bugsList[bug].bounds.bottom){ //If mousePos is within the bounds of a Bug, set currentBug as the currently iterated bug, and log it's name.
                    currentBug = bugsList[bug];      
                    console.log(currentBug.name);   //Log Bug data
            }else{
                console.log("No bug 'ere");
            }
        }
        
        //update all the attribute displays to represent the selected pet
        UpdateStatDisplays();
    }

    function createNewBug(newBugName, newBugType){ 
        //create object
        const randomColour = "rgb("+((Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)));
        bugsList.push(new Bug(newBugName, newBugType, (Math.floor(Math.random() * 1000)), (Math.floor(Math.random() * 800)), randomColour ));

        console.log(bugsList);

        currentBug = bugsList[bugNumber];
        bugNumber = bugNumber + 1;
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
    }

    function UpdateStatDisplays(){
        //update all the attribute displays to represent the selected pet
        document.querySelector('#nameDisplay').textContent = "name: " + currentBug.name;
        document.querySelector('#foodDisplay').textContent = "food: " + currentBug.food;
        document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + currentBug.cleanliness;
        document.querySelector('#sleepDisplay').textContent = "sleep: " + currentBug.sleep;
        document.querySelector('#happinessDisplay').textContent = "happiness: " + currentBug.happiness;
    }

    function addListeners(){
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
        canvas.addEventListener('click', (e)=> selectBug(e));
    }
});