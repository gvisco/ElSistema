var targets = [];
var population;

//var tree;

function setup() {
    //noLoop();
    frameRate(50);

    createCanvas(600, 600);
    
    population = new Population(200);

    //r1 = new Rule("X", "]++[-[++[-[]++[-[++[-[]221F--F--F--");
    //r2 = new Rule("Y", "");
    
    //r1 = new Rule("1", "FFF[-F[++F]F]+FF+F");
    //r2 = new Rule("2", "");

    //r1 = new Rule("F", "Ff[f+[-F--f]>F]<[f]");
    
    //r1 = new Rule("F", "F[-F][+F1F-F++F]");
    //r2 = new Rule("1", "F[-F+F]");
    
    //lsystem = new LSystem("1", [r1, r2]);
    //tree = new Tree(lsystem, 4, 100);
}

function draw() {
    background(51, 51, 51);

    population.next();

    //tree.draw();

    stroke(255);
    strokeWeight(2);
    for (var i = 0; i < targets.length; i++) {
        p = targets[i];
        ellipse(p.x, p.y, 5);
    }


    //createP("Size: " + tree.size());
    //createP(tree.sentence);
}

function mouseClicked() {
    target = createVector(mouseX, mouseY);
    targets.push(target);
    population.newTarget(target);

    //redraw();
}

