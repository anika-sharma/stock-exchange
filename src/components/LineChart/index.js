import React, { Component } from 'react';
import './index.css';
import * as d3 from 'd3';

class LineChart extends Component {
  constructor(props){
    super(props);

    //Get props from parent component and set state
     this.state = {
      data: this.props.chartData.data
     }
  }

  componentDidMount() {
    //Draw SVG of Line Chart
    this.getLineChart();
  }

  shouldComponentUpdate(nextProps, nextState) {
    //If new props are received, update state of data
    if (this.props !== nextProps) {
      this.setState({ data: nextProps.chartData.data }, this.getLineChart);
      return true;
    } else {
      return false;
    }
  }

  getLineChart() {
    var data = this.state.data;

    //Remove SVG child nodes if they exsit
    var svg = d3.selectAll(".chart>svg").remove();

    //Set the dimensions and margins of the graph
    var margin = {top: 20, right: 10, bottom: 35, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    //Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    //Define the line
    var valueline = d3.line()
                      .x(function(d) { return x(d.date); })
                      .y(function(d) { return y(d.close); });

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    //Apped SVG to #line-chart element
    svg = d3.select(".chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .call(responsivefy)
            .append("g")
            .attr("transform",  "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeFormat("%x");

    //Format the data
    data.forEach(function(d) {
      d.date = new Date(d.date);
      d.close = +d.close;
    });

    //Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    //Add the valueline path.
    svg.append("path")
       .data([data])
       .attr("class", "line")
       .attr("d", valueline);

    //Add the X Axis
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .style("font-size", "1em")
       .call(d3.axisBottom(x));

    //Add the Y Axis
    svg.append("g")
       .call(d3.axisLeft(y))
       .append("text")
       .attr("transform", "rotate(-90)")
       .style("font-size", "1em")
       .attr("y", 6)
       .attr("dy", ".50em")
       .attr("class", "axis-name")
       .text("Close");

    //Append interactive rectangle
    var focus = svg.append("g")
                   .attr("class", "focus")
                   .style("display", "none");

    focus.append("circle")
         .attr("r", 4.5);

    focus.append("line")
         .classed("x", true)

    focus.append("line")
         .classed("y", true)

    focus.append("text")
         .attr("x", 9)
         .attr("dy", ".35em");

    svg.append("rect")
       .attr("class", "overlay")
       .attr("width", width)
       .attr("height", height)
       .on("mouseover", function() { 
          focus.style("display", "block"); 
          div.style("opacity", .9); 
        })
       .on("mouseout", function() { 
          focus.style("display", "none"); 
          div.style("opacity", 0); 
        })
       .on("mousemove", mousemove);
    
    // Tooltip  
    var div = d3.select("body").append("div")
                               .attr("class", "tooltip")
                              .style("opacity", 0);

    function mousemove() {
      // Get data from mouse location on svg
      var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;

      // Draw lines for coordinate points
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
      focus.select("line.x")
           .attr("x1", 0)
           .attr("x2", -x(d.date))
           .attr("y1", 0)
           .attr("y2", 0)
      focus.select("line.y")
           .attr("x1", 0)
           .attr("x2", 0)
           .attr("y1", 0)
           .attr("y2", height - y(d.close));

      // Add data to tooltip
      div.html(d.close + ", " + parseTime(d.date))
         .style("left", (d3.event.pageX - 34) + "px")
         .style("top", (d3.event.pageY - 12) + "px");
    }

    // Function to make svg responsive
    function responsivefy(svg) {
      // get container + svg aspect ratio
      var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10),
      aspect = width / height;

      // add viewBox and preserveAspectRatio properties,
      // and call resize so that svg resizes on inital page load
      svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMinYMid")
      .call(resize);

      // to register multiple listeners for same event type,
      // you need to add namespace, i.e., 'click.foo'
      // necessary if you call invoke this function for multiple svgs
      // api docs: https://github.com/mbostock/d3/wiki/Selections#on
      d3.select(window).on("resize." + container.attr("id"), resize);

      // get width of container and resize svg to fit it
      function resize() {
        var targetWidth = parseInt(container.style("width"), 10);
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
      }
    }
  }

  render() {
    return(
        <div className="chart"></div>
    );
  }
}

export default LineChart;
