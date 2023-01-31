from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock, Holding, News
from app.config import Config
import requests

news_routes = Blueprint('news', __name__)

av_api_key = Config.AV_API_KEY


@news_routes.route('/search/<string:symbol>')
def search_news(symbol):
    """
    Query the db for a stock by symbol and returns that data in a dictionary
    """

    #  this filters stocks by symbol or company name (case insensitive) and prioritize symbol matches over company name matches

    news = News.query.filter(News.symbol.ilike(f'%{symbol}%')).all()
    news += News.query.filter(News.symbol.ilike(f'%{symbol}%') == False, News.company_name.ilike(f'%{symbol}%')).all()

    return {'news': [new.to_dict() for new in news]}


@news_routes.route('/search/db/<string:symbol>')
def get_news_by_symbol(symbol):
    """
    Query the db for a stock by symbol and returns that data in a dictionary
    """
    news = News.query.filter(News.symbol == symbol.upper()).first()

    # print('-------------')
    # print(stock.to_dict())

    if not news:
        return {'message': 'News not found'}, 404

    return news.to_dict()


# @news_routes.route('/external/<string:symbol>')
# def get_external_news(symbol):
#     """
#     Query the API for a stock by symbol and returns that data in a dictionary
#     """
#     'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo'
#     url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={symbol}&apikey={av_api_key}"
    
#     response = requests.get(url)
#     data = response.json()

#     # check the db to make sure the URL is not already in the db, if not then add to db
    



#     return data


@news_routes.route('/external/all')
def get_all_external_news():
    """
    Query the db for a stock by symbol and returns that data in a dictionary
    """
    # 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo'
    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey={av_api_key}"
    
    response = requests.get(url)
    data = response.json()

    print(data)

    if 'feed' not in data:
        return {'message': 'No news found'}, 404

    feed = data['feed']

    # # add each article to the db, if the article URL is not already in the db
    # for article in feed:
    #     url = article['url']
    #     if not News.query.filter(News.url == url).first():
    #         new = News(
    #             # symbol=article['symbol'],
    #             # company_name=article['company_name'],
    #             url=article['url'],
    #             title=article['title'],
    #             text=article['summary'],
    #             image=article['banner_image'],
    #         )
    #         db.session.add(new)
    #         db.session.commit()


    return data

