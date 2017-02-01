var targets = [];
var population;

function setup() {
    //noLoop();
    frameRate(50);

    createCanvas(600, 600);
    
    population = new Population(100);
}

function draw() {
    background(51, 51, 51);
    if (targets.length == 0) {
        return;
    }

    population.next();

    stroke(255);
    strokeWeight(2);
    for (var i = 0; i < targets.length; i++) {
        p = targets[i];
        ellipse(p.x, p.y, 5);
    }
}

function mouseClicked() {
    target = createVector(mouseX, mouseY);
    targets.push(target);
    population.newTarget(target);

    //redraw();
}

