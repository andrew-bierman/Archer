from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = "transactions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id')), nullable=False)
    trade_type = db.Column(db.String(255), nullable=False)
    shares = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())

    user = db.relationship('User', back_populates='transactions')
    stock = db.relationship('Stock', back_populates='transactions')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'stock_id': self.stock_id,
            'trade_type': self.trade_type,
            'shares': self.shares,
            'price': self.price,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
