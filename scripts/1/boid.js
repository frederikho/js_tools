class Boid {
	constructor() {
		let randomSeed = random(0.0, 1.0);
		let randomSeed2 = random(0.0, 1.0);
		let randomSeed3 = random(0.0, 1.0);

		this.position = createVector(width/2, height/2);
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(getRandomVal(randomSeed, 0.1, 1.5));
		this.acceleration = createVector();
		this.size = 16*getRandomVal(randomSeed, 0.1, 1.5);
		//this.color = color(random(0, 75),random(75, 155),random(155, 255)); // blau - türkis
		//this.color = color(random(0, 255),random(0, 255),random(0, 255)); // full range
		this.color = color(random(110, 255),51,51); // Rottöne, not aligned with random
		//this.color = color(getRandomVal(randomSeed, 110, 255),51,51); // Rottöne, aligned with random
		//this.color = color(getRandomVal(randomSeed, 175, 235),getRandomVal(randomSeed2, 10, 90),getRandomVal(randomSeed3, 10, 70)); // aligned with random

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

