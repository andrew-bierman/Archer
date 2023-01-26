import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWatchlists, createNewWatchlist, deleteWatchlist, fetchWatchlistById, updateWatchlist, addStockToWatchlistThunk, removeStockFromWatchlistThunk } from '../../store/watchlists';
import { getAllStocks } from '../../store/stockList';
import StockList from '../StockList';
import './WatchLists.css';

const Watchlists = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(0);
    const [edittedWatchlistName, setEdittedWatchlistName] = useState('');

    const [newWatchlistName, setNewWatchlistName] = useState('');
    const dispatch = useDispatch();
    const watchlists = useSelector(state => state.watchlists.allWatchlists);
    const state = useSelector(state => state);

    useEffect(() => {
        setLoading(true);
        dispatch(fetchWatchlists());
        dispatch(getAllStocks());
        // console.log(state)
        setLoading(false);
    }, [dispatch]);


    const handleWatchlistCreate = async (e) => {
        e.preventDefault();

        setLoading(true);

        await dispatch(createNewWatchlist(newWatchlistName))
        .then(() => dispatch(fetchWatchlists()))

        setNewWatchlistName('');
        setLoading(false);
    };

    const handleWatchlistDelete = async (watchlistId) => {
        setLoading(true);
        dispatch(deleteWatchlist(watchlistId));
        dispatch(fetchWatchlists());
        setLoading(false);
    };

    const handleWatchlistEdit = async (watchlistId, newName) => {
        setLoading(true);
        dispatch(updateWatchlist(watchlistId, newName));
        setLoading(false);
        setIsEditing(0);
    }

    const handleWatchlistStockDelete = async (watchlistId, stockId) => {
        setLoading(true);
        // dispatch(deleteWatchlist(watchlistId));
        dispatch(removeStockFromWatchlistThunk(watchlistId, stockId));
        dispatch(fetchWatchlists());
        setLoading(false);
    };

  return (
    <div className='watchlist-container'>
      <h3>Lists</h3>
      <form onSubmit={(e) => handleWatchlistCreate(e)}>
        <input
          type="text"
          value={newWatchlistName}
          onChange={event => setNewWatchlistName(event.target.value)}
          minLength="1"
          maxLength="255"
          placeholder="Enter new watchlist name"
          />
          <button type="submit">Create Watchlist</button>
        </form>
          <div>
            {(watchlists.length > 0) &&
            watchlists?.map(watchlist => (
                <div className=''>
                    {
                        (!loading && watchlist?.id !== undefined && watchlist?.id !== null && watchlist?.id !== 0)  
                        ?
                        <div key={watchlist.id} className='watchlist-individual'>
                            <div className='watchlist-individual-name-buttons'>
                                {
                                    (isEditing !== watchlist.id) ?
                                    <div>
                                        <h4 className='watchlist-individual-header'>{watchlist.name}</h4>
                                    </div>
                                    :
                                    <div className='watchlist-individual-header'>
                                        <input
                                            type="text"
                                            value={edittedWatchlistName}
                                            onChange={event => setEdittedWatchlistName(event.target.value)}
                                            minLength="1"
                                            maxLength="255"
                                            placeholder="Enter new watchlist name"
                                        />
                                        <button className='watchlist-individual-button' onClick={() => handleWatchlistEdit(watchlist.id, edittedWatchlistName)}>
                                            <i className="fa-solid fa-check"></i>
                                        </button>
                                    </div>
                                }
                                <button className='watchlist-individual-header watchlist-individual-button'  onClick={() => {
                                    setEdittedWatchlistName(watchlist.name);
                                    setIsEditing(watchlist.id);
                                    }}>
                                    <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button className='watchlist-individual-header  watchlist-individual-button'  onClick={() => handleWatchlistDelete(watchlist.id)}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                            {/* <br></br> */}
                            <div className='watchlist-stock-list'>
                                {watchlist?.stocks?.map(stock => (
                                    <div key={stock.id} value={stock.id} className='watchlist-stock-individual'>
                                        <h6>
                                            {stock.symbol}
                                            &nbsp;
                                            -
                                            &nbsp;
                                            {stock.company_name}
                                            &nbsp;
                                        </h6>
                                        <button className='watchlist-stock-individual-button' onClick={() => handleWatchlistStockDelete(watchlist.id, stock.id)}>
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {/* <br></br>
                            <div>
                                <StockList watchlistId={watchlist.id}/>
                            </div> */}
                        </div>
                        :
                        <></>
    
                    }
                </div>
                
            ))}
          </div>
    </div>
          );
          };
          
export default Watchlists;