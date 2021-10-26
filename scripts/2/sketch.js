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
let shadowdepth = 80;
let frogleaf;
let edges = false;
let mouseIsPressed;
let velocity = p5.Vector.random2D();


function setup () {

    createCanvas(windowWidth-25,windowHeight-25);

    // const verly = new Verly(16, canvas, ctx);
    quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));
    for (let i = 0; i < 82; i++){
        flock.push(new Boid());
        flock[i].addArm(3); // what does this do?
    }
    
    
    frogleaf = new FrogLeaf(windowWidth*0.45,windowHeight*0.85,14,0.6);
    
    alignmentSlider = createSlider(0.5, 2, 0.8, 0.1);
    alignmentSlider.position(90,windowHeight-150);
    cohesionSlider = createSlider(0, 1, 0.55, 0.1);
    cohesionSlider.position(90,windowHeight-120);
    separationSlider = createSlider(0, 1, 0.6, 0.1);
    separationSlider.position(90,windowHeight-90);
    
    edgesCheckbox = createCheckbox('', false);
    edgesCheckbox.changed(activateEdges);
    edgesCheckbox.position(90,windowHeight-60);
}

function activateEdges () {
    edges = !edges;
}

function draw () {
    
    quadTree.clear();
    for (const boid of flock) {
      quadTree.addItem(boid.position.x, boid.position.y, boid);
    }

    background(51);
    //quadTree.debugRender();

    for (let boid of flock) {
        boid.flockBehaviour(flock);
        boid.edges();
        boid.update();
        boid.show();    
    }

    //----background
    
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
    
    // big triangle top right
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

    // text 
    noStroke();
    fill(255);
    textSize(12);
    text("alignment", alignmentSlider.x  -75 , alignmentSlider.y + 10);
    text("separation", alignmentSlider.x  -75 , separationSlider.y + 10);
    text("cohesion", alignmentSlider.x  -75, cohesionSlider.y + 10);
    text("edges", edgesCheckbox.x  -75, edgesCheckbox.y + 10);
    //text("Craig Reynold's Boids, Daniel shiffman's nature of code", alignmentSlider.x  -103, windowHeight-140);
    textFont("Helvetica");
    textSize(54);
    //text("Title", alignmentSlider.x  -160 , windowHeight - 165);

    if (mouseIsPressed) {
        let r = 5;
        let theta = velocity.heading() + radians(90);
        let shadowdepth = 10;
        push();
        translate(mouseX-shadowdepth, mouseY+shadowdepth);
        rotate(theta);
        beginShape();
        noStroke();
        fill(150,15);
        vertex(0, -r*2);
        vertex(-r, r);
        vertex(r, r);
        endShape(CLOSE);
        pop();

        push();
        translate(mouseX, mouseY);
        rotate(theta)
        beginShape();
        stroke(255,150);
        strokeWeight(2);
        fill(255,50);
        vertex(0, -r * 2);
        vertex(-r, r );
        vertex(r, r );
        endShape(CLOSE);
        pop();
        //tailrender();

    }
}

function getRandomVal (randomSeed, min, max) {
    return min + (randomSeed * (max-min));
}

function mousePressed(){
    mouseIsPressed = true;
}
  
function mouseReleased() {
    mouseIsPressed = false;
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
// random movements?