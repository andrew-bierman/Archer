import React from "react";
import StockChart from "../StockChart";
import StockList from "../StockList";
import WatchLists from "../WatchLists";
import HomePageHoldings from "../HomePageHoldings";
import StockListSearch from "../Search";
import HomePageStockChart from "../HomePageStockChart";
import HomePageNewsFeed from "../HomePageNewsFeed";
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-main-container flex flex-col lg:flex-row">
            <div className="homepage-main-left-side flex flex-col lg:flex-row">
                {/* <StockListSearch /> */}
                <HomePageStockChart />
                <HomePageNewsFeed />
            </div>
            <div className="homepage-main-right-side">
                <HomePageHoldings />
                <WatchLists />  
            </div>
        </div>
    );
}

export default HomePage;