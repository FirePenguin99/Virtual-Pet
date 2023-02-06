export class Bug {
    constructor(name, type, spawnX, spawnY, colour){
        this.name = name
        this.type = type
        this.food = 100
        this.sleep = 100
        this.cleanliness = 100
        this.happiness = 50

        this.x = spawnX;
        this.y = spawnY;

        this.width = 20;
        this.height = 20;

        this.colour = colour;

        this.bounds = {
            left : this.x,
            right : this.x + this.width,
            top : this.y,
            bottom : this. y + this.height
        }
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
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    recalculateBounds(){
        this.bounds = {
            left : this.x,
            right : this.x + this.width,
            top : this.y,
            bottom : this. y + this.height
        }
    }
}