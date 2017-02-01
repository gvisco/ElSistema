var maxlen = 30;
var maxit = 5;
var maxstep = 20;
var mutationRate = 0.005;

function DNA(r1, r2, iterations, step) {
    this.alphabet = ["F","+","-","[","]","1","2"];

    this.r1 = r1 ? r1 : new Rule("1", randomSentence(this.alphabet, floor(random(maxlen))));    
    this.r2 = r2 ? r2 : new Rule("2", randomSentence(this.alphabet, floor(random(maxlen))));    
    this.iterations = iterations ? iterations : floor(random(maxit - 1)) + 1;
    this.step = step ? step : floor(random(maxstep - 1)) + 1;


    this.combine = function(dna) {
        newIterations = (random() > 0.5) ? this.iterations : dna.iterations;
        newStep = random() > 0.5 ? this.step : dna.step;
        newR1 = random() > 0.5 ? this.r1 : dna.r1;
        newR2 = random() > 0.5 ? this.r2 : dna.r2;

        return new DNA(newR1, newR2, newIterations, newStep);
    };


    this.clone = function() {
        return new DNA(this.r1.clone(), this.r2.clone(), this.iterations, this.step);
    };

    this.mutate = function() {
        // increase/decrease iterations
        if (random() < mutationRate) {
            if (random() > 0.5 && this.iterations < maxit) {
                print("increase iterations");
                this.iterations++;
            } else if (this.iterations > 1) {
                print("decrease iterations");
                this.maxit--;
            }
        }

        // new step size
        if (random() < mutationRate) {
            print("change step");
            this.step = floor(random(maxstep - 1)) + 1;         
        }

        // add new char in r1
        if (random() < mutationRate) {
            print("new char in r1");
            c = random(this.alphabet);
            i = floor(random(this.r1.to.length));
            this.r1.to = this.r1.to.substr(0, i) + c + this.r1.to.substr(i, this.r1.to.length);           
        }

        // add new char in r2
        if (random() < mutationRate) {
            print("new char in r2");
            c = random(this.alphabet);
            i = floor(random(this.r2.to.length));
            this.r2.to = this.r2.to.substr(0, i) + c + this.r2.to.substr(i, this.r2.to.length);           
        }

        // remove char from r1
        if (random() < mutationRate) {
            print("remove char r1");
            i = floor(random(this.r1.to.length));
            this.r1.to = this.r1.to.substr(0, i) + this.r1.to.substr(i + 1, this.r1.to.length);           
        }

        // remove char from r2
        if (random() < mutationRate) {
            print("remove char r2");
            i = floor(random(this.r2.to.length));
            this.r2.to = this.r2.to.substr(0, i) + this.r2.to.substr(i + 1, this.r2.to.length);           
        }

        // replace a char in r1  
        if (random() < mutationRate) {
            print("replace char r1");
            i = floor(random(this.r1.to.length));
            c = random(this.alphabet);
            this.r1.to = this.r1.to.substr(0, i) + c + this.r1.to.substr(i + 1, this.r1.to.length);
        } 

        // replace a char in r2  
        if (random() < mutationRate) {
            print("replace char r2");
            i = floor(random(this.r2.to.length));
            c = random(this.alphabet);
            this.r2.to = this.r2.to.substr(0, i) + c + this.r2.to.substr(i + 1, this.r2.to.length);
        }      
    };
}

