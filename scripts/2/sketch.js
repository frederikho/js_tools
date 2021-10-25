//"use strict" // this code works the modern way. must be in first line
const flock = [];

let quadTree;
let alignmentSlider, cohesionSlider, separationSlider, perceptionRadiusSlider;

let leafblack;
let leafblack02;
let leafblack02shadow;
let leafwhite01;
let leafline;
let leaflineShadow;
let leafsmall01;
let leafsmall02;
let shadowdepth = 80    ;
let frogleaf;

function setup () {

    canvas = createCanvas(window.innerWidth,window.innerHeight-65);

    alignmentSlider = createSlider(0.5, 2, 1, 0.1);
    cohesionSlider = createSlider(0, 1, 0.45, 0.1);
    separationSlider = createSlider(0, 1, 0.59, 0.1);
    perceptionRadiusSlider = createSlider(0.0, 5, 1, 0.1);

    // const verly = new Verly(16, canvas, ctx);
    quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));
    for (let i = 0; i < 100; i++){
        flock.push(new Boid());
    }
}


function draw () {
    
    quadTree.clear();
    for (const boid of flock) {
      quadTree.addItem(boid.position.x, boid.position.y, boid);
    }

    background(51);
    quadTree.debugRender();

    for (let boid of flock) {
        boid.flockBehaviour(flock);
        boid.edges();
        boid.update();
        boid.show();    
    }

    //----background

    // big triangle center
    push();
    translate(680, -55);
    beginShape();
    rotate(-0.4);
    noStroke();
    fill(175,51,51,150);
    vertex(0, 400*1.2);
    vertex(250*1.2, 0);
    vertex(500*1.2, 400*1.2);
    endShape(CLOSE);
    pop();

    // big triangle center shadow
    push();
    translate(680-shadowdepth, -55+shadowdepth);
    beginShape();
    rotate(-0.4);
    noStroke();
    fill(0,30);
    vertex(0, 400*1.2);
    vertex(250*1.2, 0);
    vertex(500*1.2, 400*1.2);
    endShape(CLOSE);
    pop();
    
    // big triangle top left
    push();
    translate(-140, -10);
    beginShape();
    rotate(-0.8);
    noStroke();
    fill(175,51,51,150);
    vertex(0, 400*0.45);
    vertex(250*0.45, 0);
    vertex(500*0.45, 400*0.45);
    endShape(CLOSE);
    pop();

    // where?
    push();
    translate(580, 680);
    beginShape();
    rotate(-0.5);
    noStroke();
    fill(175,51,51,150);
    vertex(0, 400*0.06);
    vertex(250*0.06, 0);
    vertex(500*0.06, 400*0.06);
    endShape(CLOSE);
    pop();



    // push();
    // translate(225, 110);
    // beginShape();
    // rotate(0.3);
    // image(leafwhite01, 0,0);
    // pop();



    function drawLeaf(x,y,s){
        push();
        translate(width*x, height*y);
        beginShape();
        rotate(0.3);
        noStroke();
        fill(0,184,147,180);
        vertex(0, 400*1.4*s);
        vertex(250*1.4*s, 0);
        vertex(500*1.4*s, 400*1.4*s);
        endShape(CLOSE);
        pop();

    }

    noStroke();
    fill(255);
    textSize(12);
    text("alignment", alignmentSlider.x  -75 , windowHeight - 115);
    text("separaration", alignmentSlider.x  -75 , windowHeight -85);
    text("cohesion", alignmentSlider.x  -75, windowHeight-55);
    text("Craig Reynold's Boids, Daniel shiffman's nature of code", alignmentSlider.x  -103, windowHeight-140);
    textFont("Helvetica");
    textSize(54);
    text("1000 Triangles", alignmentSlider.x  -160 , windowHeight - 165);


}

function getRandomVal (randomSeed, min, max) {
    return min + (randomSeed * (max-min));
}


// to do:
// spatial division optimisation: quadtree, subdivision
// interface: max force, max speed, 
// design
// obstacles
// boids with different parameters
// angualar view of boid. boid wants to keep view empty.
// submit link to coding challenge
// traces, view radius option
// mouse interaction, vgl http://1000triangle.com/ https://anuraghazra.dev/parasites/
// in normale Website integrieren
