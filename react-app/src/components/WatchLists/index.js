import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWatchlists, createNewWatchlist, deleteWatchlist, fetchWatchlistById, updateWatchlist, addStockToWatchlistThunk, removeStockFromWatchlistThunk } from '../../store/watchlists';
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
                <div className='watchlist-individual'>
                    {
                        (!loading && watchlist?.id !== undefined && watchlist?.id !== null && watchlist?.id !== 0)  
                        ?
                        <div key={watchlist.id} className='watchlist-individual-header flex-row'>
                            {
                                (isEditing !== watchlist.id) ?
                                 <h4>{watchlist.name}</h4>
                                 :
                                 <div>
                                     <input
                                        type="text"
                                        value={edittedWatchlistName}
                                        onChange={event => setEdittedWatchlistName(event.target.value)}
                                        minLength="1"
                                        maxLength="255"
                                        placeholder="Enter new watchlist name"
                                     />
                                     <button onClick={() => handleWatchlistEdit(watchlist.id, edittedWatchlistName)}>
                                        <i className="fa-solid fa-check"></i>
                                     </button>
                                 </div>
                            }
                            <button onClick={() => {
                                setEdittedWatchlistName(watchlist.name);
                                setIsEditing(watchlist.id);
                            }}>
                                <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button onClick={() => handleWatchlistDelete(watchlist.id)}>
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                            <br></br>
                            <select>
                                {watchlist?.stocks?.map(stock => (
                                    <option key={stock?.id} value={stock?.id}>
                                        {stock?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        :
                        <div></div>
    
                    }
                </div>
                
            ))}
          </div>
    </div>
          );
          };
          
export default Watchlists;