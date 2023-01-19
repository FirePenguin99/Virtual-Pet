// import promptSync from 'prompt-sync';
// const prompt = promptSync();
// import fs from 'fs/promises';

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
    console.log("food: " + obj.food);
    document.querySelector('#foodDisplay').textContent = "food: " + obj.food;
}
function reduceCleanliness (obj){
    obj.cleanliness -= 2;
    console.log("cleanliness: " + obj.cleanliness);
    document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + obj.cleanliness;
}
function reduceSleep (obj){
    obj.sleep -= 2;
    console.log("sleep: " + obj.sleep);
    document.querySelector('#sleepDisplay').textContent = "sleep: " + obj.sleep;
}

function increaseFood (obj){
    obj.food += 2;
    console.log("food: " + obj.food);
    document.querySelector('#foodDisplay').textContent = "food: " + obj.food;
}
function increaseCleanliness (obj){
    obj.cleanliness += 2;
    console.log("cleanliness: " + obj.cleanliness);
    document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + obj.cleanliness;
}
function increaseSleep (obj){
    obj.sleep += 2;
    console.log("sleep: " + obj.sleep);
    document.querySelector('#sleepDisplay').textContent = "sleep: " + obj.sleep;
}

function calculateHappiness (obj){
    obj.happiness = (obj.food + obj.cleanliness + obj.sleep)/3;
    console.log(obj.happiness);
    document.querySelector('#happinessDisplay').textContent = "happiness: " + obj.happiness;
}

let currentPet;
//use a list to implement multiple pets. Use .append with constructor

function startGame(){
    
    console.log("Welcome to your Virtual Pet!")
    let pet1 = new Pet("goob", "cat");
    console.log("Say hello to your new " + pet1.type + ": " + pet1.name + "!")

    currentPet = pet1;
    console.log(currentPet.name);

    let pet2 = new Pet("gewb", "dog");
    console.log("Say hello to your new " + pet2.type + ": " + pet2.name + "!")

    currentPet = pet2;
    console.log(currentPet.name);

    //decreaseStatsInterval();
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

    const nameButton = document.querySelector('#nameChange');
    nameButton.addEventListener('click', changeName);

    const bug1 = document.querySelector('#bug1');
    bug1.addEventListener('click', (e)=>logToConsole(e));

    const bug2 = document.querySelector('#bug2');
    bug2.addEventListener('click', (e)=>logToConsole(e));
}

//use for loop in pets list to decrease the stats
function decreaseStatsInterval(){
    reduceFood(currentPet);
    reduceCleanliness(currentPet);
    reduceSleep(currentPet);
    calculateHappiness(currentPet);

    setTimeout(decreaseStatsInterval, 5000);
}

function logToConsole(element){
    console.log("Clicked on " + element.target.id);
}

function changeName (){
    document.querySelector('#nameDisplay').textContent = "food: " + currentPet.name;
}