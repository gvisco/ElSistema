function Plot(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.div = createDiv("").elt;
    this.div.style = "width:600px;height:250px;";

    //Plotly.newPlot(this.div, [{x : [], y : []}]);

    this.data = [];
    this.chart = new CanvasJS.Chart(this.div,{
        title :{
            text: "Best Performance"
        },          
        data: [{
            type: "line",
            dataPoints: this.data
        }]
    });

    this.draw = function(points) {
        this.data.length = 0;
        maxVal = max(points);
        minVal = min(points);
        for (var i = 0; i < points.length; i++) {
            p = points[i]; //map(points[i], minVal, maxVal, 0, this.h);
            this.data.push({
                x: i, 
                y: p
            });
        }
        this.chart.render();
    };


    this.drawYYY = function(points) {
        var xPoints = [];
        var yPoints = [];
        for (var i = 0; i < points.length; i++) {
            p = points[i]; //map(points[i], minVal, maxVal, 0, this.h);
            xPoints.push(p.x);
            yPoints.push(p.y);
        }

        trace = {
            x : xPoints,
            y : yPoints, 
            mode: 'lines'
        };
        data = [trace];

        Plotly.animate(this.div, data, {
            transition: {
                duration: 0
            },
            frame: {
                duration: 0,
                redraw: false
            }
        });
    };

    this.drawXXX = function(points) {
        push();
        translate(this.x, this.y + this.h);

        noStroke();
        fill(200);        
        rect(0, 10, this.w, -this.h -20);

        stroke(0);
        strokeWeight(1);
        maxVal = max(points);
        minVal = min(points);
        step = floor(this.w / points.length);
        prevPoint = null;
        for (var i = 0; i < points.length; i++) {
            p = map(points[i], minVal, maxVal, 0, this.h);
            if (prevPoint) {
                line(step * (i - 1), -prevPoint, step * i, -p);
            }
            prevPoint = p;
        }

        pop();
    };
}