from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock, Holding, News
from app.config import Config
import requests
import time
from datetime import datetime, timedelta
import finnhub
import pytz
import pandas_market_calendars as mcal
import pandas as pd

stock_routes = Blueprint('stocks', __name__)

av_api_key = Config.AV_API_KEY
twelve_api_key = Config.TWELVE_API_KEY
twelve_native_api_key = Config.TWELVE_NATIVE_API_KEY
finn_hub_api_key = Config.FINN_HUB_API_KEY

# Setup client
finnhub_client = finnhub.Client(api_key=finn_hub_api_key)

@stock_routes.route('/search/<string:query>')
def search_stocks(query):
    """
    Query the db for a stock by symbol and returns that data in a dictionary
    """

    #  this filters stocks by symbol or company name (case insensitive) and prioritize symbol matches over company name matches

    stocks = Stock.query.filter(Stock.symbol.ilike(f'%{query}%')).all()
    stocks += Stock.query.filter(Stock.symbol.ilike(f'%{query}%') == False, Stock.company_name.ilike(f'%{query}%')).all()

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



@stock_routes.route('/search/db/id/<int:stock_id>')
def get_stock_by_id(stock_id):
    """
    Query the db for a stock by id and returns that data in a dictionary
    """
    stock = Stock.query.filter(Stock.id == stock_id).first()

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

    return {
        'stocks': [stock.to_dict() for stock in stocks],
        'byId': [stock.to_dict() for stock in stocks]
    }


@stock_routes.route('/data/finn-hub/current/<string:symbol>')
def get_current_stock_data_by_symbol_finn_hubb(symbol):
    """
    Query the FinnHUb API for a stock by symbol and returns that data in a dictionary
    """

    retries = 3
    while retries > 0:
        try:
            time.sleep(1)

            # trying to use requests package instead of finnhub client

            # url = "https://finnhub.io/api/v1/quote?symbol={}&token={}".format(symbol, finn_hub_api_key)

            url = "https://finnhub.io/api/v1/quote"

            querystring = {
                "symbol": symbol,
                "token": finn_hub_api_key
            }

            res = requests.get(url, params=querystring).json()


            # finnhub client method
            '''
            res = finnhub_client.quote(symbol)

            # if res.status_code != 200:
            #     return {'message': 'Stock not found'}, 404

            print('finn hub res', res)

            '''
            print('finn hub res', res)
            
            return res

        except Exception as e:
            retries -= 1
            if retries == 0:
                print (f'Error fetching data for symbol {symbol}: {e}')
                return {'message': f'Error fetching data for symbol {symbol}: {e}'}, 500
            time.sleep(1)
    
    # return res


@stock_routes.route('/data/current/<string:symbol>')
def get_current_stock_data_by_symbol(symbol):
    """
    Query the TWELVE API for a stock by symbol and returns that data in a dictionary
    """
    url = "https://twelve-data1.p.rapidapi.com/quote"

    querystring = {
        "symbol": symbol,
        "interval":"5min",
        "outputsize":"288",
        "format":"json"
    }

    headers = {
        "X-RapidAPI-Key": twelve_api_key,
        "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
    }

    res = requests.get(url, headers=headers, params=querystring).json()

    # if res.status_code != 200:
    #     return {'message': 'Stock not found'}, 404

    return res



