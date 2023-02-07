export class Bug {
    constructor(name, type, spawnX, spawnY, colour){
        this.name = name
        this.type = type
        this.food = 50
        this.sleep = 50
        this.cleanliness = 50
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

        this.behaviour = "wants_to_wander";
        this.wanderInterval = 2000;
        this.wanderTimer = 0;
        this.moveDestination;
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
        if (this.food > 100){ //Sets max number to 100
            this.food = 100;
        }
        document.querySelector('#foodDisplay').textContent = "food: " + this.food;
    }
    increaseCleanliness (){
        this.cleanliness += 2;
        if (this.cleanliness > 100){ //Sets max number to 100
            this.cleanliness = 100;
        }
        document.querySelector('#cleanlinessDisplay').textContent = "cleanliness: " + this.cleanliness;
    }
    increaseSleep (){
        this.sleep += 2;
        if (this.sleep > 100){ //Sets max number to 100
            this.sleep = 100;
        }
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



    moveLerp(overallSpeed){ //speed is amount per second
        if (this.moveDestination.x == this.x && this.moveDestination.y == this.y){ //If the bug is at its destination then break
            this.behaviour = "wants_to_wander";
            return;
        }
        
        const timeNeeded = Math.sqrt(Math.pow(this.moveDestination.x - this.x, 2) + Math.pow(this.moveDestination.y - this.y, 2)) / overallSpeed; //time = distance / speed: distance is the difference between current position and destination position (pythagaros)

        const xSpeed = (this.moveDestination.x - this.x)/timeNeeded;
        const ySpeed = (this.moveDestination.y - this.y)/timeNeeded;
        // console.log("xSpeed: " + Math.abs(xSpeed) + " > than difference: " + Math.abs(this.moveDestination.x - this.x));
        // console.log("ySpeed: " + Math.abs(ySpeed) + " > than difference: " + Math.abs(this.moveDestination.y - this.y));


        if (Math.abs(this.moveDestination.x - this.x) <= Math.abs(xSpeed) && Math.abs(this.moveDestination.y - this.y) <= Math.abs(ySpeed)){//If the bug is too close to the destination and the xSpeed and ySpeed will overshoot, teleport to final destination
            this.x = this.moveDestination.x;
            this.y = this.moveDestination.y;
            //console.log("TELEPORT TIME!");
            
            this.behaviour = "wants_to_wander";
            return;
        }else{
            //console.log("BLARG!")
        }

        this.x += xSpeed;
        this.y += ySpeed;

        this.recalculateBounds();  //bug has moved, and therefore must recalculate its bounds so it can be clicked on correctly
    }
}