import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSingleStockDataFromAPI } from '../../store/stocks';

import ApexCharts from 'react-apexcharts'
import moment from 'moment';

import { isObjectEmpty } from '../utility';

import './WatchListStockChart.css';

const WatchListStockChartMini = ({stockSymbol}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
//   const singleStockInfo = useSelector(state => state.stocks.singleStock.Info);

  const [filter, setFilter] = useState('1D');
  const [xaxisCategories, setXaxisCategories] = useState([]);

  const [currentMarketPrice, setCurrentMarketPrice] = useState(true);
  // console.log("stockSymbol in mini chart", stockSymbol)
  const timeSeriesData = useSelector(state => state.watchlists.watchlistStockData[stockSymbol].dailyData);
  const [tempData, setTempData] = useState();
  const [series, setSeries] = useState([]);


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
        return { x: item.datetime, y: item.close }
      });
      setSeries([{ name: '', data: seriesData }])
      setXaxisCategories(tempData.map(({ datetime }) => {
        return moment(datetime).format('HH:mm');
      }));
    }
  }, [tempData, filter])


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
      width: 2
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: false,
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
            <div className='watchlist-stock-chart-container'>
              <ApexCharts options={options} series={series} width='140px' />
            </div>
          </div>
          :
          <></>
      }
    </>
  );
}

export default WatchListStockChartMini;