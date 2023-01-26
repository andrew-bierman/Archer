from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock, Holding, News

holding_routes = Blueprint('holdings', __name__)

@holding_routes.route('/')
@login_required
def get_user_holdings():
    """
    Query for all User holdings and returns them in a list of holding dictionaries
    """
    holdings = Holding.query.filter(Holding.user_id == current_user.id).all()
    holding_list = []
    for holding in holdings:
        holding_list.append(holding.to_dict())
    return {'holdings': holding_list}



@holding_routes.route('/', methods=['POST'])
@login_required
def create_holding():
    """
    Creates a new holding and returns that holding in a dictionary
    """
    stock_id = request.json['stock_id']
    quantity = request.json['quantity']
    stock_price = request.json['stock_price']

    # Retrieve the current user's buying power
    user = User.query.get(current_user.id)
    buying_power = user.buying_power

    # Check if the user already has a holding for this stock
    holding = Holding.query.filter(Holding.stock_id == stock_id, Holding.user_id == current_user.id).first()
    if holding:
        return jsonify({'message': "Holding already exists", 'statusCode': 400}), 400

    # Check if the user is trying to purchase a negative amount of stock
    if float(quantity) < 0:
        return jsonify({'message': "Invalid quantity", 'statusCode': 400}), 400
    
    # Check if stock exists
    stock = Stock.query.get(stock_id)
    if not stock:
        return jsonify({'message': "Stock does not exist", 'statusCode': 400}), 400

    # Calculate the cost of the stock
    cost = float(stock_price) * float(quantity)

    # Check if the user has enough buying power to purchase the stock
    if cost > buying_power:
        return jsonify({'message': "Not enough buying power", 'statusCode': 400}), 400

    holding = Holding(
        stock_id=stock_id,
        user_id=current_user.id,
        shares=quantity,
        avg_cost=stock_price
    )

    holding.stock.append(stock)

    # Update the user's buying power
    user.buying_power -= cost
    db.session.add(holding)
    db.session.commit()

    return holding.to_dict()


@holding_routes.route('/<int:holding_id>', methods=['DELETE'])
@login_required
def delete_holding(holding_id):
    """
    Query for a holding by id, and delete that holding
    """
    holding = Holding.query.get(holding_id)

    # Check if the user is authorized to delete this holding
    if holding.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    stock_price = request.json['stock_price']
    shares = holding.shares
    revenue = float(stock_price) * float(shares)

    # Retrieve the current user
    user = User.query.get(current_user.id)

    # Add the revenue to the user's buying power
    user.buying_power += revenue

    db.session.delete(holding)
    db.session.commit()
    return holding.to_dict()


@holding_routes.route('/symbol/<string:symbol>')
@login_required
def get_holdings_by_symbol(symbol):
    """
    Query for all holdings of a specific stock symbol and returns them in a list of holding dictionaries
    """
    stock = Stock.query.filter_by(symbol=symbol).first()
    if stock:
        holdings = Holding.query.filter(Holding.stock_id == stock.id, Holding.user_id == current_user.id).all()
        if holdings:
            return {'holdings': [holding.to_dict() for holding in holdings]}
        else:
            return jsonify({'message': "No holdings for this stock and user", 'statusCode': 404}), 404
    else:
        return jsonify({'message': "Stock not found", 'statusCode': 404}), 404



@holding_routes.route('/<int:holding_id>')
@login_required
def get_holding_by_id(holding_id):
    """
    Query for a holding by id and returns that holding in a dictionary
    """
    holding = Holding.query.get(holding_id)

    # Check if the user is authorized to view this holding
    if holding.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    return holding.to_dict()


@holding_routes.route('/<int:holding_id>', methods=['PUT'])
@login_required
def update_holding_quantity(holding_id):
    """
    Query for a holding by id, and update the quantity of that holding
    """
    holding = Holding.query.get(holding_id)

    # Check if the user is authorized to edit this holding
    if holding.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    # Retrieve the current user
    user = User.query.get(current_user.id)
    buying_power = user.buying_power
    new_quantity = request.json['quantity']
    stock_price = request.json['stock_price']
    old_quantity = holding.quantity
    cost = float(stock_price) * (float(new_quantity) - float(old_quantity))
    if new_quantity > old_quantity:
        if cost > buying_power:
            return jsonify({'message': "Not enough buying power", 'statusCode': 400}), 400
        user.buying_power -= cost
    else:
        revenue = float(stock_price) * (float(old_quantity) - float(new_quantity))
        user.buying_power += revenue
        
    holding.shares = new_quantity

    db.session.commit()
    return holding.to_dict()


