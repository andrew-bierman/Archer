import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSingleStockDataFromAPI } from '../../store/stocks';

import ApexCharts from 'react-apexcharts'
import moment from 'moment';

import { isObjectEmpty, holiday_dates, filterDataForChart } from '../utility';

import './StockChart.css';

const StockChart = (props) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [chartDataLoaded, setChartDataLoaded] = useState(false);

  const [activeFilter, setActiveFilter] = useState('1D');
  const singleStockInfo = useSelector(state => state.stocks.singleStock.Info);
  const [filter, setFilter] = useState('1D');
  const [xaxisCategories, setXaxisCategories] = useState([{ data: [] }]);

  const [color, setColor] = useState('#00C805');

  const [currentMarketPrice, setCurrentMarketPrice] = useState(true);

  const timeSeriesData = useSelector(state => state.stocks.singleStock.Data.values);
  const [tempData, setTempData] = useState();
  const [series, setSeries] = useState([]);

  const [chartKey, setChartKey] = useState(0);
  const [yMinBar, setYMinBar] = useState(0);

  const [chartType, setChartType] = useState("line");

  const lineChartOptions = {
    chart: {
      id: "basic-bar",
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
        enabled: true,
        easing: 'linear',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      redrawOnParentResize: true,
    },

    responsive: [
      {}
    ],

    xaxis: {
      // type: 'datetime',
      // categories: xaxisCategories,
      // categories: [],
      labels: {
        show: false,
        showAlways: false,
      },
      axisBorder: {
        show: false,
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
    colors: [`${color}`],
    stroke: {
      width: 2.75,
      curve: 'straight'
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: true,
      x: {
        // format: 'dd/MM/yy HH:mm',
        format: filter === '1D' ? 'HH:mm' : 'MM/dd/yy HH:mm',
      },
      y: {
        title: {
          formatter: function (value) {
            return "$"
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



  const candlestickChartOptions = {
    // series: series,
    chart: {
      id: 'basic-candlestick',
      type: 'candlestick',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      tooltip: {
        enabled: true
      },
      show: false,
      type: 'datetime',
      labels: {
        show: false
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    },
    tooltip: {
      enabled: true,

    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#00C805',
          downward: '#FF0000'
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
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
  };

  const barChartOptions = {
    chart: {
      id: "basic-bar",
      type: "bar",
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
        enabled: true,
      },
      redrawOnParentResize: true,
    },

    responsive: [
      {}
    ],

    xaxis: {
      show: false,
      type: 'datetime',
      timezone: 'America/New_York',
      categories: xaxisCategories,
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
      min: yMinBar,

    },
    dataLabels: {
      enabled: false
    },
    colors: [`${color}`],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '100%',
        endingShape: 'flat',
      }
    },
    stroke: {
      width: 0
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: true,
      x: {
        // format: 'dd/MM/yy HH:mm',
        format: filter === '1D' ? 'HH:mm' : 'dd/MM/yy',
      },
      y: {
        title: {
          formatter: function (val) {
            return "$"
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
  };


  const [chartOptions, setChartOptions] = useState(lineChartOptions)



  // useEffect(() => {
  //     setTempData([]);
  //     setSeries([]);
  // }, [filter])

  useEffect(() => {
    setLoading(true);
    console.log('timeSeriesData: ', timeSeriesData)
    if (timeSeriesData !== undefined) {
      if (isObjectEmpty(timeSeriesData)) {
        setLoading(true);
      } else {
        setLoading(false);
        setTempData(timeSeriesData);
      }
    }
  }, [timeSeriesData]);

  useEffect(() => {
    setChartKey(chartKey + 1);
    setChartDataLoaded(false);

    const handleChartData = async () => {
      if (tempData && tempData?.length > 0) {
        // compare start and end date to determine if reverse is needed
        if (new Date(tempData[0].datetime) > new Date(tempData[tempData.length - 1].datetime)) {
          tempData.reverse(); // Reverse the order of the data
        }

        let filteredData = filterDataForChart(tempData, filter);

        // let filteredData = tempData

        // let filteredData = tempData.filter(({ datetime }) => {
        //   // debugger

        //   const dateInQuestion = new Date(datetime);

        //   const date = new Date()
        //   const day = date.getDay();
        //   const year = date.getFullYear();
        //   if (day >= 6 || day === 0) {
        //     if (day === 6) {
        //       date.setDate(date.getDate() - 1);
        //     } else if (day === 0) {
        //       date.setDate(date.getDate() - 2);
        //     }
        //   } else if (day <= 5 && day > 0) {
        //     if (holiday_dates[year].includes(date.toISOString().slice(0, 10))) {
        //       if(day === 1) {
        //         date.setDate(date.getDate() - 3);
        //       } else {
        //         date.setDate(date.getDate() - 1);
        //       }
        //     } else if (date.getHours() < 9) {
        //       if(day === 1) {
        //         date.setDate(date.getDate() - 3);
        //       } else {
        //         date.setDate(date.getDate() - 1);
        //       }
        //     }
        //   }

        //   let startDate, endDate;

        //   if (filter === '1D') {
        //     // const day = date.getDay();
        //     if (day === 0) {
        //       startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2, 9, 30);
        //       endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2, 16, 0);
        //     } else if (day === 6) {
        //       startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 9, 30);
        //       endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 16, 0);
        //     } else {
        //       startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 30);
        //       endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 16, 0);
        //     }
        //   } else if (filter === '1W') {
        //     startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7, 0, 0);
        //     endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        //   } else if (filter === '1M') {
        //     startDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate(), 0, 0);
        //     endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        //   } else if (filter === '3M') {
        //     startDate = new Date(date.getFullYear(), date.getMonth() - 3, date.getDate(), 0, 0);
        //     endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        //   } else if (filter === '1Y') {
        //     startDate = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate(), 0, 0);
        //     endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        //   } else if (filter === '5Y') {
        //     startDate = new Date(date.getFullYear() - 5, date.getMonth(), date.getDate(), 0, 0);
        //     endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        //   } else {
        //     startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 0, 0);
        //     endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        //   }

        //   return dateInQuestion >= startDate && dateInQuestion <= endDate;
        // });


        let seriesData = [];

        if (chartType === "line") {
          seriesData = await filteredData.map(item => {
            return {
              x: item.datetime,
              y: Math.round(item.close * 100) / 100
            }
          });


          await setChartOptions(lineChartOptions)

        } else if (chartType === "candlestick") {
          seriesData = await filteredData.map(item => {
            return {
              x: item.datetime,
              y: [
                Math.round(item.open * 100) / 100,
                Math.round(item.high * 100) / 100,
                Math.round(item.low * 100) / 100,
                Math.round(item.close * 100) / 100
              ]
            }
          });

          await setChartOptions(candlestickChartOptions);

        } else if (chartType === "bar") {
          let minY = Number.MAX_SAFE_INTEGER;
          let maxY = Number.MIN_SAFE_INTEGER;

          seriesData = await filteredData.map(item => {
            const y = Math.round(item.close * 100) / 100;
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);

            return {
              x: item.datetime,
              y: y
            }
          });

          const percentPadding = 0.1; // 10% padding
          const yMin = minY - percentPadding * (maxY - minY);
          setYMinBar(yMin)

          await setChartOptions(barChartOptions);

          setChartKey(chartKey + 1);

        }


        await setSeries([{ name: '', data: seriesData }])
        setXaxisCategories(tempData.map(({ datetime }) => {
          // console.log(datetime)
          const date = new Date(datetime);
          // const date = new Date(`${datetime}Z`);
          return date;


          if (filter === '1D') {
            return `${date.getHours()}:${date.getMinutes()}`;
          } else {
            return `${date.getHours()}:${date.getMinutes()}`;
            // return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
          }
        }));

        /*
        setXaxisCategories(tempData.map(({ datetime }) => {
          if (filter === '1D') {
            return moment(datetime).format('HH:mm');
          } else {
            return moment(datetime).format('MMM DD');
          }
        }));
        */

        if (seriesData?.length > 0) {
          await setColor(seriesData[0].y <= seriesData[seriesData.length - 1].y ? '#00C805' : '#FF0000');
          // console.log(seriesData[0].y <= seriesData[seriesData.length - 1].y ? '#00C805' : '#FF0000')
          // console.log(seriesData[0].y, seriesData[seriesData.length - 1].y)
        }

        console.log('series in chartData useeffect', series)

        // setChartKey(chartKey + 1);

      }
    }
    handleChartData()
      .then(() => {
        setChartDataLoaded(true);
        // setChartKey(chartKey + 1);
      })
  }, [tempData, filter, chartType])

  useEffect(() => {
    setChartKey(chartKey + 1);
  }, [chartType, chartOptions, yMinBar, color, xaxisCategories, filter])

  useEffect(() => {
    if (series?.data?.length > 1) {
      setChartDataLoaded(true);
      setChartKey(chartKey + 1);
    } else {
      setChartDataLoaded(false);
    }

    console.log('series in test useeffect', series)

  }, [series])




  const handleFilterChange = async (filter) => {
    setFilter(filter);

    setTempData([]);
    setSeries([]);

    setChartKey(chartKey + 1);

    // make API call with updated interval
    await dispatch(getSingleStockDataFromAPI(singleStockInfo.symbol, filter));
  }

  const handleChartTypeChange = (type) => {
    setChartType(type);
    // setChartKey(chartKey + 1);
  }


  return (
    <>
      {
        !loading ?
          <div className='big-chart-container'>
            <div className='big-chart-container' key={chartKey + 100 + 'container'}>
              {chartDataLoaded &&
                <ApexCharts
                  key={chartKey}
                  // options={
                  //   chartType === 'line' ? lineChartOptions : candlestickChartOptions
                  // }
                  options={chartOptions}
                  series={series}
                  type={chartType}
                  width='100%' height='100%' />
              }
            </div>
            <div className='stock-chart-filter-buttons-container'>
              <div className='stock-chart-filter-buttons-container'>
                <button onClick={() => handleFilterChange('1D')} className={filter === '1D' ? 'active-filter-button' : ''} id='filter-button'>1D</button>
                <button onClick={() => handleFilterChange('1W')} className={filter === '1W' ? 'active-filter-button' : ''}>1W</button>
                <button onClick={() => handleFilterChange('1M')} className={filter === '1M' ? 'active-filter-button' : ''}>1M</button>
                <button onClick={() => handleFilterChange('3M')} className={filter === '3M' ? 'active-filter-button' : ''}>3M</button>
                <button onClick={() => handleFilterChange('1Y')} className={filter === '1Y' ? 'active-filter-button' : ''}>1Y</button>
                <button onClick={() => handleFilterChange('5Y')} className={filter === '5Y' ? 'active-filter-button' : ''}>5Y</button>
              </div>
              <div className=''>
                {/* <div className='stock-chart-chart-type-dropdown-container'> */}
                {/* <div className='stock-chart-chart-type-dropdown-container-dropdown-wrapper select'> */}
                <div className='select is-light'>
                  <select value={chartType} onChange={(e) => handleChartTypeChange(e.target.value)}>
                    <option value="line">Line</option>
                    <option value="candlestick">Candlestick</option>
                    {/* <option value="bar">Bar</option> */}
                  </select>
                  {/* <span className="fa fa-chevron-down"></span> */}
                </div>
              </div>
            </div>

          </div>
          :
          <></>
      }
    </>
  );
}

export default StockChart;