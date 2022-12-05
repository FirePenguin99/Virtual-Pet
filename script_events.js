// import promptSync from 'prompt-sync';
// const prompt = promptSync();
// import fs from 'fs/promises';

let currentDate = "03/10/22"

class Pet {
    constructor(name, type){
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
    reduceFood (){
        this.food -= 2;
        console.log("food: " + this.food);
    }
    reduceCleanliness (){
        this.cleanliness -= 2;
        console.log("cleanliness: " + this.cleanliness);
    }
    reduceSleep (){
        this.sleep -= 2;
        console.log("sleep: " + this.sleep);
    }
    
    increaseFood (){
        this.food += 2;
        console.log("food: " + this.food);
    }
    increaseCleanliness (){
        this.cleanliness += 2;
        console.log("cleanliness: " + this.cleanliness);
    }
    increaseSleep (){
        this.sleep += 2;
        console.log("sleep: " + this.sleep);
    }
    
    calculateHappiness (){
        this.happiness = (this.food + this.cleanliness + this.sleep)/3;
        console.log(this.happiness);
    }
}

function startGame(){
    
    console.log("Welcome to your Virtual Pet!")
    let pet1 = new Pet("goob", "cat");

    console.log("Say hello to your new " + pet1.type + ": " + pet1.name + "!")
    
    console.log(pet1.food);
    pet1.reduceFood();
    console.log(pet1.food);

    const feedButton = document.querySelector('#plusFood');
    feedButton.addEventListener('click', ()=>pet1.increaseFood());
    const cleanButton = document.querySelector('#plusClean');
    cleanButton.addEventListener('click', ()=>pet1.increaseCleanliness());
    const sleepButton = document.querySelector('#plusSleep');
    sleepButton.addEventListener('click', ()=>pet1.increaseSleep());
    const starveButton = document.querySelector('#subFood');
    starveButton.addEventListener('click', ()=>pet1.reduceFood());
    const dirtyButton = document.querySelector('#subClean');
    dirtyButton.addEventListener('click', ()=>pet1.reduceCleanliness());
    const tireButton = document.querySelector('#subSleep');
    tireButton.addEventListener('click', ()=>pet1.reduceSleep());
}

window.addEventListener('load', ()=>{

    startGame();

});