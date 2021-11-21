
let agents = [];
let agentsAmountInit = 15; 
let agentsAmount = agentsAmountInit; 
let zoom = 1;
let zoomSensitivity = 1/120*1/10; //standard value for one mouseWheel change is 120
let zoomMin = 0.2;
let zoomMax = 1.7;
let button, agentsAmountInput, agentsAmountInputText;

function setup () {

    createCanvas(windowWidth-25,windowHeight-25);

    initSpawn()

    button = createButton('Reinitialise');
    button.position(10, 20);
    button.mouseReleased(reinitialise);

    agentsAmountInput = createInput();
    agentsAmountInput.position( 100, 20);
    agentsAmountInput.value(agentsAmountInit);

    // agentsMountInputText = createElement('number of agents');
    // agentsMountInputText.position(10, 60);


}

function initSpawn() {
    for (let i = 0; i < agentsAmount; i++){
        agents.push(new Agent(random(width), random(height)));
    }
}

function draw () {
    background(51);
    translate(width/12, height/12); // why am I doing this?
    scale(zoom);

    for (let agent of agents) {
        agent.move();
        agent.update();
        agent.show();
    }
}

function getRandomVal (randomSeed, min, max) {
    return min + (randomSeed * (max-min));
}

function mousePressed(){
    if (mouseButton === LEFT) {
        mouseIsPressed = true;
    }
}


function mouseReleased() {
    if (mouseButton === LEFT) {
        mouseIsPressed = false;    
    }
}
function mouseWheel(event) {
    zoom += zoomSensitivity * -event.delta;
    zoom = constrain(zoom, zoomMin, zoomMax);
    //console.log(zoom);
  }

document.addEventListener('keydown', function (event) {
    if (event.key === 'f') {
        agentsAmount = agentsAmount + 1; 
        agents.push(new Agent(mouseX, mouseY));
    }
  });

  function setLineDash(list) {
    drawingContext.setLineDash(list);
  }

function reinitialise() {
    agents = [];
    agentsAmount = agentsAmountInput.value();
    initSpawn()
}