import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleStockDataFromAPI, getSingleStockCurrentPriceFromAPI } from '../../store/stocks';
import { getHoldingStockData, getAllUserHoldings } from '../../store/holdings';
import ApexCharts from 'react-apexcharts'

import './HomePageStockChart.css';
import { formatToCurrency } from '../utility';

const HomePageStockChart = (props) => {
  // const data = props?.stockData["Time Series (Daily)"];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [userHasNoHoldings, setUserHasNoHoldings] = useState(false);

  const userBuyingPower = useSelector(state => state.session.user.buying_power);
  const [portfolioValueLatest, setPortfolioValueLatest] = useState(0);

  const [filter, setFilter] = useState('1D');
  const [color, setColor] = useState('#00C805');

  const [currentMarketPrice, setCurrentMarketPrice] = useState(true);

  const [stockData, setStockData] = useState([]);
  const [series, setSeries] = useState([]);

  // let stock


  const holdings = useSelector(state => state.holdings.allHoldings);
  const holdingsStockData = useSelector(state => state.holdings.stockData);

  const handleFilterChange = async (filter) => {
    setFilter(filter);

    setStockData([]);
    setSeries([]);

    // make API call with updated interval
    // dispatch(getSingleStockDataFromAPI(singleStockInfo.symbol, filter));
  }



  const getHoldingStockData2 = async (stockSymbol, filter) => {
    // console.log('HOLDINGS STOCK THUNK TOp -', stockSymbol)
    try {
      const response = await fetch(`/api/stocks/data/time-series/${stockSymbol}/${filter}`);
      // debugger
      if (response.ok) {
        const data = await response.json();
        // console.log('HOLDINGS STOCK THUNK', data)
        dispatch({ type: 'holding/GET_HOLDING_STOCK_DATA', payload: data });
        return data;
      } else {
        console.log('Error fetching stock data');
      }

    } catch (e) {
      console.log('Error fetching stock data', e);
    }
  }

  // const getHoldingDataFromAPI = async () => {
  //   let symbolsStr = '';
  //   holdings.forEach(holding => {
  //     symbolsStr += `${holding.stock.symbol},`;
  //   });
  //   symbolsStr = symbolsStr.slice(0, -1);
  //   const res = await dispatch(getHoldingStockDataBatch(symbolsStr));

  //   return res;
  // }

  // useEffect(() => {
  //   setLoading(true);
  //   dispatch(getAllUserHoldings())
  // }, [dispatch, holdings]);

  useEffect(() => {
    if ((!holdings || holdings.length === 0) && userHasNoHoldings === false) {
      setLoading(true);
      dispatch(getAllUserHoldings())
      setUserHasNoHoldings(true);
    } else if (holdings && holdings.length > 0 && userHasNoHoldings === true) {
      setLoading(false);
      setUserHasNoHoldings(false);
    } else {
      setLoading(false);
    }
  }, [dispatch, holdings]);

  useEffect(() => {
    // debugger
    setSeries([{ name: '', data: stockData }])
    if (holdings.length > 0) {
      setPortfolioValueLatest(stockData.slice(-1)[0]?.y)
    } else {
      setPortfolioValueLatest(userBuyingPower)
    }

  }, [stockData])

  useEffect(() => {
    if (!holdings || holdings.length === 0) {
      return;
    }
    if (loading) {
      return;
    }
    let aggregateData = {};
    const fetchData = async () => {
      console.log('holdings at top of async func', holdings)
      // console.log(holdings && holdings.length > 0)
      // debugger
      if (holdings && holdings.length > 0) {
        for (let i = 0; i < holdings.length; i++) {

          // console.log('CALLING getHoldingStockData')

          // await dispatch(getHoldingStockData(holdings[i].stock[0].symbol, '1D'))

          // dispatch(getHoldingStockData(holdings[i].stock[0].symbol, '1D'))

          if (typeof holdings[i]?.stock[0]?.symbol === 'undefined') return

          const stock = await getHoldingStockData2(holdings[i].stock[0].symbol, filter)
            .catch(e => console.log('error in getHoldingStockData2', e))
          // let stock = []
          // let stock = holdingsStockData[holdings[i].stock[0].symbol]

          // console.log('stock from selector', stock)
          // await getHoldingStockData(holdings[i].stock[0].symbol, '1D')

          if (typeof stock === 'undefined') return

          let data = stock.values;
          data.reverse()
          // debugger
          data.forEach(dataPoint => {
            // debugger
            if (!aggregateData[dataPoint.datetime]) {
              aggregateData[dataPoint.datetime] = {
                x: dataPoint.datetime,
                // y: (dataPoint.close * holdings[i].total_cost) / holdings[i].shares
                y: Math.round((dataPoint.close * holdings[i].shares + userBuyingPower) * 100) / 100
              };
            } else {
              aggregateData[dataPoint.datetime].y += (Math.round((dataPoint.close * holdings[i].shares) * 100) / 100)
            }
          });
        }
      }
      setStockData(Object.values(aggregateData));
      setSeries([{ name: '', data: stockData }])

      if (stockData?.length > 0) {
        setColor(stockData[0].y <= stockData[stockData.length - 1].y ? '#00C805' : '#FF0000');
        // console.log({ series })
        // console.log(stockData[0].y <= stockData[stockData.length - 1].y ? '#00C805' : '#FF0000')

      }
    };
    fetchData();
  }, [holdings, dispatch, loading, filter]);

  /*
  const aggregateHoldingsData = async (holdings) => {
    let aggregateData = {};
    holdings.forEach(holding => {
      let stockData = getSingleStockDataFromAPI(holding.stock.symbol); // retrieve historical data for the stock
      stockData = stockData["values"];
      console.log('stockData', stockData)
      stockData?.forEach(dataPoint => {
        if (!aggregateData[dataPoint.datetime]) {
          aggregateData[dataPoint.datetime] = {
            x: dataPoint.datetime,
            y: (dataPoint.close * holding.total_cost) / holding.shares
          };
        } else {
          aggregateData[dataPoint.datetime].y += (dataPoint.close * holding.total_cost) / holding.shares;
        }
      });
    });
    return Object.values(aggregateData);
  }
  */

  // chart data and options
  // let data = [];
  // let series = [];
  // if (holdings.length > 0 && !loading) {
  //   data = aggregateHoldingsData(holdings);
  //   series = [{
  //     name: 'Portfolio Value',
  //     data: data
  //   }]
  // }

  // const series = [{
  //   name: '',
  //   data: stockData
  // }]

  // console.log(series)

  console.log(typeof portfolioValueLatest)

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
    colors: [`${color}`],
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
      y: [{
        title: {
          formatter: function (val) {
            return "$"
          }
        },
        labels: {
          formatter: function (val) {
            return val.toFixed(2)
          }
        }
      }]
    },
    toolbar: {
      show: false,
    },
    legend: {
      show: false,
    },
    noData: {
      text: !userHasNoHoldings ? "Loading..." : "You have no holdings",
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
        loading ?
          <h1>
            <i className="fa-solid fa-circle-notch fa-spin"></i>
            &nbsp;
            Loading...
          </h1 >
          :
          <div className='homepage-stock-chart-entire-comp-container'>
            <h2>{portfolioValueLatest ? `Portfolio Value: $${formatToCurrency(portfolioValueLatest)}` : ''}</h2>
            <div className='big-chart-container'>
              <ApexCharts options={options} series={series} width='100%' height='100%' />
            </div>

            <div className='stock-chart-filter-buttons-container'>
              <button onClick={() => handleFilterChange('1D')} className={filter === '1D' ? 'active-filter-button' : ''} id='filter-button'>1D</button>
              <button onClick={() => handleFilterChange('1W')} className={filter === '1W' ? 'active-filter-button' : ''}>1W</button>
              <button onClick={() => handleFilterChange('1M')} className={filter === '1M' ? 'active-filter-button' : ''}>1M</button>
              <button onClick={() => handleFilterChange('3M')} className={filter === '3M' ? 'active-filter-button' : ''}>3M</button>
              <button onClick={() => handleFilterChange('1Y')} className={filter === '1Y' ? 'active-filter-button' : ''}>1Y</button>
              <button onClick={() => handleFilterChange('5Y')} className={filter === '5Y' ? 'active-filter-button' : ''}>5Y</button>
            </div>
            <div className="home-page-stock-chart-buying-power-container">
              <h3>
                Buying Power:
              </h3>
              <h3>
                ${formatToCurrency(userBuyingPower)}
              </h3>
            </div>
          </div>
      }
    </>
  );
}

export default HomePageStockChart;