class Boid {
    constructor() {
      this.position = createVector(width/2, height/2);
      this.velocity = p5.Vector.random2D();
      let randomValue = random(0.1, 1.5);
      this.velocity.setMag(randomValue);
      this.acceleration = createVector();
      this.size = 16*randomValue;
      this.color = color(random(125, 255),51,51);

    }


    update(){
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);


    }

    show() {
        strokeWeight(this.size);
        stroke(this.color);
        point(this.position.x, this.position.y);
        
    }
}

