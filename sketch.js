var targets = [];
var population;

function setup() {
    //noLoop();
    frameRate(20);

    createCanvas(600, 600);
    
    population = new Population(100);
}

function draw() {
    background(85, 98, 112);
    if (targets.length == 0) {
        return;
    }

    population.next();

    fill(22, 147, 165);
    noStroke();
    // strokeWeight(2);
    for (var i = 0; i < targets.length; i++) {
        p = targets[i];
        ellipse(p.x, p.y, 10);
    }
}

function mouseClicked() {
    target = createVector(mouseX, mouseY);
    targets.push(target);
    population.newTarget(target);

    //redraw();
}