'''
@stock_routes.route('/data/time-series/<string:symbol>/<string:filter>')
def get_timeseries_stock_data_by_symbol(symbol, filter):
    """
    Query the TWELVE API for a stock by symbol and returns that data in a dictionary
    """
    useRapid = True
    delay = 0

    # filter = request.args.get('filter') or '1D'
    if not filter:
        filter = '1D'

    # interval = request.args.get('interval') or '5min'
    # outputsize = request.args.get('outputsize') or '288'

    if filter == '1D':
        interval = '5min'
        outputsize = '288'
    elif filter == '1W':
        interval = '1h'
        outputsize = '168'
    elif filter == '1M':
        interval = '1h'
        outputsize = '720'
    elif filter == '3M':
        interval = '1day'
        outputsize = '90'
    elif filter == '1Y':
        interval = '1day'
        outputsize = '365'
    elif filter == '5Y':
        interval = '1day'
        outputsize = '1825'
    else:
        interval = '5min'
        outputsize = '288'

    if filter == '1D':
        delay = 0.01
    else:
        delay = 0.1

    time.sleep(0.5)

    if not useRapid:

        # url = "https://twelve-data1.p.rapidapi.com/time_series"
        url = 'https://api.twelvedata.com/time_series'

        querystring = {
            "symbol": symbol,
            "interval": interval,
            "outputsize": outputsize,
            "format":"json",
            "apikey": twelve_native_api_key
        }

        # headers = {
        #     "X-RapidAPI-Key": twelve_api_key,
        #     "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
        # }

        # res = requests.get(url, headers=headers, params=querystring).json()
        res = requests.get(url, params=querystring, timeout=20).json()

        # if res.status_code != 200:
        #     return {'message': 'Stock not found'}, 404

        # print('RESPONSE FOR STOCK DATA ------', res)

    else: 
        url = "https://twelve-data1.p.rapidapi.com/time_series"

        querystring = {
            "symbol": symbol,
            "interval": interval,
            "outputsize": outputsize,
            "format":"json"
        }

        headers = {
            "X-RapidAPI-Key": twelve_api_key,
            "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
        }

        res = requests.get(url, headers=headers, params=querystring).json()

        # if res.status_code != 200:
        #     return {'message': 'Stock not found'}, 404

        if 'message' in res:
            return {'message': 'Minutely API Limit Reached'}, 429

        # print('RESPONSE FOR STOCK DATA ------', res)


    # filtering data in python attempt
    def process_time_series_data(time_series_data, filter):
        # print('time_series_data', time_series_data)

        filtered_data = []
        market_tz = pytz.timezone('US/Eastern')
        
        # now = datetime.now(tz=market_tz)
        now = datetime.now()
        is_market_open = (now.weekday() < 5 and 9 <= now.hour < 16)

        # Get holidays
        # Get calendar and timezone objects
        # nyse = mcal.get_calendar('NYSE')
        # market_tz = pytz.timezone('US/Eastern')

        # # Set start and end dates using pandas date_range function
        # date_range = pd.date_range(end=pd.Timestamp.now(tz=market_tz), periods=7, freq='D')
        # start_date, end_date = date_range.min(), date_range.max()

        # # Get market schedule and holidays
        # schedule = nyse.schedule(start_date, end_date)
        # start_dates = schedule['market_open'].values
        # end_dates = schedule['market_close'].values
        # # holidays = nyse.holidays(start_dates, end_dates)

        # print('schedule', schedule)
        # print('schedule.index', schedule.index)
        # schedule_index = schedule.index
        # # Convert schedule index to DateTimeIndex
        # # schedule_index = pd.DatetimeIndex(schedule.index)

        # # Get market holidays
        # holidays = nyse.holidays()
        # print('holidays', holidays)

        # Convert holidays to list of date strings
        # holiday_dates = [str(holiday.date(1)) for holiday in holidays]

        holiday_dates = {
            "2023": [
                "2023-01-02",
                "2023-01-16",
                "2023-02-20",
                "2023-04-14",
                "2023-05-29",
                "2023-07-04",
                "2023-09-04",
                "2023-11-23",
                "2023-12-25"
            ],
            "2024": [
                "2024-01-01",
                "2024-01-15",
                "2024-02-19",
                "2024-03-29",
                "2024-05-27",
                "2024-07-04",
                "2024-09-02",
                "2024-11-28",
                "2024-12-25"
            ],
            "2025": [
                "2025-01-01",
                "2025-01-20",
                "2025-02-17",
                "2025-04-18",
                "2025-05-26",
                "2025-07-04",
                "2025-09-01",
                "2025-11-27",
                "2025-12-25"
            ],
            "2026": [
                "2026-01-01",
                "2026-01-19",
                "2026-02-16",
                "2026-04-03",
                "2026-05-25",
                "2026-07-03",
                "2026-09-07",
                "2026-11-26",
                "2026-12-25"
            ],
            "2027": [
                "2027-01-01",
                "2027-01-18",
                "2027-02-15",
                "2027-04-16",
                "2027-05-31",
                "2027-07-05",
                "2027-09-06",
                "2027-11-25",
                "2027-12-24"
            ],
            "2028": [
                "2028-01-17",
                "2028-02-21",
                "2028-04-07",
                "2028-05-29",
                "2028-07-04",
                "2028-09-04",
                "2028-11-23",
                "2028-12-25"
            ],
            "2029": [
                "2029-01-01",
                "2029-01-15",
                "2029-02-19",
                "2029-03-30",
                "2029-05-28",
                "2029-07-04",
                "2029-09-03",
                "2029-11-22",
                "2029-12-25"
            ],
            "2030": [
                "2030-01-01",
                "2030-01-21",
                "2030-02-18",
                "2030-04-19",
                "2030-05-27",
                "2030-07-04",
                "2030-09-02",
                "2030-11-28",
                "2030-12-25"
            ],
                "2031": [
                "2031-01-01",
                "2031-01-20",
                "2031-02-17",
                "2031-04-11",
                "2031-05-26",
                "2031-07-04",
                "2031-09-01",
                "2031-11-27",
                "2031-12-25"
            ],
            "2032": [
                "2032-01-01",
                "2032-01-19",
                "2032-02-16",
                "2032-03-26",
                "2032-05-31",
                "2032-07-05",
                "2032-09-06",
                "2032-11-25",
                "2032-12-24"
            ],
            "2033": [
                "2033-01-17",
                "2033-02-21",
                "2033-04-15",
                "2033-05-30",
                "2033-07-04",
                "2033-09-05",
                "2033-11-24",
                "2033-12-26"
            ],
            "2034": [
                "2034-01-02",
                "2034-01-16",
                "2034-02-20",
                "2034-04-07",
                "2034-05-29",
                "2034-07-04",
                "2034-09-04",
                "2034-11-23",
                "2034-12-25"
            ],
        }
            



        # If it's a Saturday, subtract 1 day to get to Friday
        if now.weekday() == 5:
            now -= timedelta(days=1)
        # If it's a Sunday, subtract 2 days to get to Friday
        elif now.weekday() == 6:
            now -= timedelta(days=2)
                    #         # If it's Monday before market open, subtract 3 days to get to Friday
        elif now.weekday() == 0 and now.hour < 9:
            now -= timedelta(days=3)
        # Check if now is a holiday or weekend
        elif now.weekday() >= 5 or str(now.date()) in holiday_dates[str(now.year)]:
            # if today is a holiday and a weekday, get the most recent stock day
            while str(now.date()) in holiday_dates[str(now.year)]:
                now -= timedelta(days=1)
        # If it's a weekday before market open, subtract 1 day to get to yesterday
        elif now.hour < 9 and now.weekday() < 5:
            now -= timedelta(days=1)
        else:
            is_market_open = (now.weekday() < 5 and 9 <= now.hour < 16)

        # date = now.astimezone(market_tz)
        date = now

        for item in time_series_data:
            # date_in_question = datetime.strptime(item['datetime'], '%Y-%m-%d %H:%M:%S').replace(tzinfo=market_tz)
            date_in_question = datetime.strptime(item['datetime'], '%Y-%m-%d %H:%M:%S')

            if filter == '1D':
                day = date.weekday()
                hour = date.hour
                if day == 6:
                    # start_date = datetime(date.year, date.month, date.day - 2, 9, 30, tzinfo=market_tz)
                    # end_date = datetime(date.year, date.month, date.day - 2, 16, 0, tzinfo=market_tz)
                    start_date = datetime(date.year, date.month, date.day - 2, 9, 30)
                    end_date = datetime(date.year, date.month, date.day - 2, 16, 0)
                elif day == 5 or (day < 5 and hour < 9):
                    # start_date = datetime(date.year, date.month, date.day - 1, 9, 30, tzinfo=market_tz)
                    # end_date = datetime(date.year, date.month, date.day - 1, 16, 0, tzinfo=market_tz)
                    start_date = datetime(date.year, date.month, date.day - 1, 9, 30)
                    end_date = datetime(date.year, date.month, date.day - 1, 16, 0)
                else:
                    # start_date = datetime(date.year, date.month, date.day, 9, 30, tzinfo=market_tz)
                    # end_date = datetime(date.year, date.month, date.day, 16, 0, tzinfo=market_tz)
                    start_date = datetime(date.year, date.month, date.day, 9, 30)
                    end_date = datetime(date.year, date.month, date.day, 16, 0)
                

                if start_date <= date_in_question <= end_date:
                    print(f"start_date: {start_date}, end_date: {end_date}, date_in_question: {date_in_question}")
                    filtered_data.append(item)

            elif filter == '1W':
                start_date = date - timedelta(days=7)
                # start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=market_tz)
                # end_date = datetime(date.year, date.month, date.day, 23, 59, tzinfo=market_tz)
                start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
                end_date = datetime(date.year, date.month, date.day, 23, 59)
                if start_date <= date_in_question <= end_date:
                    filtered_data.append(item)
            elif filter == '1M':
                if date.month == 1:
                    # start_date = datetime(date.year - 1, 12, date.day, 0, 0, tzinfo=market_tz)
                    start_date = datetime(date.year - 1, 12, date.day, 0, 0)
                else:
                    # start_date = datetime(date.year, date.month - 1, date.day, 0, 0, tzinfo=market_tz)
                    start_date = datetime(date.year, date.month - 1, date.day, 0, 0)
                # end_date = datetime(date.year, date.month, date.day, 23, 59, tzinfo=market_tz)
                end_date = datetime(date.year, date.month, date.day, 23, 59)
                if start_date <= date_in_question <= end_date:
                    filtered_data.append(item)
            elif filter == '3M':
                if date.month <= 3:
                    # start_date = datetime(date.year - 1, 12 + (date.month - 3), date.day, 0, 0, tzinfo=market_tz)
                    start_date = datetime(date.year - 1, 12 + (date.month - 3), date.day, 0, 0)
                else:
                    # start_date = datetime(date.year, date.month - 3, date.day, 0, 0, tzinfo=market_tz)
                    start_date = datetime(date.year, date.month - 3, date.day, 0, 0)
                # end_date = datetime(date.year, date.month, date.day, 23, 59, tzinfo=market_tz)
                end_date = datetime(date.year, date.month, date.day, 23, 59)
            elif filter == '1Y':
                # start_date = datetime(date.year - 1, date.month, date.day, 0, 0, tzinfo=market_tz)
                # end_date = datetime(date.year, date.month, date.day, 23, 59, tzinfo=market_tz)
                start_date = datetime(date.year - 1, date.month, date.day, 0, 0)
                end_date = datetime(date.year, date.month, date.day, 23, 59)
            elif filter == '5Y':
                if date.month <= 12:
                    # start_date = datetime(date.year - 5, date.month, date.day, 0, 0, tzinfo=market_tz)
                    start_date = datetime(date.year - 5, date.month, date.day, 0, 0)
                else:
                    # start_date = datetime(date.year - 5, date.month - 12, date.day, 0, 0, tzinfo=market_tz)
                    start_date = datetime(date.year - 5, date.month - 12, date.day, 0, 0)
                # end_date = datetime(date.year, date.month, date.day, 23, 59, tzinfo=market_tz)
                end_date = datetime(date.year, date.month, date.day, 23, 59)
            else:
                # start_date = datetime(date.year, date.month, date.day - 1, 0, 0, tzinfo=market_tz)
                # end_date = datetime(date.year, date.month, date.day, 23, 59, tzinfo=market_tz)
                start_date = datetime(date.year, date.month, date.day - 1, 0, 0)
                end_date = datetime(date.year, date.month, date.day, 23, 59)

            if start_date <= date_in_question <= end_date:
                filtered_data.append(item)


        print ('FILTERED DATA', filtered_data)
        # filtered_data.reverse()  # Reverse the order of the data
        filtered_data.sort(key=lambda x: datetime.strptime(x['datetime'], '%Y-%m-%d %H:%M:%S'))
        if datetime.strptime(filtered_data[0]['datetime'], '%Y-%m-%d %H:%M:%S') > datetime.strptime(filtered_data[-1]['datetime'], '%Y-%m-%d %H:%M:%S'):
            filtered_data.reverse()
            print ('without reverse')

        return filtered_data

    if 'values' in res and res['values']:
        price = None

        if len(res['values']) == 0:
            return {'message': 'Stock not found'}, 404

        if len(res['values']) == 0:
            price = None
        if not all(key in res['values'][-1] for key in ['close']):
            price = None

        # print(res)

        res['values'] = process_time_series_data(res['values'], filter)

        if price is not None:
            res['currentPriceMath'] = {
                'price': price,
                'percentChange': round((float(price) - float(res['values'][0]['close'])) / float(res['values'][0]['close']) * 100, 2)
            }
        # else:
        #     res['currentPriceMath'] = {
        #         'price': None,
        #         'percentChange': None
        #     }
    
    time.sleep(delay)

    return res
'''


