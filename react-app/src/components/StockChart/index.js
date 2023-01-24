import React, { useState } from 'react';


import ApexCharts from 'react-apexcharts'

const StockChart = (props) => {
    const [currentMarketPrice, setCurrentMarketPrice] = useState(true);

    // chart data and options
    const series = [{
        name: "Stock Price",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    }]
    const options = {
        chart: {
            // id: "basic-bar",
            type: "line",
            height: 200,
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
          },
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
        tooltip: {
            enabled: true,
            items: { 
                display: 'none' 
            },
            x: { 
                show: false 
            },
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
        <ApexCharts options={options} series={series} type="line" height={350} />
    );
}

export default StockChart;