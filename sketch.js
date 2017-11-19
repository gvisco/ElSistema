var targets = [];
var population;

function setup() {
    //noLoop();
    frameRate(20);

    initRendering();
    
    population = new Population(100);
}

function draw() {
    drawBackground();

    if (targets.length == 0) {
        return;
    }

    population.next();

    drawTree(population.bestTree);
    drawTargetPoints(targets);
    drawPopulationInfo(population);

    population.nextGeneration();

}

function mouseClicked() {
    target = createVector(mouseX, mouseY);
    targets.push(target);
    population.newTarget(target);

    //redraw();
}

