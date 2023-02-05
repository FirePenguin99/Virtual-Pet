import { Bug } from './bugs.mjs';

window.addEventListener('load', ()=>{
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    
    function animate(){ //function that happens all the time
        ctx.clearRect(0, 0, 1200, 800);
        bug1.draw(ctx);
        bug1.x += 1;
        requestAnimationFrame(animate);
    }

    let currentBug;
    let bugsList = [];
    let bugNumber = 0;

    let bug1 = new Bug("goob", "queen", 'red'); 
    console.log(bug1);
        
    bugsList.push(bug1);
    console.log(bugsList);

    currentBug = bug1;
    console.log(currentBug);

    document.querySelector('#nameDisplay').textContent = "name: " + currentBug.name; //upon startup, game never used to display first pets name until the user had clicked on one. this line fixes this.


    addListeners();
    // startGame();
    animate();

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
        newPetButton.addEventListener('click', ()=>createNewPet(prompt("Insert new pet's Name",''), prompt("Insert new pet's Type",'')));
    }

    //loops through array of bug objects then reduces each of their stats, on a timer of 5 seconds.
    // function decreaseStatsInterval(){
    //     for(const bug in bugToSVG){
    //         reduceFood(bugToSVG[bug][1]);
    //         reduceCleanliness(bugToSVG[bug][1]);
    //         reduceSleep(bugToSVG[bug][1]);
    //         calculateHappiness(bugToSVG[bug][1]);
    //     }

    //     setTimeout(decreaseStatsInterval, 5000);

    //     //update all the attribute displays to represent the selected pet
    //     UpdateStatDisplays();
    // }

    function switchcurrentBug(element){ //uses the e variable from Event Listeners and an array to change the value of the "currentBug" variable.
        const selectedId = element.target.id
        
        for(const bug in bugToSVG){ //loop through array,
            if (selectedId == bugToSVG[bug][0]){ //until the clicked on SVG id matches one in the array.
                console.log("you just clicked on " + bugToSVG[bug][1].name + "!"); //log the found bug object's name attribute.
                currentBug = bugToSVG[bug][1];
            }
        }
        //update all the attribute displays to represent the selected pet
        UpdateStatDisplays();
    }

    function createNewPet(newBugName, newBugType){
        // //create svg
        // let newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //No idea why i need to use the NS variant of createElement, nor why I need to specifiy a namespace. SVGs may just be that way.
        // newCircle.setAttributeNS(null, "id", "bug"+(bugNumber+1)); //null is the namespace of the attribute, in which SVGs seem to not have in this instance, therefore null.
        // newCircle.setAttributeNS(null, "cx", "" + (Math.floor(Math.random() * 250))); //randomises spawning position
        // newCircle.setAttributeNS(null, "cy", + (Math.floor(Math.random() * 250)));
        // newCircle.setAttributeNS(null, "r", "20");
        // newCircle.style.fill = "rgb("+((Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255))); //randomises colour just for some temporary visual flair.
        
        // //insert svg
        // const targetDiv = document.querySelector('#canvas'); //find and store where to place the svg in the HTML
        // targetDiv.appendChild(newCircle); //append circle into the HTML, as a child of the SVG element.

        //create object
        bugToSVG.push([newCircle.id, null]);
        bugToSVG[bugNumber][1] = new Pet(newPetName, newPetType);

        bugsList.push(new Bug(newBugName, newBugType, "rgb("+((Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)))))

        console.log(bugsList);

        //attach event listener
        newCircle.addEventListener('click', (e)=>switchcurrentBug(e));

        currentBug = bugToSVG[bugNumber][1];

        bugNumber = bugNumber + 1;
    }

    function UpdateStatDisplays(){
        //update all the attribute displays to represent the selected pet
        document.querySelector('#nameDisplay').textContent = "name: " + currentBug.name;
        document.querySelector('#foodDisplay').textContent = "food: " + currentBug.food;
        document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + currentBug.cleanliness;
        document.querySelector('#sleepDisplay').textContent = "sleep: " + currentBug.sleep;
        document.querySelector('#happinessDisplay').textContent = "happiness: " + currentBug.happiness;
    }
});