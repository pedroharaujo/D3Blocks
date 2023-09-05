// set the dimensions and margins of the graph
const margin = { top: 100, right: 30, bottom: 100, left: 70 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("body div")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add a chart title
svg.append("text")
    .attr("id", "title")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "bold")
    .text("Iris Scatter Plots");

// Add a note indicating how to cycle the chart
svg.append("text")
    .attr("id", "instructions")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("x", 10 + margin.left)
    .attr("y", height + 40)
    .text("click to cycle plot");

const dly = 100; // delay for the animation
const drn = 500; // duration for the animation

// define how the animation behaves
// let easeness = d3.easeBounceOut
// let easeness = d3.easeElasticOut
let easeness = d3.easeCircleIn
// let easeness = d3.easeLinear
let idx = 0;
const yAxisLabels = ["Sepal Length", "Petal Length", "Petal Width", "Petal Length"]
const xAxisLabels = ["Sepal Width", "Petal Width", "Sepal Width", "Sepal Length"]

// map the Species to individual colors
const color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica"])
    .range(["#F8766D", "#00BA38", "#619CFF"])

d3.csv("data/iris.csv").then(function (data) {
    // clean/fix the data
    data.forEach(function (d) {
        d.sepal_width = +Number(d.SepalWidthCm);
        d.sepal_length = +Number(d.SepalLengthCm);
        d.petal_width = +Number(d.PetalWidthCm);
        d.petal_length = +Number(d.PetalLengthCm);
    });
    console.log(data);

    // Get Maximums
    let maxSW = d3.max(data, function (d) { return d.sepal_width; })
    let maxSL = d3.max(data, function (d) { return d.sepal_length; })
    let maxPW = d3.max(data, function (d) { return d.petal_width; })
    let maxPL = d3.max(data, function (d) { return d.petal_length; })

    //Get Minimums
    let minSW = d3.min(data, function (d) { return d.sepal_width; })
    let minSL = d3.min(data, function (d) { return d.sepal_length; })
    let minPW = d3.min(data, function (d) { return d.petal_width; })
    let minPL = d3.min(data, function (d) { return d.petal_length; })

    // Set X and Y axis domains
    const xDomains = [[minSW, maxSW], [minPW, maxPW], [minSW, maxSW], [minSL, maxSL]]
    const yDomains = [[minSL, maxSL], [minPL, maxPL], [minPW, maxPW], [minPL, maxPL]]

    // Add X axis
    const x = d3.scaleLinear()
        .domain([minSW, maxSW]) // input domain - this is the domain of the data
        .range([0, width]); // output range - this is the range on the chart
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add X axis label:
    svg.append("text")
        .attr("id", "xlabel")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40)
        .text("Sepal Width");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([minSL, maxSL]) // input domain - this is the domain of the data
        .range([height, 0]); // output range - this is the range on the chart
    svg.append("g")
        .call(d3.axisLeft(y));

    // Y axis label:
    svg.append("text")
        .attr("id", "ylabel")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 30)
        .attr("x", -margin.top + 40)
        .text("Sepal Length")

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x(d.sepal_width); })
        .attr("cy", function (d) { return y(d.sepal_length); })
        .attr("r", 4.0)
        .style("fill", function (d) { return color(d.Species) }) // color the points by Species

    let update = function () {
        //update and reset the index counter
        idx = idx + 1;
        if (idx == 4) { idx = 0; }

        //Update scale domains
        x.domain(xDomains[idx]);
        y.domain(yDomains[idx]);

        // Update X axis label:
        svg.select("#xlabel")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 40)
            .text(xAxisLabels[idx]);

        // Update Y axis label:
        svg.select("#ylabel")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 30)
            .attr("x", -margin.top + 40)
            .text(yAxisLabels[idx])
        if (idx == 0) {
            svg.selectAll("circle")
                .data(data)
                .transition()
                .delay(dly)
                .duration(drn)
                .ease(easeness)
                .attr("cx", function (d) { return x(d.sepal_width); })
                .attr("cy", function (d) { return y(d.sepal_length); })
                .attr("r", 4.0)
                .style("fill", function (d) { return color(d.Species) })
        }
        if (idx == 1) {
            svg.selectAll("circle")
                .data(data)
                .transition()
                .delay(dly)
                .duration(drn)
                .ease(easeness)
                .attr("cx", function (d) { return x(d.petal_width); })
                .attr("cy", function (d) { return y(d.petal_length); })
                .attr("r", 4.0)
                .style("fill", function (d) { return color(d.Species) })
        }
        if (idx == 2) {
            svg.selectAll("circle")
                .data(data)
                .transition()
                .delay(dly)
                .duration(drn)
                .ease(easeness)
                .attr("cx", function (d) { return x(d.sepal_width); })
                .attr("cy", function (d) { return y(d.petal_width); })
                .attr("r", 4.0)
                .style("fill", function (d) { return color(d.Species) })
        }
        if (idx == 3) {
            svg.selectAll("circle")
                .data(data)
                .transition()
                .delay(dly)
                .duration(drn)
                .ease(easeness)
                .attr("cx", function (d) { return x(d.sepal_length); })
                .attr("cy", function (d) { return y(d.petal_length); })
                .attr("r", 4.0)
                .style("fill", function (d) { return color(d.Species) })
        }
    }

    // Call the update function to update the chart
    d3.select("body").on("click", update);
})