export class Bug {
    constructor(name, type, colour){
        this.name = name
        this.type = type
        this.food = 100
        this.sleep = 100
        this.cleanliness = 100
        this.happiness = 50

        this.x = 100;
        this.y = 100;

        this.colour = colour;
    }
    reduceFood(){
        this.food -= 2;
        document.querySelector('#foodDisplay').textContent = "food: " + this.food;
    }
    reduceCleanliness (){
        this.cleanliness -= 2;
        document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + this.cleanliness;
    }
    reduceSleep (){
        this.sleep -= 2;
        document.querySelector('#sleepDisplay').textContent = "sleep: " + this.sleep;
    }

    increaseFood (){
        this.food += 2;
        document.querySelector('#foodDisplay').textContent = "food: " + this.food;
    }
    increaseCleanliness (){
        this.cleanliness += 2;
        document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + this.cleanliness;
    }
    increaseSleep (){
        this.sleep += 2;
        document.querySelector('#sleepDisplay').textContent = "sleep: " + this.sleep;
    }
    calculateHappiness (){
        this.happiness = (this.food + this.cleanliness + this.sleep)/3;
        document.querySelector('#happinessDisplay').textContent = "happiness: " + this.happiness;
    }

    draw(context){
        context.fillStyle = this.colour;
        context.fillRect(this.x, this.y, 20, 20);
    }
}