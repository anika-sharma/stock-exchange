import React, { Component } from 'react';
import stockData from './data/data.json';
import LineChart from './components/LineChart';
import './App.css';

//Declare var for stocks and arr
let stocks = {}, arr = [];

class App extends Component {
  constructor() {
    super();

    this.state = {
      company: {}
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

  render() {
    //Generate LI of companies
    const listItems = Object.keys(stocks).map((value) => 
      <li key={value}>
        <label>
          <input 
            type="radio" 
            value={value} 
            name="companyName"
            onChange={(e) => this.setState({ company: stocks[value] })} /> 
          {value}
        </label>
      </li>
    );

    return (
      <div className="container">
        <form>
          <ul className="companies-list border-box">{listItems}</ul>
        </form>

      {/** Render SVG if companies exsit **/}
        {Object.keys(this.state.company).length > 0 ?
          <LineChart chartData={this.state.company} /> : null
        }
      </div>
    );
  }
}

export default App;
