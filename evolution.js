var maxlen = 30;
var maxit = 5;
var maxstep = 100;
var mutationRate = 0.01;

function DNA(r1, r2, iterations, step, angle) {
    this.alphabet = ["F","+","-","[","]","1","2"];

    this.r1 = r1 ? r1 : new Rule("1", randomSentence(this.alphabet, floor(random(maxlen))));    
    this.r2 = r2 ? r2 : new Rule("2", randomSentence(this.alphabet, floor(random(maxlen))));    
    this.iterations = iterations ? iterations : floor(random(maxit - 1)) + 1;
    this.step = step ? step : floor(random(maxstep - 1)) + 1;
    this.angle = angle ? angle : floor(random(45)) + 1;


    this.combine = function(dna) {
        newIterations = (random() > 0.5) ? this.iterations : dna.iterations;
        newStep = random() > 0.5 ? this.step : dna.step;
        newR1 = random() > 0.5 ? this.r1 : dna.r1;
        newR2 = random() > 0.5 ? this.r2 : dna.r2;
        newAngle = random() > 0.5 ? this.angle : dna.angle;

        return new DNA(newR1, newR2, newIterations, newStep);
    };


    this.clone = function() {
        return new DNA(this.r1.clone(), this.r2.clone(), this.iterations, this.step, this.angle);
    };

    this.mutate = function() {
        // increase/decrease iterations
        if (random() < mutationRate) {
            if (random() > 0.5 && this.iterations < maxit) {
                // print("increase iterations");
                this.iterations++;
            } else if (this.iterations > 1) {
                // print("decrease iterations");
                this.maxit--;
            }
        }

        if (random() < mutationRate) {
            this.step = floor(random(maxstep - 1)) + 1;         
        }

        if (random() < mutationRate) {
            this.angle = floor(random(45)) + 1;
        }   

        if (random() < mutationRate) {
            var c = random(this.alphabet);
            var i = floor(random(this.r1.to.length));
            this.r1.to = this.r1.to.substr(0, i) + c + this.r1.to.substr(i, this.r1.to.length);           
        }

        if (random() < mutationRate) {
            var c = random(this.alphabet);
            var i = floor(random(this.r2.to.length));
            this.r2.to = this.r2.to.substr(0, i) + c + this.r2.to.substr(i, this.r2.to.length);           
        }

        if (random() < mutationRate) {
            var i = floor(random(this.r1.to.length));
            this.r1.to = this.r1.to.substr(0, i) + this.r1.to.substr(i + 1, this.r1.to.length);           
        }

        if (random() < mutationRate) {
            var i = floor(random(this.r2.to.length));
            this.r2.to = this.r2.to.substr(0, i) + this.r2.to.substr(i + 1, this.r2.to.length);           
        }

        if (random() < mutationRate) {
            var i = floor(random(this.r1.to.length));
            var c = random(this.alphabet);
            this.r1.to = this.r1.to.substr(0, i) + c + this.r1.to.substr(i + 1, this.r1.to.length);
        } 

        if (random() < mutationRate) {
            var i = floor(random(this.r2.to.length));
            var c = random(this.alphabet);
            this.r2.to = this.r2.to.substr(0, i) + c + this.r2.to.substr(i + 1, this.r2.to.length);
        }         
    };
}

function Population(size) {
    this.size = size;
    this.population = [];
    this.DNAs = [];

    this.bestTree;
    this.bestDna;

    this.targets = [];
    this.performance = [];
    this.fitnessHistory = [];

    this.generation = 1;
    this.currentIndex = 0;


    // init random population
    for (var i = 0; i < this.size; i++) {
        var dna = new DNA();
        this.DNAs.push(dna);
    }

    
    this.initPopulationFromDna = function() {
        this.population = []
        for (var i = 0; i < this.DNAs.length; i ++) {
            var dna = this.DNAs[i];
            var lsystem = new LSystem("1", [dna.r1, dna.r2]);
            var tree = new Tree(lsystem, dna.iterations, dna.step, dna.angle);
            this.population.push(tree);
        }
    };
    this.initPopulationFromDna();


    this.fitTree = function(tree) {
        var result = 0;
        var treeSize = tree.size();
        if (treeSize > 0) {
            var sumDistances = this.targets.length == 0 ? 2 * (width + height) : 0;
            for (var i = 0; i < this.targets.length; i++) {
                var t = this.targets[i];
                var minDistance = Number.MAX_SAFE_INTEGER;
                var closestPoint = createVector(0, 0);
                for (var j = 0; j < tree.points.length; j++) {
                    d = tree.points[j].dist(t);
                    if (d < minDistance) {
                        minDistance = d;
                        closestPoint = tree.points[j];
                    }
                }
                sumDistances += minDistance;
            }
            var treeLen = tree.sentence.length;

            result = 1 / (sumDistances + 0.1 * treeSize + 0.1 * treeLen);
        }
        return result;
    };


    this.next = function() {
        // update
        var topFitness = 0;
        var topFitnessIdx = 0;
        for (var i = 0; i < this.population.length; i++) {
            var tree = this.population[i];
            
            tree.update();
            
            var fit = this.fitTree(tree);
            this.performance[i] = fit;

            if (fit > topFitness) {
                topFitness = fit;
                topFitnessIdx = i;
            }
        }

        this.fitnessHistory.push(topFitness);

        this.bestTree = this.population[topFitnessIdx];
        this.bestDna = this.DNAs[topFitnessIdx];
    };


    this.nextGeneration = function() {
        var maxFit = max(this.performance);
        var minFit = min(this.performance);
        //print(maxFit + " " + minFit);
        var normalizedPerformance = this.performance.map(function(x) {
            return (minFit == maxFit) ? 1 : (x - minFit) / (maxFit - minFit);
        });

        var newDNAs = [];
        var geneticSelection = floor(this.size * 0.50);
        for (var i = 0; i < geneticSelection; i++) {
            var dna = this.DNAs[this.selectByPerformance(normalizedPerformance)];
            var newDna = dna.clone(); //.combine(dna2);
            newDna.mutate();
            newDNAs.push(newDna);
        }
        for (var i = 0; i < this.size - geneticSelection; i++) {
            var randomDna = new DNA();
            newDNAs.push(randomDna);
        }

        this.DNAs = newDNAs;
        this.initPopulationFromDna();

        this.generation++;
        this.currentIndex = 0;
    };


    this.selectByPerformance = function(performances) {
        var counter = 0;
        while (true) {
            var idx = floor(random(performances.length));
            if (performances[idx] >= random()){
                return idx;
            }

            counter++;
            if (counter > 1000000) {
                print("BOOOM!");
                return;
            }
        }
    };


    this.newTarget = function(t) {
        this.targets.push(t);
    };
}

function randomSentence(alphabet, len) {
    var result = '';
    for (var i = 0; i < len; i ++) {
        result += random(alphabet);        
    }
    return result;
}