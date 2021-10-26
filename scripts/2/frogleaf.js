class FrogLeaf{
    constructor(x, y, size, rotation){
        this.x = x;
        this.y = y;
        this.size = size;
        this.rotation = rotation;
    }

    drawLeaf(){
        push();
        translate(this.x,this.y);
        rotate(this.rotation);

        stroke(0,204,184);
        noFill();
        triangle(0-this.size,0+this.size,0,0-this.size*0.6,0+this.size,0+this.size);
        pop();
        push();
        translate(this.x-this.size*2,this.y-this.size*1.1);
        rotate(this.rotation);
        stroke(0,204,184);
        noFill();
        triangle(0-this.size,0+this.size,0,0-this.size*0.6,0+this.size,0+this.size);
        pop();
        push();
        translate(this.x-this.size*1.9,this.y+this.size*1.1);
        rotate(this.rotation);
        noStroke();
        fill(255);
        triangle(0-this.size,0+this.size,0,0-this.size*0.6,0+this.size,0+this.size);
        pop();
    }
  }
