class Boid {
	constructor() {
		let randomSeed = random(0.0, 1.0);
		let randomSeed2 = random(0.0, 1.0);
		let randomSeed3 = random(0.0, 1.0);

		this.arms = [];
		this.lastarm = null;
		this.position = createVector(random(width), random(height));
		this.velocity = p5.Vector.random2D(); // more like the direction. Sollte ich ändern. #*
		
		this.initSpeed = getRandomVal(randomSeed, 1, 4)
		this.velocity.setMag(this.initSpeed);
		this.acceleration = createVector();
		this.size = 12;
		this.color = color(random(110, 255),51,51); // Rottöne, not aligned with random
		this.maxForce = 0.4;
		this.maxSpeed = 3; 	
		
		this.initPerceptionRadius = 60;
		this.perceptionRadius = this.initPerceptionRadius;

		this.shadowDepth = 20; // #* implementieren

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

		let perceptionRadius = 25;
		let desiredForce = createVector();
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
			desiredForce.limit(this.maxForce*1.35); // maxForce. Should be higher than the other forces
			this.acceleration.add(desiredForce);
		}	
	}

	align (flock) {
		let perceptionRadius = this.perceptionRadius; //distance to other boids taken into account for alignment
		let perceptionCount = 5;
		let desiredForce = createVector(); //average
		let total = 0; 
		for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
				desiredForce.add(other.velocity);	
				total ++;		
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
		let perceptionRadius = 100; //distance to other boids taken into account for alignment
		let perceptionCount = 5;
		let desiredForce = createVector(); //average
		let total = 0; 
		for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
				desiredForce.add(other.position);
				total ++;
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
		let perceptionCount = 5;
		let desiredForce = createVector(); //average
		let total = 0; 
		for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
			const diffToOther = p5.Vector.sub(this.position, other.position);
			const diffToOtherLength = diffToOther.mag();
			if (diffToOtherLength === 0) continue;
			diffToOther.div(diffToOtherLength*diffToOtherLength); // invert the direction
			desiredForce.add(diffToOther);	
			total ++;		
		}
	
		
		if (total > 0) {
			desiredForce.div(total);
			desiredForce.setMag(this.maxSpeed);
			desiredForce.sub(this.velocity);
			desiredForce.limit(this.maxForce);
		}

		return desiredForce;
		
	}	

	flockBehaviour (flock) {
		
		let alignment = this.align(flock);
		let cohesion = this.cohesion(flock);
		let separation = this.separation(flock);
		//let avoidEdge = this.edges();
		
		alignment.mult(alignmentSlider.value());
		cohesion.mult(cohesionSlider.value());
		separation.mult(separationSlider.value());
		
		

		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(separation);
		//this.acceleration.add(avoidEdge);
		

	}

	update(){
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);
		this.acceleration.mult(0);

		//this.perceptionRadius = this.initPerceptionRadius * perceptionRadiusSlider.value();
		
	}

	show() {
		
		let theta = this.velocity.heading() + radians(90);
		push();
		translate(this.position.x-this.shadowDepth, this.position.y+this.shadowDepth);
		rotate(theta);
		beginShape();
		noStroke();
		fill(0,15);
		vertex(0, -this.r*2);
		vertex(-this.r, this.r);
		vertex(this.r, this.r);
		endShape(CLOSE);
		pop();
	
		push();
		translate(this.position.x, this.position.y);
		rotate(theta)
		beginShape();
		stroke(255,150);
		strokeWeight(2);
		fill(255,50);
		vertex(0, -this.r * 2);
		vertex(-this.r, this.r );
		vertex(this.r, this.r );
		endShape(CLOSE);
		pop();
		this.tailrender();
	}

	addArm(length){
		var arm = new Arm(0,0,length,0);
		if(this.lastarm){
	
		  arm.x = this.lastarm.getEndX();
		  arm.y = this.lastarm.getEndY();
		  arm.parent = this.lastarm;
	
		}else{
		  arm.x = this.x;
		  arm.y = this.y;
		}
		  this.arms.push(arm);
		  this.lastarm = arm;
	}
	//-------------draw tail;
	tailrender(){

		for(var i = 0; i < this.arms.length; i++){
		this.arms[i].render();
		}
	}

	drag(x, y){

		this.lastarm.drag(x, y);
	}
}

class Arm{

	constructor(x,y,length,angle){
		this.x = x;
		this.y = y;
		this.length = length;
		this.angle = angle;
		this.parent = null;
  
	  this.shadowDepth = 25;
  
  
	}
  
	getEndX(){
		return this.x + cos(this.angle) * this.length;
	}
  
	getEndY(){
		return this.y + sin(this.angle) * this.length;
	}
  
	pointAt(x, y) {
	  let dx = x - this.x;
	  let dy = y - this.y;
	  this.angle = atan2(dy, dx);
	}
  
	drag(x, y){
  
	   this.pointAt(x, y);
	   this.x = x - cos(this.angle) * this.length;
	   this.y = y - sin(this.angle) * this.length;
	   if (this.parent) {
  
		  this.parent.drag(this.x, this.y);
  
		}
  
	}

	render(){
		stroke(7,48,42);
		strokeWeight(1.5);
		line(this.x, this.y, this.getEndX(), this.getEndY());
	   //  stroke(7,48,42,25);
	   //  line(this.x-25, this.y+25, this.getEndX()-25, this.getEndY()+25);
   
   
	 }
   
	 update(){
	   this.getEndX();
	   this.getEndY();
	   this.render();
	 }
}
