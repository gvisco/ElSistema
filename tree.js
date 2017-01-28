function Tree(lsystem, iterations, step) {
    this.iterations = iterations;
    for (var i = 0; i < this.iterations; i++) {
        lsystem.next();
    }
    this.sentence = lsystem.sentence;

    this.step = step;
    this.angle = radians(25);
    
    this.points = [];

    this.draw = function() {
        stroke(255, 200);
        strokeWeight(2);

        this.points = [];
        var currentStack = []
        var currentPosition = createVector(width / 2, height / 2);
        var currentOrientation = createVector(0, -1);
        for (var j = 0; j < this.sentence.length; j++) {
            var currentChar = this.sentence.charAt(j);
            if (currentChar == "F") {
                newPosition = p5.Vector.add(currentPosition, p5.Vector.mult(currentOrientation, this.step));
                line(currentPosition.x, currentPosition.y, newPosition.x, newPosition.y);
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
    };

    this.size = function() {
        //return (this.sentence.match(new RegExp("F", "g")) || []).length;
        return this.points.length;
    };
}