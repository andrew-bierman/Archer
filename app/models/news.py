from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_sqlalchemy import SQLAlchemy, DateTime
from datetime import datetime

class News(db.Model):
    __tablename__ = "news"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    bookmark = db.Column(db.Boolean)
    symbol = db.Column(db.String(255))
    title = db.Column(db.String(255))
    source = db.Column(db.String(255))
    image_link = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'bookmark': self.bookmark,
            'symbol': self.symbol,
            'title': self.title,
            'source': self.source,
            'image_link': self.image_link,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'updated_at': self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
