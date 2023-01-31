import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { openInNewTab } from "../utility";
import { getAllNewsForHomePage } from "../../store/news";

import "./HomePageNewsFeed.css";


const HomePageNewsFeed = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const allNews = useSelector((state) => state.news.allNews);

    useEffect(() => {
        setLoading(true);
        dispatch(getAllNewsForHomePage())
            .then(() => {
                setLoading(false);
            }
            );
    }, []);
    // const getNews = async () => {
    //     const response = await fetch("/api/news/external/all");
    //     const data = await response.json();
    //     return data['feed'];
    // };

    // let allNews

    // async function fetchData() {
    //     allNews = await getNews();
    //     if(allNews?.length > 0) {
    //         setLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     setLoading(true);
    //     if(allNews?.length === 0 || !allNews){
    //         fetchData();
    //     }
    //     // fetchData();

    // }, [allNews]);


    return (
        <div className="news-feed-container">
            <h1>News</h1>
            <div>
                {
                    (!loading && allNews?.length > 0) && allNews.map((article, idx) => {
                        return (
                            <div className='news-feed-individual-news' id={`${article.url}`}>
                                <div className="news-feed-individual-left-side">
                                    <h3 onClick={() => openInNewTab(article.url)}>{article.title}</h3>
                                    <h5>{article.source}</h5>
                                    <p>{article.summary}</p>
                                    <div className="news-feed-individual-ticker-row">
                                        {
                                            article.ticker_sentiment && article.ticker_sentiment.map((ticker) => {
                                                return (
                                                    <Link to={`/stocks/${ticker.ticker}`}>
                                                        <span>
                                                            {ticker.ticker}
                                                        </span>
                                                        &nbsp;
                                                    </Link>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="news-feed-individual-news-img-and-bookmark">
                                    <h1>
                                        <i className="fa-solid fa-bookmark"></i>
                                        <i className="fa-regular fa-bookmark"></i>
                                    </h1>
                                    <div className="news-feed-individual-news-img">
                                        <img src={article.banner_image} />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default HomePageNewsFeed;