function Population(size) {
    this.size = size;
    this.population = [];
    this.DNAs = [];

    this.targets = [];
    this.performance = [];
    this.fitnessHistory = [];

    this.historyPlot = new Plot(0, 450, 600, 150);

    this.numP = createP("None");
    this.generationP = createP("None");
    this.fitnessP = createP("None");
    this.r1P = createP("None");
    this.r2P = createP("None");
    this.iterationsP = createP("None");
    this.sentenceP = createP("None");

    this.generation = 1;
    this.currentIndex = 0;


    // init random population
    for (var i = 0; i < this.size; i++) {
        dna = new DNA();
        this.DNAs.push(dna);
    }

    
    this.initPopulationFromDna = function() {
        this.population = []
        for (var i = 0; i < this.DNAs.length; i ++) {
            dna = this.DNAs[i];
            lsystem = new LSystem("1", [dna.r1, dna.r2]);
            tree = new Tree(lsystem, dna.iterations, dna.step);
            this.population.push(tree);
        }
    };
    this.initPopulationFromDna();


    this.next = function() {
        if (this.currentIndex == this.population.length) {
            this.nextGeneration();
        } 

        dna = this.DNAs[this.currentIndex];
        tree = this.population[this.currentIndex];
        tree.draw();

        fit = this.fitness();
        this.performance[this.currentIndex] = fit;

        if (this.fitnessHistory.length > 50) {
            this.fitnessHistory = this.fitnessHistory.slice(1);
        }
        if (this.currentIndex == 0) {
            this.historyPlot.draw(this.fitnessHistory);
        }

        this.generationP.html("Generation: " + this.generation);
        this.numP.html((this.currentIndex + 1) + " of " + this.population.length);
        this.fitnessP.html("Fitness: " + fit);
        this.r1P.html("1: " + dna.r1.to);
        this.r2P.html("2: " + dna.r2.to);
        this.iterationsP.html("Iterations: " + dna.iterations);
        this.sentenceP.html(tree.sentence);

        this.currentIndex++;
        
    };


    this.nextGeneration = function() {
        var maxFit = max(this.performance);
        var minFit = min(this.performance);
//        this.fitnessHistory.push([maxFit, minFit]);
        this.fitnessHistory.push(maxFit);
        //print(maxFit + " " + minFit);
        normalizedPerformance = this.performance.map(function(x) {
            return (minFit == maxFit) ? 1 : (x - minFit) / (maxFit - minFit);
        });
        newDNAs = [];
        for (var i = 0; i < this.size; i++) {
            //print(normalizedPerformance);
            dna1 = this.DNAs[this.selectByPerformance(normalizedPerformance)];
            //dna2 = this.DNAs[this.selectByPerformance(normalizedPerformance)];
            newDna = dna1.clone(); //.combine(dna2);
            newDna.mutate();
            newDNAs.push(newDna);
        }
        this.DNAs = newDNAs;
        this.initPopulationFromDna();

        this.generation++;
        this.currentIndex = 0;
    };


    this.selectByPerformance = function(performances) {
        counter = 0;
        while (true) {
            idx = floor(random(performances.length));
            if (performances[idx] >= random()){
                return idx;
            }

            counter++;
            if (counter > 1000000) {
                print("BUM!");
                return;
            }
        }
    };


    this.newTarget = function(t) {
        this.targets.push(t);
    };

    
    this.fitness = function() {
        tree = this.population[this.currentIndex];
        
        treeSize = tree.size();
        if (treeSize == 0) {
            return 0;
        }

        sumDistances = this.targets.length == 0 ? 2 * (width + height) : 0;
        for (var i = 0; i < this.targets.length; i++) {
            t = this.targets[i];
            minDistance = Number.MAX_SAFE_INTEGER;
            closestPoint = createVector(0, 0);
            for (var j = 0; j < tree.points.length; j++) {
                d = tree.points[j].dist(t);
                if (d < minDistance) {
                    minDistance = d;
                    closestPoint = tree.points[j];
                }
            }
            sumDistances += minDistance;

            stroke(255, 100, 100);
            strokeWeight(1);
            line(closestPoint.x, closestPoint.y, t.x, t.y);
        }

        treeLen = tree.sentence.length;

        //print(this.currentIndex + ": d:" + sumDistances + " s:" + treeSize + " l:" + treeLen);
        //return 1 / sumDistances;
        return 1 / (sumDistances + 0.1 * treeSize + 0.1 * treeLen);
    };
}

function randomSentence(alphabet, len) {
    result = '';
    for (var i = 0; i < len; i ++) {
        result += random(alphabet);        
    }
    return result;
}