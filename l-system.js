function LSystem(axiom, rules) {
    this.sentence = axiom;
    this.rules = rules;

    this.next = function() {
        var nextSentence = "";        
        for (var i = 0; i < this.sentence.length; i++) {
            var candidate = this.sentence[i];
            for (var j = 0; j < rules.length; j++) {
                if (candidate == rules[j].from) {
                    candidate = rules[j].to; 
                    break;
                }
            }
            nextSentence += candidate;
        }
        this.sentence = nextSentence;
    };
}

function Rule(from, to) {
    this.from = from;
    this.to = to;

    this.clone = function() {
        return new Rule(this.from, this.to);
    };
}