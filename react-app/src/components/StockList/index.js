import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllStocks,  } from '../../store/stockList';
import { addStockToWatchlistThunk } from '../../store/watchlists';
import './StockList.css';

function StockList({watchlistId}) {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [selectedStockId, setSelectedStockId] = useState(0)

    const stocks = useSelector(state => state.stockList);

    useEffect(() => {
        console.log('BEFORE STOCKS',Object.values(stocks))
        setLoading(true);
        // dispatch(getAllStocks());
        setLoading(false);
        console.log('AFTER STOCKS',Object.values(stocks))
    }, [dispatch]);

    const handleChange = (e) => {
        e.preventDefault();
        setSelectedStockId(e.target.value)
    }

    const handleAddToList = (e) => {
        e.preventDefault();
        dispatch(addStockToWatchlistThunk(watchlistId, selectedStockId))
    }

    return (
        <div className='stock-list-container'>
            { (!loading) 
            ?
                <div className='stock-list-container'>
                    <h6>All Stocks List</h6>
                    <form onSubmit={handleAddToList}>
                        <select onChange={handleChange}>
                            {Object.values(stocks)?.map((stock, idx) => (
                                <option key={stock.id} value={stock.id}>
                                    {stock.symbol}
                                    &nbsp;
                                    -
                                    &nbsp;
                                    {stock.company_name}
                                </option>

                            ))}
                        </select>
                        <button type='submit'>Add to list</button>
                    </form>
                </div>
            :
                <div></div>
            }
        </div>
    );
}

export default StockList;