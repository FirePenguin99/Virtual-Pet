let currentDate = "03/10/22"

function Pet(name, type){
    this.name = name
    this.type = type
    this.food = 100
    this.sleep = 100
    this.cleanliness = 100
    this.happiness = 50
    this.age = 0
    this.health = 100
    this.birthday = currentDate
    this.deathday = null
}

function reduceFood (obj){
    obj.food -= 2;
    //console.log("food: " + obj.food);
    document.querySelector('#foodDisplay').textContent = "food: " + currentPet.food;
}
function reduceCleanliness (obj){
    obj.cleanliness -= 2;
    //console.log("cleanliness: " + obj.cleanliness);
    document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + currentPet.cleanliness;
}
function reduceSleep (obj){
    obj.sleep -= 2;
    //console.log("sleep: " + obj.sleep);
    document.querySelector('#sleepDisplay').textContent = "sleep: " + currentPet.sleep;
}

function increaseFood (obj){
    obj.food += 2;
    //console.log("food: " + obj.food);
    document.querySelector('#foodDisplay').textContent = "food: " + currentPet.food;
}
function increaseCleanliness (obj){
    obj.cleanliness += 2;
    //console.log("cleanliness: " + obj.cleanliness);
    document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + currentPet.cleanliness;
}
function increaseSleep (obj){
    obj.sleep += 2;
    //console.log("sleep: " + obj.sleep);
    document.querySelector('#sleepDisplay').textContent = "sleep: " + currentPet.sleep;
}

function calculateHappiness (obj){
    obj.happiness = (obj.food + obj.cleanliness + obj.sleep)/3;
    //console.log(obj.happiness);
    document.querySelector('#happinessDisplay').textContent = "happiness: " + currentPet.happiness;
}

let currentPet;

let bugToSVG = [];

let bugNumber = 0;

function startGame(){
    
    console.log("Welcome to your Hive!")
    createNewPet((prompt("Insert the name of your Queen",'')), "queen"); 
    console.log(bugToSVG);
    
    console.log(currentPet);

    document.querySelector('#nameDisplay').textContent = "name: " + currentPet.name; //upon startup, game never used to display first pets name until the user had clicked on one. this line fixes this.

    
    decreaseStatsInterval();
}

window.addEventListener('load', ()=>{

    addListeners();
    startGame();

});

function addListeners(){
    const feedButton = document.querySelector('#plusFood');
    feedButton.addEventListener('click', ()=>increaseFood(currentPet));
    const cleanButton = document.querySelector('#plusClean');
    cleanButton.addEventListener('click', ()=>increaseCleanliness(currentPet));
    const sleepButton = document.querySelector('#plusSleep');
    sleepButton.addEventListener('click', ()=>increaseSleep(currentPet));
    const starveButton = document.querySelector('#subFood');
    starveButton.addEventListener('click', ()=>reduceFood(currentPet));
    const dirtyButton = document.querySelector('#subClean');
    dirtyButton.addEventListener('click', ()=>reduceCleanliness(currentPet));
    const tireButton = document.querySelector('#subSleep');
    tireButton.addEventListener('click', ()=>reduceSleep(currentPet));


    const newPetButton = document.querySelector('#newPet');
    newPetButton.addEventListener('click', ()=>createNewPet(prompt("Insert new pet's Name",''), prompt("Insert new pet's Type",'')));
}

//loops through array of bug objects then reduces each of their stats, on a timer of 5 seconds.
function decreaseStatsInterval(){
    for(const bug in bugToSVG){
        reduceFood(bugToSVG[bug][1]);
        reduceCleanliness(bugToSVG[bug][1]);
        reduceSleep(bugToSVG[bug][1]);
        calculateHappiness(bugToSVG[bug][1]);
    }

    setTimeout(decreaseStatsInterval, 5000);

    //update all the attribute displays to represent the selected pet
    UpdateStatDisplays();
}

function switchCurrentPet(element){ //uses the e variable from Event Listeners and an array to change the value of the "currentPet" variable.
    const selectedId = element.target.id
    
    for(const bug in bugToSVG){ //loop through array,
        if (selectedId == bugToSVG[bug][0]){ //until the clicked on SVG id matches one in the array.
            console.log("you just clicked on " + bugToSVG[bug][1].name + "!"); //log the found bug object's name attribute.
            currentPet = bugToSVG[bug][1];
        }
    }
    //update all the attribute displays to represent the selected pet
    UpdateStatDisplays();
}

function createNewPet(newPetName, newPetType){
    
    //create svg
    let newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //No idea why i need to use the NS variant of createElement, nor why I need to specifiy a namespace. SVGs may just be that way.
    newCircle.setAttributeNS(null, "id", "bug"+(bugNumber+1)); //null is the namespace of the attribute, in which SVGs seem to not have in this instance, therefore null.
    newCircle.setAttributeNS(null, "cx", "" + (Math.floor(Math.random() * 250))); //randomises spawning position
    newCircle.setAttributeNS(null, "cy", + (Math.floor(Math.random() * 250)));
    newCircle.setAttributeNS(null, "r", "20");
    newCircle.style.fill = "rgb("+((Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255))); //randomises colour just for some temporary visual flair.
    
    //insert svg
    const targetDiv = document.querySelector('#canvas'); //find and store where to place the svg in the HTML
    targetDiv.appendChild(newCircle); //append circle into the HTML, as a child of the SVG element.

    //create object
    bugToSVG.push([newCircle.id, null]);
    bugToSVG[bugNumber][1] = new Pet(newPetName, newPetType);

    console.log(bugToSVG);

    //attatch event listener
    newCircle.addEventListener('click', (e)=>switchCurrentPet(e));

    currentPet = bugToSVG[bugNumber][1];

    bugNumber = bugNumber + 1;
}

function UpdateStatDisplays(){
    //update all the attribute displays to represent the selected pet
    document.querySelector('#nameDisplay').textContent = "name: " + currentPet.name;
    document.querySelector('#foodDisplay').textContent = "food: " + currentPet.food;
    document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + currentPet.cleanliness;
    document.querySelector('#sleepDisplay').textContent = "sleep: " + currentPet.sleep;
    document.querySelector('#happinessDisplay').textContent = "happiness: " + currentPet.happiness;
}