# Archer 🏹

A Robinhood inspired application built with Flask, React/Redux, SQLAlchemy, and SocketIO. Archer is a real-time stock trading application that allows users to trade stocks, monitor their holdings, follow stock performance with watchlists, and stay up to date with financial news.


## ✨ Features
- Watchlists - create multiple watchlists, add and delete stocks from each one
- Portfolio/Holdings - view your current holdings, buy and sell stocks
- Bookmarks - save news articles to read later
- Bank Info - add your fictional bank info to make deposits and withdrawals
- Search - search for stocks by ticker or company name
- Dark Mode - toggle between dark and light mode
- Real-time - see your portfolio and watchlists update in real-time as you buy and sell stocks

## ⚡ Technologies Used
- Flask: Backend framework for building web applications.
- React: Frontend library for building user interfaces.
- Redux: State management library for React.
- Multiple Finance APIs: Application Programming Interface for fetching data.
- SQLAlchemy: Object-relational mapper for working with databases.
- PostgreSQL: Relational database management system.

## 🏠 Homepage
- [Archer](https://archer.onrender.com)

## 📺 Demo
- add Gif here when complete

## 🚀 Local Installation
1. Clone the repository

HTTPS:
```bash
git clone https://github.com/andrew-bierman/Archer.git
```
SSH:
```bash
git clone git@github.com:andrew-bierman/Archer.git
```

2. Install the dependencies
```bash
pipenv install -r requirements.txt
```

3. Create a .env file based on the example with proper settings for your development environment
```bash
SECRET_KEY= <your secret key>
DATABASE_URL=sqlite:///dev.db
SCHEMA=flask_schema
AV_API_KEY= <your Alpha Vantage API key>
TWELVE_API_KEY= <your Twelve Data API key>
```

4. Get into your pipenv, migrate your database, seed your database, and run your Flask app

```bash
pipenv shell
```

```bash
flask db upgrade
```

```bash
flask seed all
```

```bash
flask run
```

5. Change into the react-app directory

```bash
cd react-app
```

6. Install the dependencies
```bash
npm install
```

7. Start the application
```bash
npm start
```

5. Navigate to the application in your browser


## 💻 Usage
To use Archer, you need to sign up for an account (or use the demo user). You can then create and modify a watchlist, or trade stocks in real-time with your starter account balance. Once you have purchased stocks, you can view your portfolio and holdings. You can also save news articles to read later, and add your fictional bank info to make deposits and withdrawals.

## 📝 Documentation
- [Database Schema](https://github.com/andrew-bierman/Archer/wiki/DB-Schema)

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## ✏️ Author
- 👤 [andrew-bierman](https://github.com/andrew-bierman)


## 📋 License
Archer is released under the MIT License. See [MIT License](https://choosealicense.com/licenses/mit/) for details.
