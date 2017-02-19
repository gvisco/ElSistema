function Plot() {
    this.div = createDiv("").elt;
    this.div.style = "width:600px;height:250px;";

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
            p = points[i];
            this.data.push({
                x: i, 
                y: p
            });
        }
        this.chart.render();
    };
}