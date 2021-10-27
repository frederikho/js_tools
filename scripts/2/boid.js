class Boid {
	constructor(x, y) {
		
		let randomSeed = random(0.0, 1.0);
		let randomSeed2 = random(0.0, 1.0);
		let randomSeed3 = random(0.0, 1.0);

		this.id = flock.length;
		this.position = createVector(x, y);
		
		this.velocity = p5.Vector.random2D(); // more like the direction. Sollte ich ggf ändern. #*
		this.velocity.setMag(this.maxSpeed);
		this.acceleration = createVector();
		this.accelerationBuffer = createVector();
		this.size = 12;
		this.color = color(getRandomVal(randomSeed, 110, 255),51,51); // Rottöne, aligned with random
		this.maxSpeedInit = getRandomVal(randomSeed, 2, 2);

		this.maxSpeed = this.maxSpeedInit;
		
		this.initPerceptionRadius = 60;
		this.perceptionRadius = this.initPerceptionRadius;

		this.shadowDepth = 20; // #* implementieren
		this.path = [[this.position, this.velocity]];

		// this.tail = new Tail(
		// 	this.position.x,
		// 	this.position.y,
		// 	Math.floor(random(5, 10)),
		// 	Math.floor(random(5, 10)),
		// 	0,
		// 	verly
		//   );
		//   this.tail.setGravity(new Vector(0, 0))

	} 

	edges () {

		let perceptionRadius = 10;
		let desiredForce = createVector();
		

		if (edges == false) { // edges off
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
		} else { // edges on
			if (this.position.x < perceptionRadius) {
				desiredForce = new p5.Vector(this.maxSpeed, this.velocity.y);
			} else if (this.position.x > width - perceptionRadius) {
				desiredForce = new p5.Vector(-this.maxSpeed, this.velocity.y);
			}
			if (this.position.y < perceptionRadius) {
				desiredForce = new p5.Vector(this.velocity.x, this.maxSpeed);
			} else if (this.position.y > height - perceptionRadius) {
				desiredForce = new p5.Vector(this.velocity.x, -this.maxSpeed);
			}

			if (desiredForce.x != 0 || desiredForce.y != 0) {
				desiredForce.setMag(this.maxSpeed);
				desiredForce.sub(this.velocity);
				desiredForce.limit(this.maxForce*1.25); // maxForce. Should be higher than the other forces
				this.acceleration.add(desiredForce);
			}	
		}


	}

	align () {
		let perceptionRadius = this.perceptionRadius; //distance to other boids taken into account for alignment
		let perceptionCount = 5;
		let desiredForce = createVector(); //average
		let total = 0; 
		let maxForce = 0.4;
		for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
				if (other != this) {
					desiredForce.add(other.velocity);	
					total ++;		
				}
			}
		
		
		if (total > 0) {
			desiredForce.div(total);
			desiredForce.setMag(this.maxSpeed);
			desiredForce.sub(this.velocity);
			desiredForce.limit(maxForce);
		}

		return desiredForce;
		
	}

	cohesion () {
		let perceptionRadius = 100; //distance to other boids taken into account for alignment
		let perceptionCount = 4;
		let desiredForce = createVector(); //average
		let maxForce = 0.40;
		let total = 0; 
		for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
				if (other != this) {
					desiredForce.add(other.position);
					total ++;
				}
			}		
		
		if (total > 0) {
			desiredForce.div(total);
			desiredForce.sub(this.position);
			desiredForce.setMag(this.maxSpeed);
			desiredForce.sub(this.velocity);
			desiredForce.limit(maxForce);
		}

		return desiredForce;
		
	}	

	separation () {
		let perceptionRadius = this.perceptionRadius; //distance to other boids taken into account for alignment
		let perceptionCount = 8;
		let desiredForce = createVector(); //average
		let total = 0; 
		let maxForce = 0.49;
		for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
			if (other != this) {
				const diffToOther = p5.Vector.sub(this.position, other.position);
				const diffToOtherLength = diffToOther.mag();
				if (diffToOtherLength === 0) continue; // probably other == self
				diffToOther.div(diffToOtherLength**2); // boids far away are less important
				desiredForce.add(diffToOther);	
				total ++;		
			}
		}
	
		
		if (total > 0) {
			desiredForce.div(total);
			desiredForce.setMag(this.maxSpeed);
			desiredForce.sub(this.velocity);
			desiredForce.limit(maxForce);
		}

		return desiredForce;
		
	}	

	flockBehaviour (flock) {
		
		let alignment = this.align(flock);
		let cohesion = this.cohesion(flock);
		let separation = this.separation(flock);
		
		
		alignment.mult(alignmentSlider.value());
		cohesion.mult(cohesionSlider.value());
		separation.mult(separationSlider.value());		
		
		
		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(separation);
		

	}

	update() {

		if (this.acceleration.mag() > 0) {
			this.velocity.add(this.acceleration);
			this.acceleration.mult(0);
		}
		
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity); 
		
		if (frameCount%5 == 0) { // every 5th frame
			this.path.push([this.position.copy(), this.velocity.copy()]);
			while (this.path.length > 20) {
				this.path.shift();
			}
		}
		
		//this.perceptionRadius = this.initPerceptionRadius * perceptionRadiusSlider.value();
		
	}

	show () {
		const dec = 0;
		let theta;
		let r = 7;
		let shadowdepth = 10;
		
		// circles
		// strokeWeight(this.size);
		// stroke(this.color);
		// point(this.position.x, this.position.y);
		

		let pathItemPosition;
		let pathItemVelocity;
		let pathItemColor = this.color;
		this.path.forEach(function (item, index) {
			// item[0] is position, item[1] is velocity 
			pathItemPosition = item[0];
			pathItemVelocity = item[1];
			theta = pathItemVelocity.heading() + radians(90);

			// triangle
			//shadow
			push();
			translate(pathItemPosition.x-shadowdepth, pathItemPosition.y+shadowdepth);
			rotate(theta);
			beginShape();
			noStroke();
			fill(0,30);
			vertex(0, -r * 2);
			vertex(-r*1.25, r );
			vertex(0, r/2 );
			vertex(r*1.25, r );
			endShape(CLOSE);
			pop();

			//triangle body
			push();
			translate(pathItemPosition.x, pathItemPosition.y);
			rotate(theta)
			beginShape();
			stroke(0, 50);
			strokeWeight(1);
			fill(pathItemColor);
			vertex(0, -r * 2);
			vertex(-r*1.25, r );
			vertex(0, r/2 );
			vertex(r*1.25, r );
			endShape(CLOSE);
			pop();
		  });

		
		theta = this.velocity.heading() + radians(90);

        // triangle
		//shadow
		push();
        translate(this.position.x-shadowdepth, this.position.y+shadowdepth);
        rotate(theta);
        beginShape();
        noStroke();
        fill(0,30);
        vertex(0, -r * 2);
        vertex(-r*1.25, r );
        vertex(0, r/2 );
		vertex(r*1.25, r );
        endShape(CLOSE);
        pop();

		//triangle body
        push();
        translate(this.position.x, this.position.y);
        rotate(theta)
        beginShape();
        stroke(0, 50);
        strokeWeight(1);
        fill(this.color);
        vertex(0, -r * 2);
        vertex(-r*1.25, r );
        vertex(0, r/2 );
		vertex(r*1.25, r );
        endShape(CLOSE);
        pop();
		

		
	}


}