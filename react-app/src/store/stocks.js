const GET_ALL_STOCKS_FROM_DB = 'stockList/GET_ALL_STOCKS_FROM_DB';
const GET_SINGLE_STOCK_INFO_FROM_DB = 'stockList/GET_SINGLE_STOCK_INFO_FROM_DB';
const GET_SINGLE_STOCK_DATA = 'stockList/GET_SINGLE_STOCK_DATA_FROM_API';
const GET_SINGLE_STOCK_CURRENT_PRICE = 'stockList/GET_SINGLE_STOCK_CURRENT_PRICE';

const getAllStocksFromDB = (stocks) => ({
    type: GET_ALL_STOCKS_FROM_DB,
    payload: stocks
});

const getSingleStockInfoFromDB = (stock) => ({
    type: GET_SINGLE_STOCK_INFO_FROM_DB,
    payload: stock
});

const getSingleDataStock = (stock) => ({
    type: GET_SINGLE_STOCK_DATA,
    payload: stock
});

const getSingleStockCurrentPrice = (data) => ({
    type: GET_SINGLE_STOCK_CURRENT_PRICE,
    payload: data
});

export const getAllStocks = () => async (dispatch) => {
    const response = await fetch('/api/stocks/all');
    if (response.ok) {
        const data = await response.json();
        dispatch(getAllStocksFromDB(data.stocks));
    } else {
        console.log('Error fetching stocks');
    }
}

export const getSingleStockInfo = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/search/db/${symbol}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getSingleStockInfoFromDB(data));
        return data;
    } else {
        console.log('Error fetching stock');
    }
}

export const getSingleStockDataFromAPI = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/data/${symbol}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getSingleDataStock(data));
        return data;

    } else {
        console.log('Error fetching stock');
    }
}

export const getSingleStockCurrentPriceFromAPI = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/data/current/${symbol}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getSingleStockCurrentPrice(data));
        return data;

    } else {
        console.log('Error fetching stock');
    }
}

const initialState = {
    allStocks: {
        byId: {},
    },
    singleStock: {
        Info: {},
        CurrentPrice: {},
        Data: {}
    }
};

const stockListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_STOCKS_FROM_DB:
            return {
                ...state,
                allStocks: {
                    ...state.allStocks,
                    byId: action.payload
                }
        }
        case GET_SINGLE_STOCK_DATA:
            return {
                ...state,
                singleStock: {
                    ...state.singleStock,
                    Data: action.payload
                }
            }
        case GET_SINGLE_STOCK_INFO_FROM_DB:
            return {
                ...state,
                singleStock: {
                    ...state.singleStock,
                    Info: action.payload
                }
            }

        case GET_SINGLE_STOCK_CURRENT_PRICE:
            return {
                ...state,
                singleStock: {
                    ...state.singleStock,
                    CurrentPrice: action.payload
                }
            }

    
        default:
            return state;
    }
}

export default stockListReducer;