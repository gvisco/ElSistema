var targets = [];
var population;

var evolve = false;

var controlsWidth = 350;
var controlsHeight = 110;
var controlsMargin = 5;

function setup() {
    initRendering();

    population = new Population();
    // population.selectWinners();

    //noLoop();
    frameRate(20);

    evolveCheckbox = new Checkbox("Evolve", evolve);
    evolveCheckbox.position(20, height - 100);
    evolveCheckbox.changed(onToggleEvolution);

    distanceSlider = new Slider(0.01, 1.0, population.fitTreeDistance, 0.01, "Minimize Distance");
    distanceSlider.position(20, height - 80);
    distanceSlider.input(onDistanceSliderMoved);

    sizeSlider = new Slider(0.01, 1.0, population.fitTreeSize, 0.01, "Minimize Tree Size");
    sizeSlider.position(20, height - 60);
    sizeSlider.input(onSizeSliderMoved);

    sentenceSlider = new Slider(0.01, 1.0, population.fitTreeSize, 0.01, "Minimize Sentence Length");
    sentenceSlider.position(20, height - 40);
    sentenceSlider.input(onSentenceSliderMoved);

    
}

function draw() {
    drawBackground();
    drawTreeRoot();

    if (evolve) {
        population.selectWinners();
    }

    if (population.size > 0) {
        drawTree(population.bestTree);
        drawPopulationInfo(population);
    }

    if (evolve) {
        population.nextGeneration();
    }

    if (targets.length > 0) {
        drawTargetPoints(targets);
    }

    drawControlsBG();
    evolveCheckbox.draw();
    distanceSlider.draw();
    sizeSlider.draw();
    sentenceSlider.draw();
}

function mouseClicked() {
    if (mouseX > controlsMargin && mouseX < controlsMargin + controlsWidth && 
        mouseY > height - controlsMargin - controlsHeight && mouseY < height - controlsMargin) {
        return true;
    } else {
        target = p5.Vector.sub(createVector(mouseX, mouseY), viewOffset);
        targets.push(target);
        population.newTarget(target);

        return false;
    }
}

function drawControlsBG() {
    push();
    fill(255, 255, 255, 50);
    noStroke();
    rect(controlsMargin, height - controlsMargin - controlsHeight, controlsWidth, controlsHeight);
    pop();
}

function onToggleEvolution() {
    evolve = !evolve;
    if (evolve && population.DNAs.length == 0) {
        population.initRandomPopulation(100);
    }
    return false;
}

function onDistanceSliderMoved() {
    population.fitTreeDistance = distanceSlider.value();
    return false;
}

function onSizeSliderMoved() {
    population.fitTreeSize = sizeSlider.value();
    return false;
}

function onSentenceSliderMoved() {
    population.fitTreeSentenceLen = sentenceSlider.value();
    return false;
}

//------------ Slider

function Slider(_min, _max, _value, _step, _text) {
    this.delegate = createSlider(_min, _max, _value, _step);
    this.text = _text;

    this.x = 0;
    this.y = 0;
}

Slider.prototype.position = function(_x, _y) {
    this.delegate.position(_x, _y);

    this.x = _x;
    this.y = _y;
}

Slider.prototype.input = function(f) {
    return this.delegate.input(f);
}

Slider.prototype.value = function() {
    return this.delegate.value();
}

Slider.prototype.draw = function() {
    push();
    strokeWeight(0);
    fill(255, 255, 255);
    textSize(15);
    text(this.text, this.x + 135, this.y + 15);
    pop();
}

//---------- Checkbox

function Checkbox(_label, _enabled) {
    this.label = _label;
    this.delegate = createCheckbox('', _enabled);

    this.x = 0;
    this.y = 0;
}

Checkbox.prototype.changed = function(f) {
    print('set function');
    return this.delegate.changed(f);
}

Checkbox.prototype.position = function(_x, _y) {
    this.delegate.position(_x, _y);

    this.x = _x;
    this.y = _y;
}

Checkbox.prototype.checked = function() {
    return this.delegate.checked();
}

Checkbox.prototype.draw = function() {
    push();
    strokeWeight(0);
    fill(255, 255, 255);
    textSize(15);
    text(this.label, this.x + 20, this.y + 15);
    pop();
}