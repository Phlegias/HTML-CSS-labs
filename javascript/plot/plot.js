import {weapons} from "./data.js";

const marginX = 50;
const marginY = 50;
const height = 500;
const width = 800;

let svg = d3.select("svg")
.attr("height", height)
.attr("width", width);


document.addEventListener("DOMContentLoaded", function() {
    d3.select("#draw").on("click", () => {
        d3.select("#ox-value").style("color", "black");
        d3.select("#oy-value").style("color", "black");
        d3.select("#plot-type").style("color", "black");
        drawGraph();
    });  
});

function dataPlot() {
    let dictPlot = {};
    dictPlot["oy"] = [];
    d3.select("#plot").selectAll("input").each(function() {
        let item = d3.select(this);
        if (item.attr("type") == "radio" && item.property("checked")) {
            if (item.attr("id").indexOf("type") != -1) dictPlot["type"] = item.attr("value");
            else dictPlot["ox"] = item.attr("value");
        }
        if (item.attr("type") == "checkbox" && item.property("checked")) {
            let ss = item.attr("value").split('-');
            if (!dictPlot["oy"][ss[0]]) {
                dictPlot["oy"][ss[0]] = {
                    "мин": false,
                    "макс": false
                };
            }
            dictPlot["oy"][ss[0]][ss[1]] = true;
        }
    });
    return dictPlot;
}

function createArrGraph(data, key, values) {
    let groupObj = d3.group(data, d => d[key]);
    let arrGraph =[];
    for(let entry of groupObj) {
        let minMax = {};
        if (entry.indexOf(undefined) == -1) {
            for (let value in values) {
                let numbers = [];
                if (values[value]["мин"]) numbers.push(d3.min(entry[1].map(d => d[value])));
                if (values[value]["макс"]) numbers.push(d3.max(entry[1].map(d => d[value])));
                minMax[value] = d3.extent(numbers);
            }
            arrGraph.push({labelX : entry[0], values : minMax});
        }
    }
    return arrGraph;
}

function createAxis(data){
    let minArr = [];
    let maxArr = [];
    data.map(d => {
        for (let key in d.values) {
            minArr.push(d.values[key][0]);
            maxArr.push(d.values[key][1]);
        }
    });
    
    let min = d3.min(minArr);
    let max = d3.max(maxArr);
    
    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, width - 2 * marginX]);

    let scaleY = d3.scaleLinear()
        .domain([min * 0.85, max * 1.1 ])
        .range([height - 2 * marginY, 0]);

    let axisX = d3.axisBottom(scaleX);
    let axisY = d3.axisLeft(scaleY);
    
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${height - marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .call(axisY);

    return [scaleX, scaleY]
}

function createChart(data, scaleX, scaleY, key, index, color, type) {
    let result = [];
    if (type == "Точки") {
        data.forEach(item => {
            result.push({
                r: 4,
                x: scaleX(item.labelX) + scaleX.bandwidth() / 2,
                y: Math.round(scaleY(item.values[key][index])),
                color: color
            });
        });
    }
    else {
        data.forEach(item => {
            result.push({
                x: scaleX(item.labelX) + scaleX.bandwidth() / 2 - 5,
                y: Math.round(scaleY(item.values[key][index])),
                w: 10,
                h: height - scaleY(item.values[key][index]) - 100,
                color: color
            });
        });
    }
    return result;
}

function adjustColumnValues(matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    for (let col = 0; col < numCols; col++) {
        const values = new Map();

        for (let row = 0; row < numRows; row++) {
            const y = matrix[row][col].y;
            if (!values.has(y)) {
                values.set(y, []);
            }
            values.get(y).push(row);
        }

        for (let [key, rows] of values.entries()) {
            if (rows.length > 1) {
                let adjustment = -Math.floor(rows.length / 2) * 4;
                for (let i = 0; i < rows.length; i++) {
                    matrix[rows[i]][col].y = key + adjustment;
                    adjustment += 4;
                }
            }
        }
    }
}

function sortColumnsByYAscending(matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    for (let col = 0; col < numCols; col++) {
        let column = [];
        for (let row = 0; row < numRows; row++) {
            column.push(matrix[row][col]);
        }
        column.sort((a, b) => a.y - b.y);
        for (let row = 0; row < numRows; row++) {
            matrix[row][col] = column[row];
        }
    }
}

function drawCharts(charts, type) {
    adjustColumnValues(charts);
    sortColumnsByYAscending(charts);
    if (type == "Точки") {
        charts.forEach(chart => {
            svg.selectAll(".dot")
                .data(chart)
                .enter()
                .append("circle")
                .attr("r", d => d.r)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("transform", `translate(${marginX}, ${marginY})`)
                .style("fill", d => d.color);
        });
    }
    else {
        let i = -25;
        charts.forEach(chart => {
        i = i + 15;
        svg.selectAll(".rect")
            .data(chart)
            .enter()
            .append("rect")
            .attr("x", d => (d.x + i))
            .attr("y", d => d.y + 3)
            .attr("width", d => d.w)
            .attr("height", d => d.h)
            .attr("transform", `translate(${marginX}, ${marginY})`)
            .style("fill", d => d.color);
        });
    }
}

function drawGraph() {
    svg.selectAll('*').remove();
    let dataplot = dataPlot();
    if (!dataplot["ox"]) {
        d3.select("#ox-value").style("color", "red");
        return;
    }
    if (Object.keys(dataplot["oy"]).length === 0) {
        d3.select("#oy-value").style("color", "red");
        return;
    }
    if (!dataplot["type"]) {
        d3.select("#plot-type").style("color", "red");
        return;
    }
    
    let arrGraph = createArrGraph(weapons, dataplot["ox"], dataplot["oy"]);

    const [scX, scY] = createAxis(arrGraph);
    let charts = [];
    let colorQueue = ["blue", "purple", "red", "green"];
    for (let key in dataplot["oy"]) {
        if (dataplot["oy"][key]["мин"]) charts.push(createChart(arrGraph, scX, scY, key, 0, colorQueue.shift(), dataplot["type"]));
        if (dataplot["oy"][key]["макс"]) charts.push(createChart(arrGraph, scX, scY, key, 1, colorQueue.shift(), dataplot["type"]));
    }
    drawCharts(charts, dataplot["type"]);
}