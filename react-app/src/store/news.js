const GET_ALL_NEWS_FOR_HOMEPAGE = 'news/GET_ALL_NEWS_FOR_HOMEPAGE';
const GET_NEWS_FOR_STOCK_PAGE = 'news/GET_ALL_NEWS_FOR_HOMEPAGE';
const CREATE_AND_BOOKMARK_NEWS = 'news/CREATE_AND_BOOKMARK_NEWS';


const getAllNewsForHomePageAction = (news) => ({
    type: GET_ALL_NEWS_FOR_HOMEPAGE,
    payload: news
})

const getNewsForStockPageAction = (news) => ({
    type: GET_NEWS_FOR_STOCK_PAGE,
    payload: news
})

const createAndBookmarkNewsAction = (news) => ({
    type: CREATE_AND_BOOKMARK_NEWS,
    payload: news
})


export const getAllNewsForHomePage = () => async (dispatch) => {
    const response = await fetch('/api/news/external/all');
    if (response.ok) {
        const data = await response.json();
        console.log('data', data)
        dispatch(getAllNewsForHomePageAction(data));
    } else {
        console.log('Error fetching news');
    }
}

export const getNewsForStockPage = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/news/external/stock/${symbol}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getNewsForStockPageAction(data));
    } else {
        console.log('Error fetching news');
    }
}

export const createAndBookmarkNews = (news) => async (dispatch) => {
    const response = await fetch('/api/news/internal/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(news)
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createAndBookmarkNewsAction(data));
    } else {
        console.log('Error fetching news');
    }
}

const initialState = {
    allNews: [],
    singleStockNews: [],
    userBookmarkedNews: []
};

const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_NEWS_FOR_HOMEPAGE:
            return {
                ...state,
                allNews: action.payload.feed
            }

        case GET_NEWS_FOR_STOCK_PAGE:
            return {
                ...state,
                singleStockNews: action.payload.feed
            }

        case CREATE_AND_BOOKMARK_NEWS:
            return {
                ...state,
                userBookmarkedNews: [...state.userBookmarkedNews, action.payload]
            }
    
        default:
            return state;
    }
}

export default newsReducer;