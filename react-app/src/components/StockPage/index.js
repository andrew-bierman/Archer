import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import StockChart from '../StockChart';

function StockPage() {
    const [stockData, setStockData] = useState({});
    const [stockInfo, setStockInfo] = useState({});

    const { symbol } = useParams();

    // search database for stock data
    useEffect(() => {
        async function fetchDbData() {
            const response = await fetch(`/api/stocks/search/db/${symbol}`);
            const data = await response.json();
            setStockInfo(data);
        }
        fetchDbData();
    }, []);

//   useEffect(() => {
//     async function fetchData() {
//       const func = 'daily';
//       const response = await fetch(`/api/stocks/data/${symbol}?func=${func}`);
//       const data = await response.json();
//       setStockData(data);
//     }
//     fetchData();
//   }, []);



  return (
    <div>
      {(Object.keys(stockInfo).length > 0) 
      ? 
        (
          // <ul>
          //   {Object.keys(stockData).map(key => (
          //     <li key={key}>
          //       {key}: {stockData[key]}
          //     </li>
          //   ))}
          // </ul>
          // <StockChart props={stockData} />
          <div>
              <h2>{stockInfo.symbol.toUpperCase()}</h2>
              <h2>{stockInfo.company_name}</h2>
              <button>Add to List</button>
          </div>
        ) 
        : 
          (
            <p>Loading...</p>
          )}
    </div>
  );
}

export default StockPage;
