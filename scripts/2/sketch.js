//"use strict" // this code works the modern way. must be in first line
const flock = [];

let alignSlider, cohesionSlider, separationSlider, perceptionRadiusSlider;

function setup () {
    createCanvas(window.innerWidth,window.innerHeight-65);
    alignSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider = createSlider(0, 3  , 1, 0.1);
    separationSlider = createSlider(0, 3, 1, 0.1);
    perceptionRadiusSlider = createSlider(0.0, 5, 1, 0.1);
    for (let i = 0; i < 100; i++){
        flock.push(new Boid());
    }
}


 
function draw () {
    background(51);
    

    for (let boid of flock) {
        boid.edges();
        boid.flockBehaviour(flock);
        boid.update();
        boid.show();    
    }

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
// mouse interaction, vgl http://1000triangle.com/

