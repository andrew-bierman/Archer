import React from "react";
import StockChart from "../StockChart";
import StockList from "../StockList";
import WatchLists from "../WatchLists";
import StockListSearch from "../Search";
import HomePageStockChart from "../HomePageStockChart";
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-main-container">
            <div>
                {/* <StockListSearch /> */}
                <HomePageStockChart />
            </div>
            <div>
                <WatchLists />  
            </div>
        </div>
    );
}

export default HomePage;