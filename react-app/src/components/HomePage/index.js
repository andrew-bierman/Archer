import React from "react";
import StockChart from "../StockChart";
import StockList from "../StockList";
import WatchLists from "../WatchLists";
import HomePageHoldings from "../HomePageHoldings";
import StockListSearch from "../Search";
import HomePageStockChart from "../HomePageStockChart";
import HomePageNewsFeed from "../HomePageNewsFeed";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="container">
      <div className="homepage-core-container">
        <HomePageStockChart />

        <div className="card homepage-buy-card">
          <HomePageHoldings />
          <WatchLists />
        </div>
      </div>

      <div className="homepage-news-feed">
        <HomePageNewsFeed />
      </div>
    </div>
  );
};

export default HomePage;