'''
'''
@stock_routes.route('/data/time-series/<string:symbol>/<string:filter>')
def get_timeseries_stock_data_by_symbol(symbol, filter):
    """
    Query the TWELVE API for a stock by symbol and returns that data in a dictionary
    """
    useRapid = True
    delay = 0

    # filter = request.args.get('filter') or '1D'
    if not filter:
        filter = '1D'

    # interval = request.args.get('interval') or '5min'
    # outputsize = request.args.get('outputsize') or '288'

    if filter == '1D':
        interval = '5min'
        outputsize = '288'
    elif filter == '1W':
        interval = '1h'
        outputsize = '168'
    elif filter == '1M':
        interval = '1h'
        outputsize = '720'
    elif filter == '3M':
        interval = '1day'
        outputsize = '90'
    elif filter == '1Y':
        interval = '1day'
        outputsize = '365'
    elif filter == '5Y':
        interval = '1day'
        outputsize = '1825'
    else:
        interval = '5min'
        outputsize = '288'

    if filter == '1D':
        delay = 0.5
    else:
        delay = 1

    time.sleep(0.05)

    if not useRapid:

        # url = "https://twelve-data1.p.rapidapi.com/time_series"
        url = 'https://api.twelvedata.com/time_series'

        querystring = {
            "symbol": symbol,
            "interval": interval,
            "outputsize": outputsize,
            "format":"json",
            "apikey": twelve_native_api_key
        }

        # headers = {
        #     "X-RapidAPI-Key": twelve_api_key,
        #     "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
        # }

        # res = requests.get(url, headers=headers, params=querystring).json()
        res = requests.get(url, params=querystring, timeout=20).json()

        # if res.status_code != 200:
        #     return {'message': 'Stock not found'}, 404

        # print('RESPONSE FOR STOCK DATA ------', res)

    else: 
        url = "https://twelve-data1.p.rapidapi.com/time_series"

        querystring = {
            "symbol": symbol,
            "interval": interval,
            "outputsize": outputsize,
            "format":"json"
        }

        headers = {
            "X-RapidAPI-Key": twelve_api_key,
            "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
        }

        res = requests.get(url, headers=headers, params=querystring).json()

        # if res.status_code != 200:
        #     return {'message': 'Stock not found'}, 404

        if 'message' in res:
            return {'message': 'Minutely API Limit Reached'}, 429

        # print('RESPONSE FOR STOCK DATA ------', res)

    time.sleep(delay)

    return res


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

    url = 'https://www.alphavantage.co/query?' + 'function=TIME_SERIES_DAILY_ADJUSTED' + '&symbol=' + symbol + '&apikey=' + av_api_key + '&outputsize=full'

    res = requests.get(url).json()

    return res


@stock_routes.route('/company-info/<string:symbol>')
def get_company_info(symbol):
    """
    Query the AV API for a company info by symbol and returns that data in a dictionary
    """

    url = 'https://www.alphavantage.co/query?' + 'function=OVERVIEW' + '&symbol=' + symbol + '&apikey=' + av_api_key

    res = requests.get(url).json()

    # print(res)

    # if (res.keys().length == 0):
    #     return {'error': 'No company info found'}

    if (res.keys() == 0):
        return {'error': 'No company info found'}

    elif 'error' in res:
        return {'error': res['error']}

    elif 'Description' in res:
        return res

    time.sleep(1)

    return res


