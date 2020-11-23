import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

import './LineGraph.css'

const options = {
  legend: {
    display: false
  },
  elements: {
    point: {
      raius: 0
    }
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      }
    }
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll"
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function(value, index, values){
            return numeral(value).format("0a");
          }
        }
      }
    ]
  }
}

const buildChartData = (data, caseType) => {
  const chartData = [];
  
  let lastDataPoint;

   //using fetched data to populate array as needed by react chart to build a line graph

  for (let date in data[caseType]){
    if(lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: data[caseType][date] - lastDataPoint
      }
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[caseType][date];
  }
  return chartData;
}

const LineGraph = ({ caseType = "cases"}) => {
  const [data, setData] = useState({});

  
  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
      .then(response => response.json())
      .then(data => {
        const chartData = buildChartData(data, caseType);
        setData(chartData)
      })
    }
    fetchData();
  },[caseType]);

  return (
    <div className="chart__container">
      <h2>Worldwide new {caseType}</h2>
      {data?.length > 0 && (
        <Line 
        data={{
          datasets: [{
            backgroundColor: "rgba(204, 16, 52, 0.2)",
            borderColor: "#CC1034",
            data: data
          }
          ]
        }}
        options={options}
      />
      )}
    </div>
  )
}

export default LineGraph;
