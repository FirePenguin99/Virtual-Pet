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
    const choice = prompt("Do you already have a Pet (type '1') or wish to make a New one(type '2')?");
    if (choice == "1"){
        let objData = readPetFromJSON("petDatabase.json");

        pet1 = Object.assign(Pet.prototype, objData);
    }
    else if(choice == "2"){
        const PetName = prompt("Please enter your pet's name ")
        const PetType = prompt("Please enter your pet's type ")

        //pet1 = new Pet(PetName, PetType)
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
    }
    
    console.log(pet1.food);
    pet1.reduceFood();
    console.log(pet1.food);
    
    gameLoop()
}

// async function WritePetToJSON(object){
//     const out = JSON.stringify(object);
//     await fs.writeFile("petDatabase.json", out);
// }
// async function ReadPetFromJSON(jsonName){
//     const data = await fs.readFile(jsonName);
//     return JSON.parse(data);
// }

// function SavePet(){
// }

let time = 10;
function gameLoop(){
    console.log("tick: " + time);
    time = time - 1;
    //here goes calling of methods that decay pet's stats
    
    if (time != 0){ setTimeout(GameLoop, 1000); } 
}

startGame();