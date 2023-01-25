import React from "react";
import StockChart from "../StockChart";
import StockList from "../StockList";
import WatchLists from "../WatchLists";
import StockListSearch from "../Search";
// import './HomePage.css';

const HomePage = () => {
    return (
        <div>
            <StockListSearch />
            <h1>Home Page</h1>
            <StockChart />
            <WatchLists />  
        </div>
    );
}

export default HomePage;