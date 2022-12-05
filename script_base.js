//const prompt = require("prompt-sync")();
import promptSync from 'prompt-sync';
const prompt = promptSync();
import fs from 'fs/promises';

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
    }
    reduceCleanliness (ammount){
        this.cleanliness -= ammount;
    }
    reduceSleep (ammount){
        this.sleep -= ammount;
    }
    
    increaseFood (ammount){
        this.food += ammount;
    }
    increaseCleanliness (ammount){
        this.cleanliness += ammount;
    }
    increaseSleep (ammount){
        this.sleep += ammount;
    }
    
    calculateHappiness (){
        this.happiness = (this.food + this.cleanliness + this.sleep)/3;
    }
}


function startGame(){
    let pet1;
    
    console.log("Welcome to your Virtual Pet!")
    pet1 = {
        name:"dude",
        type:"dog",
        food:100,
        sleep:100,
        cleanliness:100,
        happiness:50,
        age:0,
        health:100,
        birthday:"03/10/22",
        deathday:null,
    }

    console.log("Say hello to your new " + pet1.type + ": " + pet1.name + "!")
    
    console.log(pet1.food);
    pet1.reduceFood();
    console.log(pet1.food);
    
    gameLoop()
}

let time = 10;
function gameLoop(){
    console.log("tick: " + time);
    time = time - 1;
    //here goes calling of methods that decay pet's stats
    
    if (time != 0){ setTimeout(GameLoop, 1000); } 
}

startGame();