//"use strict" // this code works the modern way. must be in first line
const flock = [];

function setup () {
    createCanvas(1240,660);
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

setup()
draw()

alert("hey");