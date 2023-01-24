from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_sqlalchemy import SQLAlchemy, DateTime
from datetime import datetime

class Holding(db.Model):
    __tablename__ = "holdings"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'))
    shares = db.Column(db.Float)
    avg_cost = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='holdings')
    stock = db.relationship('Stock', back_populates='holdings')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'stock_id': self.stock_id,
            'shares': self.shares,
            'avg_cost': self.avg_cost,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }

