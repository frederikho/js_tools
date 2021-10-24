class Boid {
	constructor() {
		let randomSeed = random(0.0, 1.0);
		let randomSeed2 = random(0.0, 1.0);
		let randomSeed3 = random(0.0, 1.0);

		this.position = createVector(random(width), random(height));
		this.velocity = p5.Vector.random2D(); // more like the direction. Sollte ich ändern. #*
		
		this.initSpeed = getRandomVal(randomSeed, 1, 4)
		this.velocity.setMag(this.initSpeed);
		this.acceleration = createVector();
		this.size = 12;
		this.color = color(random(110, 255),51,51); // Rottöne, not aligned with random
		this.maxForce = 0.2;
		this.maxSpeed = 4; 	
		
		this.initPerceptionRadius = 100;
		this.perceptionRadius = this.initPerceptionRadius;



	} 

	edges () {
		if (this.position.x > width) {
			this.position.x = 0;
		} else if (this.position.x < 0) {
			this.position.x = width
		}
		
		if (this.position.y > height) {
			this.position.y = 0;
		} else if (this.position.y < 0) {
			this.position.y = height
		}
		
	}

	align (flock) {
		let perceptionRadius = this.perceptionRadius; //distance to other boids taken into account for alignment
		let desiredForce = createVector(); //average
		let total = 0; 
		for (let other of flock) {
			let dis = dist(this.position.x, this.position.y, 
				other.position.x, other.position.y);

			if (other != this && dis < perceptionRadius){
				desiredForce.add(other.velocity);	
				total ++;		
			}
		}
		
		if (total > 0) {
			desiredForce.div(total);
			desiredForce.setMag(this.maxSpeed);
			desiredForce.sub(this.velocity);
			desiredForce.limit(this.maxForce);
		}

		return desiredForce;
		
	}

	cohesion (flock) {
		let perceptionRadius = this.perceptionRadius; //distance to other boids taken into account for alignment
		let desiredForce = createVector(); //average
		let total = 0; 
		for (let other of flock) {
			let dis = dist(this.position.x, this.position.y, 
				other.position.x, other.position.y);

			if (other != this && dis < perceptionRadius){
				desiredForce.add(other.position);	
				total ++;		
			}
		}
		
		if (total > 0) {
			desiredForce.div(total);
			desiredForce.sub(this.position);
			desiredForce.setMag(this.maxSpeed);
			desiredForce.sub(this.velocity);
			desiredForce.limit(this.maxForce);
		}

		return desiredForce;
		
	}	

	separation (flock) {
		let perceptionRadius = this.perceptionRadius; //distance to other boids taken into account for alignment
		let desiredForce = createVector(); //average
		let total = 0; 
		for (let other of flock) {
			let dis = dist(this.position.x, this.position.y, 
				other.position.x, other.position.y);

			if (other != this && dis < perceptionRadius){
				let diffToOther = p5.Vector.sub(this.position, other.position);
				diffToOther.div(dis * dis); // invert the direction
				desiredForce.add(diffToOther);	
				total ++;		
			}
		}
		
		if (total > 0) {
			desiredForce.div(total);
			
			desiredForce.setMag(this.maxSpeed);
			desiredForce.sub(this.velocity);
			desiredForce.limit(this.maxForce);
		}

		return desiredForce;
		
	}	

	flockBehaviour (flock) { // #* kürzen?
		
		let alignment = this.align(flock);
		let cohesion = this.cohesion(flock);
		let separation = this.separation(flock);
		
		
		alignment.mult(alignSlider.value());
		cohesion.mult(cohesionSlider.value());
		separation.mult(separationSlider.value());
		
		

		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(separation);
		

	}

	update(){
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.acceleration.mult(0);

		this.perceptionRadius = this.initPerceptionRadius * perceptionRadiusSlider.value();
		
	}

	show() {
		strokeWeight(this.size);
		stroke(this.color);
		point(this.position.x, this.position.y);
		
	}
}

