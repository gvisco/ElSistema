
var viewOffset;

function initRendering() {
    createCanvas(600, 600);
    viewOffset = createVector(width / 2.0 , height * 3 / 4.0);

    historyPlot = new Plot();

    generationP = createP("None");
    fitnessP = createP("None");
    r1P = createP("None");
    r2P = createP("None");
    iterationsP = createP("None");
    sentenceP = createP("None");
}

function drawTree(tree) {
    push();
    stroke(251, 184, 41);
    strokeWeight(3);

    for (var i = 0; i < tree.lines.length; i++) {
        var p1 = p5.Vector.add(tree.lines[i][0], viewOffset);
        var p2 = p5.Vector.add(tree.lines[i][1], viewOffset);
        line(p1.x, p1.y, p2.x, p2.y);
    }
    ellipse(viewOffset.x, viewOffset.y, 10);
    pop();
}

function drawTreeRoot() {
    push();
    stroke(251, 184, 41);
    strokeWeight(3);
    ellipse(viewOffset.x, viewOffset.y, 10);
    pop();
}


function drawPopulationInfo(population) {   
    push();
    var history = population.fitnessHistory; 
    if (history.length > 150) {
        history = history.slice(history.length - 150);
    }

    historyPlot.draw(history);

    generationP.html("Generation: " + population.generation);
    fitnessP.html("Fitness: " + history[history.length - 1]);

    var dna = population.bestDna; 
    r1P.html("1: " + dna.r1.to);
    r2P.html("2: " + dna.r2.to);
    iterationsP.html("Iterations: " + dna.iterations);
    
    sentenceP.html(population.bestTree.sentence);
    pop();
}

function drawTargetPoints(targets) {
    push();
    fill(22, 147, 165);
    noStroke();
    // strokeWeight(2);
    for (var i = 0; i < targets.length; i++) {
        var p = p5.Vector.add(targets[i], viewOffset);
        ellipse(p.x, p.y, 10);
    }
    pop();
}

function drawBackground() {
    background(85, 98, 112);
}