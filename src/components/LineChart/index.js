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
    const data = this.state.data;

    //Remove SVG child nodes if they exsit
    var svg = d3.selectAll("#line-chart > *").remove();

    //Set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    //Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    //Define the line
    var valueline = d3.line()
                      .x(function(d) { return x(d.date); })
                      .y(function(d) { return y(d.close); });

    //Apped SVG to #line-chart element
    svg = d3.select("#line-chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",  "translate(" + margin.left + "," + margin.top + ")");

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
       .call(d3.axisBottom(x));

    //Add the Y Axis
    svg.append("g")
       .call(d3.axisLeft(y));
  };

  render() {
    return(
        <svg id="line-chart" className="border-box" width="960" height="500" viewBox="0 0 960 500"></svg>
    );
  }
}

export default LineChart;
