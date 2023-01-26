import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import StockChart from '../StockChart';
import { getSingleStockDataFromAPI, getSingleStockInfo, getSingleStockCurrentPriceFromAPI } from '../../store/stocks';
import { resetCurrentHolding } from '../../store/holdings';
import BuySellStock from '../BuySellStock';
import './StockPage.css';

function StockPage() {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    // const [stockData, setStockData] = useState({});
    const stockData = useSelector(state => state.stocks.singleStock.Data);
    // const [stockInfo, setStockInfo] = useState({});
    const stockInfo = useSelector(state => state.stocks.singleStock.Info);
    const stockCurrentPrice = useSelector(state => state.stocks.singleStock.CurrentPrice.close);
    const state = useSelector(state => state);

    console.log(state)

    const { symbol } = useParams();

    const fetchDbData = async () => {
      // const response = await fetch(`/api/stocks/search/db/${symbol}`);
      // const data = await response.json();
      // setStockInfo(data);
      await dispatch(getSingleStockInfo(symbol))

    }
    

    const fetchApiData = async (symbol) => {
      // const response = await dispatch(getSingleStockDataFromAPI(symbol))
      // const data = await response.json()
      // setStockData(data);
      await dispatch(getSingleStockDataFromAPI(symbol))
      await dispatch(getSingleStockCurrentPriceFromAPI(symbol))

    }

    // search database for stock data
    useEffect(() => {
        setLoading(true);
        fetchDbData();
        fetchApiData(symbol);
        setLoading(false);

        return () => {
          setLoading(true);
          dispatch(resetCurrentHolding());
        }
    }, []);

  return (
    <>
      {(!loading) 
      ? 
        (
          <div className='stock-page-core-container'>
            <div className='stock-page-stock-info'>
              {/* <h2>{stockInfo?.symbol?.toUpperCase()}</h2> */}
              <h2>{stockInfo.company_name}</h2>
              <h2>${ parseFloat(stockCurrentPrice).toFixed(2)}</h2>
              <StockChart stockData={stockData} />
            </div>
            <div className='stock-page-sidebar'>
              <BuySellStock stockInfo={stockInfo} stockCurrentPrice={stockCurrentPrice} loading={loading}/>
              <button>Add to List</button>
            </div>
          </div>
        ) 
        : 
          (
            <p>Loading...</p>
          )}
    </>
  );
}

export default StockPage;
