import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWatchlists, createNewWatchlist, deleteWatchlist, fetchWatchlistById, updateWatchlist, addStockToWatchlistThunk, removeStockFromWatchlistThunk } from '../../store/watchlists';
import { getAllStocks } from '../../store/stockList';
import { useModal } from '../../context/Modal';
import StockList from '../StockList';
import './WatchListsStockPage.css';

const WatchlistsStockPage = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(0);
    const [edittedWatchlistName, setEdittedWatchlistName] = useState('');
    const { closeModal } = useModal();

    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [selectedWatchlists, setSelectedWatchlists] = useState([]);

    const watchlists = useSelector(state => state.watchlists.allWatchlists);
    const watchListIds = Object.keys(watchlists);

    const stockId = useSelector(state => state.stocks.singleStock.Info.id);
    const state = useSelector(state => state);

    const getDataAndPrecheck = async () => {
        setLoading(true);
        await dispatch(fetchWatchlists());
        await dispatch(getAllStocks());
        // preCheckWatchlists(stockId);
        setLoading(false);
    }

    useEffect(() => {
        getDataAndPrecheck();
    }, [dispatch]);

    // useEffect(() => {
    //     console.log(selectedWatchlists)
    // }, [selectedWatchlists])


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

    const handleListSelectionChange = (e) => {
        const { value } = e.target;
        if (selectedWatchlists.includes(value)) {
            setSelectedWatchlists(selectedWatchlists.filter(watchlistId => watchlistId !== value));
        } else {
            setSelectedWatchlists([...selectedWatchlists, value]);
        }
        // console.log(selectedWatchlists)
    }

    const handleAddStockToWatchlistSubmit = async (e) => {
        e.preventDefault();
        // console.log(selectedWatchlists)
        // setLoading(true);
        selectedWatchlists.forEach(watchlistId => {
            dispatch(addStockToWatchlistThunk(watchlistId, stockId));
        });
        dispatch(fetchWatchlists());
        // setLoading(false);
        closeModal();
    }

    // write a function that will precheck all the checkboxes that the stock is already in, and then when the user clicks add stock, it will add the stock to all the watchlists that are checked. If the user unchecks a box that the stock was previously in, it will remove the stock from that watchlist.

    const preCheckWatchlists = (stockId) => {
        let watchlists = [];
        watchListIds.forEach(watchlistId => {
            if (watchlists[watchlistId]?.stocks?.includes(stockId)) {
                watchlists.push(watchlistId)
            }
        })
        setSelectedWatchlists(watchlists);
    }

  return (
    <div className='watchlist-modal-container'>
      <p>Lists</p>
      <div className='watchlist-modal-create-watchlist-stock-page-button-and-input-container'>
        <form onSubmit={(e) => handleWatchlistCreate(e)}>
                <button type="submit">
                    <i className="fa-solid fa-plus"></i>
                </button>
                <input
                    type="text"
                    value={newWatchlistName}
                    onChange={event => setNewWatchlistName(event.target.value)}
                    minLength="1"
                    maxLength="255"
                    placeholder="Create Watchlist"
                    />
            </form>
      </div>
          <div>
            <form onSubmit={(e) => handleAddStockToWatchlistSubmit(e)}>
                <>
                    {(watchlists.length > 0) &&
                    watchlists?.map(watchlist => (
                        <>
                            {
                                (!loading && watchlist?.id !== undefined && watchlist?.id !== null && watchlist?.id !== 0)  
                                ?
                                <div key={watchlist.id} className='stock-page-watchlist-modal-watchlist-individual'>

                                    <label>
                                        <input type='checkbox' id={watchlist.id} value={watchlist.id} className='watchlist-modal-individual-checkbox' onChange={handleListSelectionChange}
                                        // checked={selectedWatchlists.includes(watchlist.id)}
                                        />
                                        {watchlist.name}
                                    </label>
                                    {/* <button>Add Stock</button> */}

                                </div>
                                :
                                <></>
                                
                            }
                        </>
                    ))}
                </>
            <button>Add Stock</button>
            </form>
                
          </div>
    </div>
          );
          };
          
export default WatchlistsStockPage;