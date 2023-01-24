from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_sqlalchemy import SQLAlchemy, DateTime
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'))
    trade_type = db.Column(db.String(255))
    shares = db.Column(db.Float)
    price = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
