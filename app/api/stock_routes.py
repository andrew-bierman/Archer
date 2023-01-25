from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock, Holding, Transaction, News
from app.config import Config
import requests

stock_routes = Blueprint('stocks', __name__)

api_key = Config.AV_API_KEY

@stock_routes.route('/search/<string:query>')
def search_stocks(query):
    """
    Query the db for a stock by symbol and returns that data in a dictionary
    """
    stocks = Stock.query.filter(Stock.symbol.ilike(f'%{query}%')).all()

    return {'stocks': [stock.to_dict() for stock in stocks]}


@stock_routes.route('/search/db/<string:symbol>')
def get_stock_by_symbol(symbol):
    """
    Query the db for a stock by symbol and returns that data in a dictionary
    """
    stock = Stock.query.filter(Stock.symbol == symbol.upper()).first()

    # print('-------------')
    # print(stock.to_dict())

    if not stock:
        return {'message': 'Stock not found'}, 404

    return stock.to_dict()


@stock_routes.route('/all')
def get_all_stocks():
    """
    Query the db for all stocks and returns that data in a dictionary
    """
    stocks = Stock.query.all()

    return {'stocks': [stock.to_dict() for stock in stocks]}


@stock_routes.route('/data/<string:symbol>')
def get_stock_data_by_symbol(symbol):
    """
    Query the AV API for a stock by symbol and returns that data in a dictionary
    """
    func = request.args.get('func') or 'daily'

    if func == 'daily':
        func = 'TIME_SERIES_DAILY_ADJUSTED'
    elif func == 'minutely':
        func = 'TIME_SERIES_INTRADAY'
    else:
        func = 'TIME_SERIES_DAILY_ADJUSTED'

    interval = ''
    interval_string = ''
    if interval == 'minutely':
        interval_string  = '&interval=5min'

    url = 'https://www.alphavantage.co/query?' + 'function=TIME_SERIES_DAILY_ADJUSTED' + '&symbol=' + symbol + '&apikey=' + api_key + '&outputsize=full'

    res = requests.get(url).json()

    return res


@stock_routes.route('/company-info/<string:symbol>')
def get_company_info(symbol):
    """
    Query the AV API for a company info by symbol and returns that data in a dictionary
    """

    url = 'https://www.alphavantage.co/query?' + 'function=OVERVIEW' + '&symbol=' + symbol + '&apikey=' + api_key

    res = requests.get(url).json()

    if (res.keys().length == 0):
        return {'error': 'No company info found'}

    elif (res['error']):
        return {'error': res['error']}

    elif (res["Description"]):
        return res

    return res


