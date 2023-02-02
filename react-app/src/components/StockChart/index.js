import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSingleStockDataFromAPI } from '../../store/stocks';

import ApexCharts from 'react-apexcharts'
import moment from 'moment';

import { isObjectEmpty } from '../utility';

import './StockChart.css';

const StockChart = (props) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('1D');
  const singleStockInfo = useSelector(state => state.stocks.singleStock.Info);
  const [filter, setFilter] = useState('1D');
  const [xaxisCategories, setXaxisCategories] = useState([]);

  const [currentMarketPrice, setCurrentMarketPrice] = useState(true);

  const timeSeriesData = useSelector(state => state.stocks.singleStock.Data.values);
  const [tempData, setTempData] = useState();
  const [series, setSeries] = useState([]);

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
    if (tempData) {
      tempData.reverse(); // Reverse the order of the data
      let seriesData = tempData.map(item => {
        return { 
          x: item.datetime, 
          y: Math.round(item.close * 100) / 100
        }
      });
      setSeries([{ name: '', data: seriesData }])
      setXaxisCategories(tempData.map(({ datetime }) => {
        if (filter === '1D') {
          return moment(datetime).format('HH:mm');
        } else {
          return moment(datetime).format('MMM DD');
        }
      }));
    }
  }, [tempData, filter])




  const handleFilterChange = async (filter) => {
    setFilter(filter);

    setTempData([]);
    setSeries([]);

    // make API call with updated interval
    dispatch(getSingleStockDataFromAPI(singleStockInfo.symbol, filter));
  }


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

    responsive: [
      {
        // breakpoint: 900,
        // options: {
        //   plotOptions: {
        //     bar: {
        //       horizontal: false
        //     }
        //   },
        //   legend: {
        //     position: "bottom"
        //   }
        // }
      }
    ],

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
  }

  return (
    <>
      {
        !loading ?
          <div>
            <div className='big-chart-container'>
              <ApexCharts options={options} series={series}  width='800px' height='300px' />
            </div>
            <div className='stock-chart-filter-buttons-container'>
              <button onClick={() => handleFilterChange('1D')} className={filter === '1D' ? 'active-filter-button' : '' } id='filter-button'>1D</button>
              <button onClick={() => handleFilterChange('1W')} className={filter === '1W' ? 'active-filter-button' : '' }>1W</button>
              <button onClick={() => handleFilterChange('1M')} className={filter === '1M' ? 'active-filter-button' : '' }>1M</button>
              <button onClick={() => handleFilterChange('3M')} className={filter === '3M' ? 'active-filter-button' : '' }>3M</button>
              <button onClick={() => handleFilterChange('1Y')} className={filter === '1Y' ? 'active-filter-button' : '' }>1Y</button>
              <button onClick={() => handleFilterChange('5Y')} className={filter === '5Y' ? 'active-filter-button' : '' }>5Y</button>
            </div>
          </div>
          :
          <></>
      }
    </>
  );
}

export default StockChart;