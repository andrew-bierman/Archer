import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import StockChart from '../StockChart';
import { addStockToWatchlistThunk, getWatchlistStockDataAction, getWatchlistStockDataDailyAction, fetchWatchlists } from '../../store/watchlists';
import { getSingleStockDataFromAPI, getSingleStockInfo, getSingleStockCurrentPriceFromAPI, resetSingleStockData } from '../../store/stocks';
import { resetCurrentHolding } from '../../store/holdings';
import OpenModalButton from '../OpenModalButton';
import { Modal } from '../../context/Modal';
import { isObjectEmpty } from '../utility';
import WatchlistsStockPage from '../WatchListsStockPage';
import BuySellStock from '../BuySellStock';
import StockPageAboutCompany from '../StockPageAboutCompany';
import StockPageNewsFeed from '../StockPageNewsFeed';
import './StockPage.css';

function StockPage() {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // const [stockData, setStockData] = useState({});
  const stockData = useSelector(state => state.stocks.singleStock.Data);
  // const [stockInfo, setStockInfo] = useState({});
  const stockInfo = useSelector(state => state.stocks.singleStock.Info);
  // const stockCurrentPrice = useSelector(state => state.stocks.singleStock.CurrentPrice.close);
  // const stockCurrentPercentChange = useSelector(state => state.stocks.singleStock.CurrentPrice.percent_change);
  const stockCurrentPrice = useSelector(state => state.stocks.singleStock.CurrentPrice.c);
  const stockCurrentPercentChange = useSelector(state => state.stocks.singleStock.CurrentPrice.dp);

  const watchlists = useSelector(state => state.watchlists.allWatchlists);

  const state = useSelector(state => state);

  // console.log(state)

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
      .then((res) => {
        // console.log('data', data)
        if (!isObjectEmpty(res) && res.ok && res.status === 200 && !(typeof res['message'] === 'string')) {
          const data = res;
          dispatch(getWatchlistStockDataDailyAction(data))
        } else {
          return;
        }
      })
      .then(async () => {
        await dispatch(getSingleStockCurrentPriceFromAPI(symbol))
      })
      .then((data) => {
        if (!data || typeof data === 'undefined') return;

        dispatch(getWatchlistStockDataAction(data))
      })
  }

  const handleWatchlistFetchandCheck = async () => {
    await dispatch(fetchWatchlists())
    .then(() => {
      preCheckWatchlistButton(stockInfo?.id)
    })

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
      dispatch(resetSingleStockData());
    }
  }, [symbol]);

  useEffect(() => {
    handleWatchlistFetchandCheck();
  }, []);


  const preCheckWatchlistButton = (stockId) => {
    if (typeof stockId === 'undefined') return false;

    let preCheckedObj = {};
    let preCheck = false
    watchlists.forEach(watchlist => {
      let watchlistId = watchlist.id;
      preCheckedObj[watchlistId] = false;
      watchlist?.stocks.forEach(stock => {
        if (stock?.id === stockId) {
          preCheckedObj[watchlistId] = true;
        }
      });
    });
    if (Object.values(preCheckedObj).includes(true)) {
      preCheck = true;
    }
    return preCheck;
  };


  return (
    <>
      {(!loading)
        ?
        (
          <div className='stock-page-core-container'>
            <div className='stock-page-stock-info'>
              {/* <h2>{stockInfo?.symbol?.toUpperCase()}</h2> */}
              <h2>{stockInfo.company_name}</h2>
              <h2>
                {
                  (stockCurrentPrice > -1 && !isNaN(stockCurrentPrice)) ?
                    <>
                      ${parseFloat(stockCurrentPrice).toFixed(2)}
                    </>
                    :
                    <></>
                }
              </h2>
              {(isNaN(stockCurrentPercentChange)) ?
                <>
                  <span className='search-results-individual-result-symbol'>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    &nbsp;
                    Loading...
                  </span>
                </>
                :
                <>
                  {(stockCurrentPercentChange > 0) ?
                    <h3 className='stock-page-stock-info-percent-change-positive'>
                      +{stockCurrentPercentChange}%</h3>
                    :
                    <h3 className='stock-page-stock-info-percent-change-negative'>
                      {stockCurrentPercentChange}%</h3>
                  }
                </>
              }
              <StockChart stockData={stockData} />
              <br></br>
              <StockPageAboutCompany stockInfo={stockInfo} />
              <br></br>
              <StockPageNewsFeed stockInfo={stockInfo} />
            </div>
            <div className='stock-page-sidebar'>
              {
                (stockCurrentPrice > -1 && !isNaN(stockCurrentPrice)) ?
                  <>
                    <BuySellStock stockInfo={stockInfo} stockCurrentPrice={stockCurrentPrice} loading={loading} />
                    <div className='stock-page-add-to-list-modal-button'>
                      <OpenModalButton
                        buttonText={
                          <>
                            {preCheckWatchlistButton ? 
                            <i className="fa-solid fa-check"></i> 
                            : <i className="fa-solid fa-plus"></i>}
                            &nbsp;
                            Add to List
                          </>
                        }
                        modalComponent={<WatchlistsStockPage />}
                      />
                    </div>
                  </>
                  :
                  <></>
              }
              {/* <button onClick={() => handleAddToList()} className='stock-page-add-to-list-button'>
                  Add to List
                </button> */}
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
