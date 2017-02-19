function Tree(lsystem, iterations, step) {
    this.iterations = iterations;
    for (var i = 0; i < this.iterations; i++) {
        lsystem.next();
    }
    this.sentence = lsystem.sentence;

    this.step = step;
    this.angle = radians(25);
    
    this.points = [];
    this.lines = [];

    this.update = function() {
        this.points = [];
        this.lines = [];
        var currentStack = []
        var currentPosition = createVector(width / 2, height / 2);
        var currentOrientation = createVector(0, -1);
        for (var j = 0; j < this.sentence.length; j++) {
            var currentChar = this.sentence.charAt(j);
            if (currentChar == "F") {
                newPosition = p5.Vector.add(currentPosition, p5.Vector.mult(currentOrientation, this.step));
                //line(currentPosition.x, currentPosition.y, newPosition.x, newPosition.y);
                this.lines.push([createVector(currentPosition.x, currentPosition.y), createVector(newPosition.x, newPosition.y)]);
                currentPosition = newPosition;
                this.points.push(currentPosition);
            } else if (currentChar == "+") {
                currentOrientation.rotate(this.angle);
            } else if (currentChar == "-") {
                currentOrientation.rotate(-this.angle);
            } else if (currentChar == "[") {
                currentStack.push([currentPosition.copy(), currentOrientation.copy()]);
            } else if (currentChar == "]") {
                prev = currentStack.pop();
                if (prev) {
                    currentPosition = prev[0];
                    currentOrientation = prev[1];
                }
            } 
        }
    }

    this.draw = function() {
        stroke(251, 184, 41);
        strokeWeight(3);

        for (var i = 0; i < this.lines.length; i++) {
            p1 = this.lines[i][0];
            p2 = this.lines[i][1];
            line(p1.x, p1.y, p2.x, p2.y);
        }
    };

    this.size = function() {
        //return (this.sentence.match(new RegExp("F", "g")) || []).length;
        return this.points.length;
    };
}