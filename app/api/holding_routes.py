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

    return {'holdings': [holding.to_dict() for holding in holdings]}


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

    # Calculate the cost of the stock
    cost = stock_price * quantity

    # Check if the user has enough buying power to purchase the stock
    if cost > buying_power:
        return jsonify({'message': "Not enough buying power", 'statusCode': 400}), 400

    holding = Holding(
        stock_id=stock_id,
        user_id=current_user.id,
        quantity=quantity
    )

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
    quantity = holding.quantity
    revenue = stock_price * quantity

    # Retrieve the current user
    user = User.query.get(current_user.id)

    # Add the revenue to the user's buying power
    user.buying_power += revenue

    db.session.delete(holding)
    db.session.commit()
    return holding.to_dict()


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

    holding.quantity = request.json['quantity']

    db.session.commit()
    return holding.to_dict()



