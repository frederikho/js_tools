//"use strict" // this code works the modern way. must be in first line
const flock = [];

function setup () {
    createCanvas(window.innerWidth,window.innerHeight);
    for (let i = 0; i < 20; i++){
        flock.push(new Boid());
    }
}



function draw () {
    background(51);
    flock.push(new Boid());

    for (let boid of flock) {
        boid.update();
        boid.show();
    }

}

function getRandomVal (randomSeed, min, max) {
    return min + (randomSeed * (max-min));
}

setup()
draw()

alert("hey");