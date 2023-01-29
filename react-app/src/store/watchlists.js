// import { csrfFetch } from './csrf';


const GET_ALL_USER_WATCHLISTS = 'watchlists/FETCH_WATCHLISTS';
const CREATE_WATCHLIST = 'watchlists/CREATE_WATCHLIST';

const GET_WATCHLIST_BY_ID = 'watchlists/GET_WATCHLIST_BY_ID';
const UPDATE_WATCHLIST_BY_ID = 'watchlists/UPDATE_WATCHLIST';
const DELETE_WATCHLIST_BY_ID = 'watchlists/DELETE_WATCHLIST_BY_ID';

const ADD_STOCK_TO_WATCHLIST = 'watchlists/ADD_STOCK_TO_WATCHLIST';
const REMOVE_STOCK_FROM_WATCHLIST = 'watchlists/REMOVE_STOCK_FROM_WATCHLIST';

const GET_WATCHLIST_STOCK_DATA = 'watchlists/GET_WATCHLIST_STOCK_DATA';
const GET_WATCHLIST_STOCK_DATA_DAILY = 'watchlists/GET_WATCHLIST_STOCK_DATA_DAILY';

const getAllUserWatchlists = (watchlists) => ({
    type: GET_ALL_USER_WATCHLISTS,
    payload: watchlists
});

const createWatchlist = (newWatchlistName) => ({
    type: CREATE_WATCHLIST,
    payload: newWatchlistName
});

const getWatchlistById = (watchlist) => ({
    type: GET_WATCHLIST_BY_ID,
    payload: watchlist
});

const updateWatchlistById = (watchlist) => ({
    type: UPDATE_WATCHLIST_BY_ID,
    payload: watchlist
});

const deleteWatchlistById = (watchlistId) => ({
    type: DELETE_WATCHLIST_BY_ID,
    payload: watchlistId
});

const addStockToWatchlist = (watchlist) => ({
    type: ADD_STOCK_TO_WATCHLIST,
    payload: watchlist
});

const removeStockFromWatchlist = (watchlist) => ({
    type: REMOVE_STOCK_FROM_WATCHLIST,
    payload: watchlist
});

export const getWatchlistStockDataAction = (data) => ({
    type: GET_WATCHLIST_STOCK_DATA,
    payload: data
});

export const getWatchlistStockDataDailyAction = (data) => ({
    type: GET_WATCHLIST_STOCK_DATA_DAILY,
    payload: data
});


export const fetchWatchlists = () => async (dispatch) => {
    const response = await fetch('/api/watchlists/');
    if (response.ok) {
        const data = await response.json();
        dispatch(getAllUserWatchlists(data));
    } else {
        console.log('Error fetching watchlists');
    }
};

export const createNewWatchlist = (newWatchlistName) => async (dispatch) => {
    // console.log(newWatchlistName)

    const response = await fetch('/api/watchlists/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newWatchlistName
        })
    });


    if (response.ok) {
        const data = await response.json();
        dispatch(createWatchlist(data));
    } else {
        console.log('Error creating watchlist');
    }
};

export const fetchWatchlistById = (watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getWatchlistById(data));
    } else {
        console.log('Error fetching watchlist');
    }
};

export const updateWatchlist = (watchlistId, newName) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newName
        })
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateWatchlistById(data));
    } else {
        console.log('Error updating watchlist');
    }
};

export const deleteWatchlist = (watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        dispatch(deleteWatchlistById(watchlistId));
    } else {
        console.log('Error deleting watchlist');
    }
};

export const addStockToWatchlistThunk = (watchlistId, stockId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}/stocks/${stockId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(addStockToWatchlist(data));
    } else {
        console.log('Error adding stock to watchlist');
    }
};

export const removeStockFromWatchlistThunk = (watchlistId, stockId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}/stocks/${stockId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(removeStockFromWatchlist(data));
    } else {
        console.log('Error removing stock from watchlist');
    }
};

export const getWatchlistStockData = (stockSymbol) => async (dispatch) => {
    if (!stockSymbol) return;
    if(typeof stockSymbol !== 'string') return;

    const response = await fetch(`api/stocks/data/current/${stockSymbol}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getWatchlistStockDataAction(data));
        return data
    } else {
        console.log('Error fetching watchlist stock data');
    }
};

export const getWatchlistStockDataDaily = (stockSymbol) => async (dispatch) => {
    if (!stockSymbol) return;
    if(typeof stockSymbol !== 'string') return;

    // console.log('stockSymbol in data thunk', stockSymbol)

    const response = await fetch(`api/stocks/data/time-series/${stockSymbol}/1D`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getWatchlistStockDataDailyAction(data));
        return data
    } else {
        console.log('Error fetching watchlist stock data');
    }
};

  
const initialState = {
    allWatchlists: [],
    currentWatchlist: {},
    watchlistStockData: {}
};

const watchlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_USER_WATCHLISTS:
            return {
                ...state,
                allWatchlists: action.payload.watchlists
            }
        case CREATE_WATCHLIST:
            return {
                ...state,
                allWatchlists: [...state.allWatchlists, action.payload.watchlists]
            }
        case GET_WATCHLIST_BY_ID:
            return {
                ...state,
                currentWatchlist: action.payload
            }
        case UPDATE_WATCHLIST_BY_ID:
            return {
                ...state,
                allWatchlists: state.allWatchlists.map(watchlist => {
                    if (watchlist.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return watchlist;
                    }
                })
            }
        case DELETE_WATCHLIST_BY_ID:
            return {
                ...state,
                allWatchlists: state.allWatchlists.filter(watchlist => watchlist.id !== action.payload)
            }
        case ADD_STOCK_TO_WATCHLIST:
            return {
                ...state,
                allWatchlists: state.allWatchlists.map(watchlist => {
                    if (watchlist.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return watchlist;
                    }
                })
            }
        case REMOVE_STOCK_FROM_WATCHLIST:
            return {
                ...state,
                allWatchlists: state.allWatchlists.map(watchlist => {
                    if (watchlist.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return watchlist;
                    }
                })
            }
        case GET_WATCHLIST_STOCK_DATA:
            return {
                ...state,
                watchlistStockData: {
                    ...state.watchlistStockData,
                    [action.payload.symbol]: {
                        ...state.watchlistStockData[action.payload.symbol],
                        Info: action.payload
                    }
                }
            }
        case GET_WATCHLIST_STOCK_DATA_DAILY:
            console.log('action.payload in reducer', action.payload)
            return {
                ...state,
                watchlistStockData: {
                    ...state.watchlistStockData,
                    [action.payload.meta.symbol]: {
                        ...state.watchlistStockData[action.payload.meta.symbol],
                        dailyData: action.payload.values
                    }
                }
            }

        default:
            return state;
    }
}

export default watchlistReducer;