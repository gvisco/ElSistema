function initRendering() {
    createCanvas(600, 600);

    historyPlot = new Plot();

    generationP = createP("None");
    fitnessP = createP("None");
    r1P = createP("None");
    r2P = createP("None");
    iterationsP = createP("None");
    sentenceP = createP("None");
}

function drawTree(tree) {
    stroke(251, 184, 41);
    strokeWeight(3);

    for (var i = 0; i < tree.lines.length; i++) {
        var p1 = tree.lines[i][0];
        var p2 = tree.lines[i][1];
        line(p1.x, p1.y, p2.x, p2.y);
    }
}

function drawPopulationInfo(population) {   
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
}

function drawTargetPoints(targets) {
    fill(22, 147, 165);
    noStroke();
    // strokeWeight(2);
    for (var i = 0; i < targets.length; i++) {
        var p = targets[i];
        ellipse(p.x, p.y, 10);
    }
}

function drawBackground() {
    background(85, 98, 112);
}