var maxlen = 30;
var maxit = 5;
var maxstep = 100;
var mutationRate = 0.01;

function DNA(r1, r2, iterations, step, angle) {
    var randomSentence = function(alphabet, len) {
        var result = '';
        for (var i = 0; i < len; i ++) {
            result += random(alphabet);        
        }
        return result;
    };

    this.alphabet = ["F","+","-","[","]","1","2"];
    this.r1 = r1 ? r1 : new Rule("1", randomSentence(this.alphabet, floor(random(maxlen))));    
    this.r2 = r2 ? r2 : new Rule("2", randomSentence(this.alphabet, floor(random(maxlen))));    
    this.iterations = iterations ? iterations : floor(random(maxit)) + 1;
    this.step = step ? step : floor(random(maxstep)) + 1;
    this.angle = angle ? angle : floor(random(45)) + 1;


    this.combine = function(dna) {
        var flipCoin = function() {
            return random() > 0.5;
        }

        newIterations = flipCoin() ? this.iterations : dna.iterations;
        newStep = flipCoin() ? this.step : dna.step;
        newR1 = flipCoin() ? this.r1 : dna.r1;
        newR2 = flipCoin() ? this.r2 : dna.r2;
        newAngle = flipCoin() ? this.angle : dna.angle;

        return new DNA(newR1, newR2, newIterations, newStep);
    };


    this.clone = function() {
        return new DNA(this.r1.clone(), this.r2.clone(), this.iterations, this.step, this.angle);
    };

    this.mutate = function() {

        var wannaMutate = function() {
            return random() < mutationRate
        };

        var intMutation = function(minInt, maxInt) {
            return floor(random(minInt, maxInt));
        };

        var insertCharFromAlphabethMutation = function(str, alphabet) {
            var c = random(alphabet);
            var i = floor(random(str.length));
            return str.substr(0, i) + c + str.substr(i, str.length);
        };

        var removeCharMutation = function(str) {
            var i = floor(random(str.length));
            return str.substr(0, i) + str.substr(i + 1, str.length);
        };

        var replaceCharFromAlphabethMutation = function(str, alphabet) {
            var c = random(alphabet);
            var i = floor(random(str.length));
            return str.substr(0, i) + c + str.substr(i + 1, str.length);
        };

        this.iterations = wannaMutate() ? intMutation(0, maxit) + 1 : this.iterations;
        this.step = wannaMutate() ? intMutation(0, maxstep) + 1 : this.step;
        this.angle = wannaMutate() ? intMutation(45) + 1 : this.angle;
        this.r1.to = wannaMutate() ? insertCharFromAlphabethMutation(this.r1.to, this.alphabet) : this.r1.to;
        this.r2.to = wannaMutate() ? insertCharFromAlphabethMutation(this.r2.to, this.alphabet) : this.r2.to;
        this.r1.to = wannaMutate() ? removeCharMutation(this.r1.to) : this.r1.to;
        this.r2.to = wannaMutate() ? removeCharMutation(this.r2.to) : this.r2.to;
        this.r1.to = wannaMutate() ? replaceCharFromAlphabethMutation(this.r1.to, this.alphabet) : this.r1.to;
        this.r2.to = wannaMutate() ? replaceCharFromAlphabethMutation(this.r2.to, this.alphabet) : this.r2.to;
    };
}

function Population() {
    this.size = 0;
    this.population = [];
    this.DNAs = [];

    this.bestTree;
    this.bestDna;

    this.fitTreeDistance = 0.8;
    this.fitTreeSize = 0.1;
    this.fitTreeSentenceLen = 0.1;

    this.targetPoints = [];
    this.performance = [];
    this.fitnessHistory = [];

    this.generation = 1;
    this.currentIndex = 0;


    // // init random population
    // for (var i = 0; i < this.size; i++) {
    //     var dna = new DNA();
    //     this.DNAs.push(dna);
    // }

    this.newPopulationFromDna = function() {
        this.population = []
        for (var i = 0; i < this.DNAs.length; i ++) {
            var dna = this.DNAs[i];
            var lsystem = new LSystem("1", [dna.r1, dna.r2]);
            var tree = new Tree(lsystem, dna.iterations, dna.step, dna.angle);
            this.population.push(tree);
        }
    };

    this.initRandomPopulation = function(populationSize) {
        for (var i = 0; i < populationSize; i++) {
            var dna = new DNA();
            this.DNAs.push(dna);
        }
        this.size = populationSize;
        this.newPopulationFromDna();
    };

    // this.newPopulationFromDna();


    this.fitTree = function(tree) {
        var result = 0;
        var treeSize = tree.size();
        if (treeSize > 0) {
            var sumDistances = this.targetPoints.length == 0 ? 2 * (width + height) : 0;
            for (var i = 0; i < this.targetPoints.length; i++) {
                var t = this.targetPoints[i];
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

            result = 1 / (sumDistances * this.fitTreeDistance + treeSize * this.fitTreeSize + treeLen * this.fitTreeSentenceLen);
        }
        return result;
    };


    this.selectWinners = function() {
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
        this.newPopulationFromDna();

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
            // avoid looping forever
            counter++;
            if (counter > 1000000) {
                print("BOOOM!");
                return;
            }
        }
    };


    this.newTarget = function(t) {
        this.targetPoints.push(t);
    };
}

