class Agent {
	constructor(x, y) {
        this.id = agents.length;
        this.position = createVector(x, y);
        this.color = color(getRandomVal(random(0.0, 1.0), 50, 255),getRandomVal(random(0.0, 1.0), 50, 255),getRandomVal(random(0.0, 1.0), 50, 255), 155);
        this.size = 14;
        this.sizeCenterPoint = 9;
        this.acceleration = createVector();
        this.velocity = createVector();
        this.maxSpeed = 2;
        
        this.partner = [];
        this.partner[0] = Math.floor(random(0,1) * (agentsAmount-1)) +1;
        this.partner[1] = Math.floor(random(0,1) * (agentsAmount-1)) +1;

        while (this.partner[0] == this.id) // partner != this
        {
            this.partner[0] = Math.floor(random(0,1) * (agentsAmount-1)) +1;
        }

        while (this.partner[1] == this.partner[0] || this.partner[1] == this.id) // two different partners, partner != this
        {
            this.partner[1] = Math.floor(random(0,1) * (agentsAmount-1)) +1;
        }
        
    }

    move () {
        let other0 = createVector(10,10);
        let other1 = createVector(10,10);
        let centerPoint = createVector(10,10);

        for (let other of agents) {
            if (other.id == this.partner[0]) {
                other0 = other;
            }

            if (other.id == this.partner[1]) {
                other1 = other;
            }
        }
        
        // center between this and partners
        // centerPoint = p5.Vector.add(this.position.copy(), other0.position);
        // centerPoint = centerPoint.div(2);
        // strokeWeight(7);
        // stroke(4, 180, 4);
        // //point(centerPoint.x, centerPoint.y);
        
        // centerPoint = p5.Vector.add(this.position.copy(), other1.position);
        // centerPoint = centerPoint.div(2);
        // strokeWeight(7);
        // stroke(4, 180, 4);
        //point(centerPoint.x, centerPoint.y);

        // center between partners
        centerPoint = p5.Vector.add(other0.position, other1.position);
        centerPoint = centerPoint.div(2);
        strokeWeight(this.sizeCenterPoint);
        stroke(this.color);
        point(centerPoint.x, centerPoint.y);


        // normal vector (orthogonal), normalised
        let normalVector = p5.Vector.sub(other0.position, other1.position);
        normalVector = createVector(-normalVector.y, normalVector.x).normalize().copy();

        // let normalVectorEnd = createVector();
        // normalVectorEnd = p5.Vector.add(centerPoint, normalVector);
        // strokeWeight(3);
        // stroke(4, 180, 4, 30);
        //line(centerPoint.x, centerPoint.y, normalVectorEnd.x, normalVectorEnd.y);
        
        let normalVectorInv = createVector(-normalVector.y, normalVector.x).copy();
        let target = createVector();
        let c = 0;
        c = (centerPoint.y + (this.position.x - centerPoint.x)*normalVector.y/normalVector.x - this.position.y)/(normalVectorInv.y - normalVectorInv.x*normalVector.y/normalVector.x);
        //c = (centerPoint.x  - this.position.x + normalVector.x/normalVector.y*(this.position.y - centerPoint.y))/(normalVectorInv.x - normalVectorInv.y*normalVector.x/normalVector.y); // same result as calculation above
        
        normalVectorInv.mult(c);
        target = p5.Vector.add(this.position, normalVectorInv);

        strokeWeight(2);
        stroke(this.color);
        setLineDash([5, 8]);
        line(this.position.x, this.position.y, target.x, target.y);
        line(centerPoint.x, centerPoint.y, target.x, target.y);

        this.velocity = normalVectorInv.copy();
        
        
        

    }

    update () {
        
        this.velocity.limit(this.maxSpeed);
        if (mouseIsPressed == true) {
            this.position.add(this.velocity); 
        }
        

    }

    show () {
        

        //line
        strokeWeight(3);
        stroke(100, 100);
        setLineDash([0]);
        for (let other of agents) {
            if (other.id == this.partner[0] || other.id == this.partner[1]) {
                line(this.position.x, this.position.y, other.position.x, other.position.y);
            }            
        }

        // shot this as circle
        strokeWeight(this.size);
		stroke(this.color);
		point(this.position.x, this.position.y);
    }
}