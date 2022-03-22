import * as d3 from "https://cdn.skypack.dev/d3@7";

const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
}

const width = 2500 - margin.left - margin.right;
const height = 1000 - margin.top - margin.bottom;

const render = (data) => {
    const svg = d3.select('svg')
                  .attr('width', width +margin.left+margin.right)
                  .attr('height',height+margin.top+margin.bottom)
                  .append('g')
                  .attr('transform',`translate(${margin.left},${margin.right})`);
    
    const root = d3.stratify()
                  .id(d => d.symbol)
                  .parentId(d => d.comm)
                     (data);
               
                  root.sum(d => d.cycles/d.instructions);

    d3.treemap()
      .size([width,height])
      .padding(5)
      (root);

    svg.selectAll('rect')
       .data(root.leaves())
       .join("rect")
       .attr('x', d => d.x0)
       .attr('y', d => d.y0)
       .attr('width', d => d.x1 - d.x0)
       .attr('height', d => d.y1 - d.y0)
       .style("stroke", "black")
       .style("fill", "#69b3a2");

       svg
         .selectAll("text")
         .data(root.leaves())
         .join("text")
         .attr("x", function(d){ return d.x0+10})   
         .attr("y", function(d){ return d.y0+20})   
         .text(function(d){ return d.data.symbol})
         .attr("font-size", "15px")
         .attr("fill", "white")
}

d3.csv('geant4.csv').then(data => {
    data.forEach(d => {
        d.comm = new String(d.comm);
        d.dso = new String(d.dso);
        d.symbol = new String(d.symbol);
        d.cycles = +d.cycles / 1000000000;
        d.instructions = +d.instructions / 1000000000;
        d.branches = +d.branches / 1000000000;
        d.branch_misses = +d.branch_misses / 1000000000;
    });

    render(data);
})
