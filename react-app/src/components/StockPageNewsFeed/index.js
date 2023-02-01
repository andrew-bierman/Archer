import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { openInNewTab } from "../utility";
import { getAllNewsForHomePage } from "../../store/news";
import NewsCard from "../NewsCard";

import "./StockPageNewsFeed.css";


const StockPageNewsFeed = () => {
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

    return (
        <div className="news-feed-container">
            <div className="news-feed-header">
                <h2>News</h2>
            </div>
            <div>
                {
                    (!loading && allNews?.length > 0) && allNews.map((article, idx) => {
                        return (
                            <NewsCard article={article} key={idx} />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default StockPageNewsFeed;