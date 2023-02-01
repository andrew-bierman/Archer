import React from "react"
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { openInNewTab } from "../utility";
import { getAllNewsForHomePage } from "../../store/news";
import './NewsCard.css';

const NewsCard = ({ article }) => {
    return (
        <div className='news-feed-individual-news' id={`${article.url}`}>
            <div className="news-feed-individual-left-side">
                <div className="news-feed-individual-left-side-text">
                    <h5>{article.source}</h5>
                </div>
                <div className="news-feed-individual-left-side-text">
                    <h5 onClick={() => openInNewTab(article.url)}>{article.title}</h5>
                </div>
                <div className="news-feed-individual-left-side-text">
                    <p>{article.summary}</p>
                </div>
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
                <span>
                    <i className="fa-solid fa-bookmark"></i>
                    <i className="fa-regular fa-bookmark"></i>
                </span>
                <div className="news-feed-individual-news-img">
                    <img src={article.banner_image} />
                </div>
            </div>
        </div>
    )
}

export default NewsCard