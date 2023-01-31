const GET_ALL_NEWS_FOR_HOMEPAGE = 'news/GET_ALL_NEWS_FOR_HOMEPAGE';

const getAllNewsForHomePageAction = (news) => ({
    type: GET_ALL_NEWS_FOR_HOMEPAGE,
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

const initialState = {};

const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_NEWS_FOR_HOMEPAGE:
            return {
                ...state,
                allNews: action.payload.feed
            }
        default:
            return state;
    }
}

export default newsReducer;