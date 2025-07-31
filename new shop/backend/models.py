# DISHA-COSMATIC/new shop/backend/models.py

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Existing Category Model (Keep this as is)
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    products = db.relationship('Product', backref='category', lazy=True)
    def __repr__(self):
        return f"<Category {self.name}>"

# Existing Product Model (Keep this as is)
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    sku = db.Column(db.String(100), unique=True, nullable=True)
    stock_quantity = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255), nullable=True)
    rating = db.Column(db.Numeric(2, 1), default=0.0)
    rating_count = db.Column(db.Integer, default=0)
    is_bestseller = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    def __repr__(self):
        return f"<Product {self.name}>"

# NEW MODEL: ContactSubmission
class ContactSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=True) # Making state nullable/optional
    company = db.Column(db.String(100), nullable=True)
    message = db.Column(db.Text, nullable=True)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<ContactSubmission {self.name} - {self.email}>"