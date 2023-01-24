from flask_sqlalchemy import SQLAlchemy
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Watchlist(db.Model):
    __tablename__ = "watchlists"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("stocks.id")), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

    user = db.relationship("User", back_populates="watchlists")
    stock = db.relationship("Stock", back_populates="watchlists")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "stock_id": self.stock_id,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
            "user": self.user.to_dict(),
            "stocks": [stock.to_dict() for stock in self.stocks]
        }
            
