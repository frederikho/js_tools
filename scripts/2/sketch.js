//"use strict" // this code works the modern way. must be in first line
const flock = [];

let quadTree;
let alignmentSlider, cohesionSlider, separationSlider, perceptionRadiusSlider;

let edges = false;
let mouseIsPressed;
let velocity = p5.Vector.random2D();


function setup () {

    createCanvas(windowWidth-25,windowHeight-25);

    // const verly = new Verly(16, canvas, ctx);
    quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));
    for (let i = 0; i < 1; i++){
        flock.push(new Boid(random(width), random(height)));
    }
    
    
    frogleaf = new FrogLeaf(windowWidth*0.45,windowHeight*0.85,14,0.6);
    
    maxSpeedSlider = createSlider(0.001, 2.501, 1, 0.1);
    maxSpeedSlider.position(90,windowHeight-180);
    alignmentSlider = createSlider(0, 1.5, 0.8, 0.1);
    alignmentSlider.position(90,windowHeight-150);
    cohesionSlider = createSlider(0, 1.5, 0.55, 0.1);
    cohesionSlider.position(90,windowHeight-120);
    separationSlider = createSlider(0, 1.5  , 0.6, 0.1);
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
        boid.flockBehaviour();
        boid.edges();
        boid.update();
        boid.show();  
    }

    //----background
    let shadowdepth = 80;
    let r = 150;
    // big triangle shadows
    push();
    translate(1050-shadowdepth, 120+shadowdepth);
    beginShape();
    rotate(-2.2);
    noStroke();
    fill(0,30);
    vertex(0, -r * 2);
    vertex(-r*1.25, r );
    vertex(0, r/2 );
    vertex(r*1.25, r );
    endShape(CLOSE);
    pop();

    push();
    translate(1450-shadowdepth, 280+shadowdepth);
    beginShape();
    rotate(-1.9);
    noStroke();
    fill(0,30);
    vertex(0, -r * 2);
    vertex(-r*1.25, r );
    vertex(0, r/2 );
    vertex(r*1.25, r );
    endShape(CLOSE);
    pop();

    // big triangles
    push();
    translate(1050, 120);
    beginShape();
    rotate(-2.2);
    noStroke();
    fill(175,51,51,150);
    vertex(0, -r * 2);
    vertex(-r*1.25, r );
    vertex(0, r/2 );
    vertex(r*1.25, r );
    endShape(CLOSE);
    pop();
    
    //
    push();
    translate(1450, 280);
    beginShape();
    rotate(-1.9);
    noStroke();
    fill(175,51,51,150);
    vertex(0, -r * 2);
    vertex(-r*1.25, r );
    vertex(0, r/2 );
    vertex(r*1.25, r );
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
    text("speed", maxSpeedSlider.x  -75 , maxSpeedSlider.y + 7);
    text("alignment", alignmentSlider.x  -75 , alignmentSlider.y + 7);
    text("cohesion", alignmentSlider.x  -75, cohesionSlider.y + 7);
    text("separation", alignmentSlider.x  -75 , separationSlider.y + 7);
    text("edges", edgesCheckbox.x  -75, edgesCheckbox.y + 7);
    //text("Craig Reynold's Boids, Daniel shiffman's nature of code", alignmentSlider.x  -103, windowHeight-140);
    textFont("Helvetica");
    textSize(54);
    //text("Title", alignmentSlider.x  -160 , windowHeight - 165);
}

function getRandomVal (randomSeed, min, max) {
    return min + (randomSeed * (max-min));
}

function mousePressed(){
    mouseIsPressed = true;
    if (!(mouseX < maxSpeedSlider.x + 160 && mouseY > maxSpeedSlider.y - 5)) {
        flock.push(new Boid(mouseX, mouseY));
    }
    
}
  
function mouseReleased() {
    mouseIsPressed = false;
}

// to do:
// obstacles
// boids with different parameters
// angualar view of boid. boid wants to keep view empty.
// submit link to coding challenge
// traces, view radius option
// mouse interaction, vgl http://1000triangle.com/ https://anuraghazra.dev/parasites/
// in normale Website integrieren