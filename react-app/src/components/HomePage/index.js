import React from 'react';
import StockChart from '../StockChart';
import StockList from '../StockList';
import WatchLists from '../WatchLists';
import HomePageHoldings from '../HomePageHoldings';
import StockListSearch from '../Search';
import HomePageStockChart from '../HomePageStockChart';
import HomePageNewsFeed from '../HomePageNewsFeed';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className='homepage-entire-container'>
      <div className="homepage-core-container">
        <HomePageStockChart />
        <div className="homepage-buy-card">
          <HomePageHoldings />
          <WatchLists />
        </div>
      </div>
        <HomePageNewsFeed />
    </div>
  );
};

export default HomePage;