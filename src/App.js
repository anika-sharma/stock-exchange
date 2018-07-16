import React, { Component } from 'react';
import stockData from './data/data.json';
import LineChart from './components/LineChart';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './App.css';

//Declare var for stocks and arr
let stocks = {}, arr = [];

class App extends Component {
  constructor() {
    super();

    this.state = {
      lineChartData: {},
      validRangeMsg: ''
    }
  }

  componentWillMount() {
    //Get Company names and data from JSON 
    this.getCompanyNames(); 
  }

  getCompanyNames() {
    stockData.map(data => {
      if(Object.keys(stocks).length === 0 || stocks.hasOwnProperty(data.ticker)) {
        //Add data to array
        arr.push(data);
        //Add data obj to company key in stocks
        stocks[data.ticker] = {data: arr};
      } else {
        //If new company, reset array and add data
        arr = [];
        arr.push(data);
        stocks[data.ticker] = {data: arr};
      }
      return stocks;
    });
  }

  getArrFromRange() {
    // Set arr to companies
    const arr = this.state.companies.data;
    let startIndex, endIndex;

    if(this.state.startDate && this.state.endDate) {
      //Find startDate index in arr
      startIndex = arr.findIndex((obj) => {
        return new Date(obj.date) >= this.state.startDate;
      });

      //Find endDate index in arr
      endIndex = arr.slice().reverse().findIndex((obj) => {
        return new Date(obj.date) <= this.state.endDate;
      });
      var count = arr.length - 1;
      var finalEndIndex = endIndex >=0 ? (count - endIndex) : endIndex;

      //Get new array from range
      var data = { data: arr.slice(startIndex, finalEndIndex)};

      //Update state only if both dates are valid
      if(startIndex !== -1 && finalEndIndex !== -1) {
        this.setState({ 
          lineChartData: data,
          validRangeMsg: '' 
        });
      } else if(startIndex === -1 || finalEndIndex === -1) {
        this.setState({ validRangeMsg: 'The date entered is out of range.' })
      }
    }
  }

  render() {
    //Generate LI of companies
    const listItems = Object.keys(stocks).map((value) => 
      <li key={value}
          className={this.state.activeLink === value ? 'list-group-item active' : 'list-group-item'}
          style={{cursor: 'pointer'}}
          onClick={(e) => this.setState({ 
            lineChartData: stocks[value], 
            companies: stocks[value], 
            activeLink: value })}
      >
        {value}
      </li>
    );

    //Check device viewport
    const smallDevice = window.matchMedia('(max-width: 400px)').matches;

    return (
      <div className="container stocks-container">
        <h1 className="text-center m-t-5 m-b-5">Historical Stock Data</h1>
        {/** Render SVG if companies exsit **/}
        {Object.keys(this.state.lineChartData).length > 0 ?
          <div>
            <div className="d-flex flex-column">
              <h3 className="text-left mr-auto p-1">Displaying data of stock {this.state.activeLink}</h3>
              
              <div className="p-1">

                {/** Date range picker - Set props for picker **/}
                <DateRangePicker
                  startDate={this.state.startDate} 
                  startDateId="startDate"
                  endDate={this.state.endDate}
                  endDateId="endDate"
                  startDatePlaceholderText={'MM/DD/YYYY'}
                  endDatePlaceholderText={'MM/DD/YYYY'}
                  onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate }, this.getArrFromRange)} 
                  focusedInput={this.state.focusedInput} 
                  onFocusChange={focusedInput => this.setState({ focusedInput })}
                  keepFocusOnInput={true} 
                  small={true}
                  orientation={smallDevice ? 'vertical' : 'horizontal'}
                  showClearDates={true}
                  isOutsideRange={() => false}
                />

              </div>
            </div>

            {/** Error message if date entered is out of range **/}
            {this.state.validRangeMsg.length > 0 &&
              <p style={{ color: 'red' }}>{this.state.validRangeMsg}</p>
            }
            <LineChart chartData={this.state.lineChartData} />
          </div> : 
          <h3 className="text-left">Select a Stock</h3>
        }
          <ul className="list-group">
            <li className='list-group-item list-group-item-info'>STOCK NAME</li>
            {listItems}
          </ul>
      </div>
    );
  }
}

export default App;
