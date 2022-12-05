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
}
function reduceCleanliness (obj){
    obj.cleanliness -= 2;
    console.log("cleanliness: " + obj.cleanliness);
}
function reduceSleep (obj){
    obj.sleep -= 2;
    console.log("sleep: " + obj.sleep);
}

function increaseFood (obj){
    obj.food += 2;
    console.log("food: " + obj.food);
}
function increaseCleanliness (obj){
    obj.cleanliness += 2;
    console.log("cleanliness: " + obj.cleanliness);
}
function increaseSleep (obj){
    obj.sleep += 2;
    console.log("sleep: " + obj.sleep);
}

function calculateHappiness (obj){
    obj.happiness = (obj.food + obj.cleanliness + obj.sleep)/3;
    console.log(obj.happiness);
}

// function attachListeners(){
//     const feedButton = document.querySelector('#plusFood');
//     feedButton.addEventListener('click', ()=>increaseFood(pet1));
//     const cleanButton = document.querySelector('#plusClean');
//     cleanButton.addEventListener('click', ()=>increaseCleanliness(pet1));
//     const sleepButton = document.querySelector('#plusSleep');
//     sleepButton.addEventListener('click', ()=>increaseSleep(pet1));
//     const starveButton = document.querySelector('#subFood');
//     starveButton.addEventListener('click', ()=>reduceFood(pet1));
//     const dirtyButton = document.querySelector('#subClean');
//     dirtyButton.addEventListener('click', ()=>reduceCleanliness(pet1));
//     const tireButton = document.querySelector('#subSleep');
//     tireButton.addEventListener('click', ()=>reduceSleep(pet1));
// }

function startGame(){
    
    console.log("Welcome to your Virtual Pet!")
    let pet1 = new Pet("goob", "cat");

    console.log("Say hello to your new " + pet1.type + ": " + pet1.name + "!")
    
    console.log(pet1.food);
    reduceFood(pet1);
    console.log(pet1.food);

    const feedButton = document.querySelector('#plusFood');
    feedButton.addEventListener('click', ()=>increaseFood(pet1));
    const cleanButton = document.querySelector('#plusClean');
    cleanButton.addEventListener('click', ()=>increaseCleanliness(pet1));
    const sleepButton = document.querySelector('#plusSleep');
    sleepButton.addEventListener('click', ()=>increaseSleep(pet1));
    const starveButton = document.querySelector('#subFood');
    starveButton.addEventListener('click', ()=>reduceFood(pet1));
    const dirtyButton = document.querySelector('#subClean');
    dirtyButton.addEventListener('click', ()=>reduceCleanliness(pet1));
    const tireButton = document.querySelector('#subSleep');
    tireButton.addEventListener('click', ()=>reduceSleep(pet1));
}

window.addEventListener('load', ()=>{

    //attachListeners();
    startGame();

});