import React from "react";
import StockChart from "../StockChart";
import StockList from "../StockList";
import WatchLists from "../WatchLists";
import StockListSearch from "../Search";
import HomePageStockChart from "../HomePageStockChart";
import HomePageNewsFeed from "../HomePageNewsFeed";
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-main-container">
            <div>
                {/* <StockListSearch /> */}
                <HomePageStockChart />
                {/* <HomePageNewsFeed /> */}
            </div>
            <div>
                <WatchLists />  
            </div>
        </div>
    );
}

export default HomePage;