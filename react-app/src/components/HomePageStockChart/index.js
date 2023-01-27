import React, { useState } from 'react';

import ApexCharts from 'react-apexcharts'

import './HomePageStockChart.css';

const HomePageStockChart = (props) => {
    // const data = props?.stockData["Time Series (Daily)"];
    const [currentMarketPrice, setCurrentMarketPrice] = useState(true);

    function aggregateHoldingsData(holdings) {
        let aggregateData = {};
        // holdings.forEach(holding => {
        //     let stockData = retrieveStockData(holding.stock_id); // retrieve historical data for the stock
        //     stockData.forEach(dataPoint => {
        //         if (!aggregateData[dataPoint.datetime]) {
        //             aggregateData[dataPoint.datetime] = {
        //                 x: dataPoint.datetime,
        //                 y: (dataPoint.close * holding.total_cost) / holding.shares
        //             };
        //         } else {
        //             aggregateData[dataPoint.datetime].y += (dataPoint.close * holding.total_cost) / holding.shares;
        //         }
        //     });
        // });
        // return Object.values(aggregateData);
    }
   

    // chart data and options
    const series = [{
        name: '',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    }]

    
    // const seriesData = Object.keys(data).map(date => ({ x: date, y: data[date]["4. close"] }));

    const options = {
        chart: {
          // id: "basic-bar",
          type: "line",
          align: "center",
          parentHeightOffset: 0,
          events: {
            mouseLeave: () => setCurrentMarketPrice(true),
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          animations: {
            enabled: false,
          },
          redrawOnParentResize: true,
        },
        // series: [{
        //     name: "Stock Price",
        //     data: seriesData
        // }],
        // series: series,
        xaxis: {
            categories: [],
            labels: {
              show: false,
              showAlways: false,
            },
        },
        yaxis: {
          show: false,
          showAlways: false,
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        colors: ["#00C805"],
        stroke: {
              width: 2.75
        },
        grid: { 
            show: false 
        },
        tooltip: {
          enabled: true,
            x: {
                format: 'dd/MM/yy HH:mm'
            },
            y: {
                title: {
                    formatter: function (val) {
                        return "$" + val
                    }
                }
            }
        },
        toolbar: {
            show: false,
        },
        legend: {
            show: false,
          },
        noData: {
            text: "Loading...",
            align: "center",
            verticalAlign: "center",
            style: {
              color: "darkgray",
              fontSize: "24px",
            },
          },
    }

    return (
      <div className='big-chart-container'>
        <ApexCharts options={options} series={series} width='500px'/>
      </div>
    );
}

export default HomePageStockChart;