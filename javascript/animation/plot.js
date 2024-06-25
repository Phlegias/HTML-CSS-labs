let width = 700;
let height = 700;

let svg = d3.select("body")
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .style("border", "solid thin grey");

let marginX = 20;
let marginY = 20;

function drawPict() {
    let group = svg.append("g");
    group.append("line")
        .attr("x1", 30)
        .attr("y1", 30)
        .attr("x2", -30)
        .attr("y2", -30)
        .style("stroke", "blue")
        .style("stroke-width", "2");
         
    group.append("line")
        .attr("x1", -30)
        .attr("y1", 30)
        .attr("x2", 30)
        .attr("y2", -30)
        .style("stroke", "green")
        .style("stroke-width", "2");
    
    group.append("line")
        .attr("x1", 30)
        .attr("y1", 0)
        .attr("x2", -30)
        .attr("y2", 0)
        .style("stroke", "red")
        .style("stroke-width", "2");
    
    group.append("line")
        .attr("x1", 0)
        .attr("y1", 30)
        .attr("x2", 0)
        .attr("y2", -30)
        .style("stroke", "purple")
        .style("stroke-width", "2");
    
    group.append("circle")
        .attr("cx", -15)
        .attr("cy", -15)
        .attr("r", 10)
        .style("fill", "lightblue")
        .style("stroke", "blue")
        .style("stroke-width", "2");
    
    group.append("rect")
        .attr("x", 5)
        .attr("y", 5)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "lightblue")
        .style("stroke", "blue")
        .style("stroke-width", "2");
    return group;
}


function createPathNeproid() {
    let data = [];
    let a = 60;
    for (let t = 0 ; t <= 2 * Math.PI; t += 0.1) {
        data.push({
            x: width / 2 - (3 * a * Math.pow(Math.cos(t), 3)),
            y: height / 2 - (3 * a * Math.pow(Math.sin(t), 3))
        });
    }
    return data;
}

let drawPath = () => {
    const dataPoints = createPathNeproid();

    const line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y);

    const path = svg.append('path')
        .attr('d', line(dataPoints))
        .attr('stroke', 'none')
        .attr('fill', 'none');

    return path;
}

function translateAlong(path, scaling, rotation) {
    const length = path.getTotalLength();
    return function() {
        return function(t) {
            const {x, y} = path.getPointAtLength(t * length);
            return `translate(${x},${y}) scale(${1 + (scaling - 1) * t}) rotate(${t * rotation})`;
        }
    }
}

let runAnimation = () => {
    let path = drawPath();
    let pict = drawPict();
    console.log(pict);
    pict.transition()
        .ease(d3.easeLinear)
        .duration(d3.select("#duration").property("value"))
        .attrTween('transform', translateAlong(
            path.node(), 
            d3.select("#scaling").property("value"),
            d3.select("#rotation").property("value")
        ));
}

d3.select("#start").on("click", (event) => runAnimation());
d3.select("#clear").on("click", (event) => svg.selectAll('*').remove());