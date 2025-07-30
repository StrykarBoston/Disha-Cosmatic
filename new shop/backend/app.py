# backend/app.py

print("Step 0: Starting app.py execution...") # Add this line

from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Product, Category # Import from models.py
import json

print("Step 1: Imports successful.") # Add this line

app = Flask(__name__)
CORS(app)

print("Step 2: Flask app and CORS initialized.") # Add this line

# Database Configuration (SQLite for simplicity)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

print("Step 3: Database configured and initialized with app.") # Add this line


# --- Utility Function to Initialize Database with Dummy Data (Run once) ---
def seed_database():
    print("Step 4: Inside seed_database function.") # Add this line
    with app.app_context():
        print("Step 4a: Entering app context for seeding.") # Add this line
        db.create_all() # Create tables if they don't exist

        if not Category.query.first():
            print("Step 4b: Seeding initial data...")
            # Create Categories
            soap_cat = Category(name='Soap', description='Natural and organic soaps.')
            shampoo_cat = Category(name='Shampoo', description='Herbal shampoos for healthy hair.')
            hair_oil_cat = Category(name='Hair Oil', description='Nourishing hair oils.')
            beauty_cat = Category(name='Beauty', description='General beauty products.')

            db.session.add_all([soap_cat, shampoo_cat, hair_oil_cat, beauty_cat])
            db.session.commit()

            # Create Products
            product1 = Product(
                name='Herbal Hair Oil',
                description='A natural blend of herbs for strong and shiny hair.',
                price=499.00,
                sku='HHO001',
                stock_quantity=150,
                category=hair_oil_cat,
                image_url='./img/herbal_hair_oil.jpg',
                rating=4.5,
                rating_count=120,
                is_bestseller=True
            )
            product2 = Product(
                name='Neem & Tulsi Soap',
                description='Purifying soap with neem and tulsi extracts.',
                price=120.00,
                sku='NTS002',
                stock_quantity=300,
                category=soap_cat,
                image_url='./img/neem_tulsi_soap.jpg',
                rating=4.2,
                rating_count=80,
                is_bestseller=False
            )
            product3 = Product(
                name='Amla Shikakai Shampoo',
                description='Natural shampoo for hair growth and strength.',
                price=350.00,
                sku='ASS003',
                stock_quantity=200,
                category=shampoo_cat,
                image_url='./img/amla_shikakai_shampoo.jpg',
                rating=4.8,
                rating_count=150,
                is_bestseller=True
            )
            product4 = Product(
                name='Rose Water Toner',
                description='Refreshing and hydrating rose water for face.',
                price=250.00,
                sku='RWT004',
                stock_quantity=180,
                category=beauty_cat,
                image_url='./img/rose_water_toner.jpg',
                rating=4.0,
                rating_count=60,
                is_bestseller=False
            )
            product5 = Product(
                name='Sandalwood Soap',
                description='Luxurious soap with the soothing scent of sandalwood.',
                price=180.00,
                sku='SWS005',
                stock_quantity=250,
                category=soap_cat,
                image_url='./img/sandalwood_soap.jpg',
                rating=4.3,
                rating_count=95,
                is_bestseller=False
            )
            product6 = Product(
                name='Bhringraj Hair Oil',
                description='Traditional hair oil for hair fall control and nourishment.',
                price=550.00,
                sku='BHO006',
                stock_quantity=100,
                category=hair_oil_cat,
                image_url='./img/bhringraj_hair_oil.jpg',
                rating=4.7,
                rating_count=110,
                is_bestseller=True
            )

            db.session.add_all([product1, product2, product3, product4, product5, product6])
            db.session.commit()
            print("Step 4c: Database seeded successfully.")
        else:
            print("Step 4d: Database already seeded.")


# --- API Routes for Frontend ---

@app.route('/api/products', methods=['GET'])
def get_products():
    # ... (rest of get_products function) ...
    # Ensure this function is correct and has no syntax errors
    products_query = Product.query

    # Category filtering
    category_name = request.args.get('category')
    if category_name:
        category = Category.query.filter_by(name=category_name).first()
        if category:
            products_query = products_query.filter_by(category_id=category.id)
        else:
            return jsonify({"error": "Category not found"}), 404

    # Sorting
    sort_by = request.args.get('sort')
    if sort_by == 'price_asc':
        products_query = products_query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        products_query = products_query.order_by(Product.price.desc())
    elif sort_by == 'rating':
        products_query = products_query.order_by(Product.rating.desc())
    # Default/Popularity (can be based on sales count or simply id for now)
    else:
        products_query = products_query.order_by(Product.id.asc())

    products = products_query.all()

    products_data = []
    for product in products:
        products_data.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price), # Convert Decimal to float for JSON
            'sku': product.sku,
            'stock_quantity': product.stock_quantity,
            'category': product.category.name if product.category else None,
            'image_url': product.image_url,
            'rating': product.rating,
            'rating_count': product.rating_count,
            'is_bestseller': product.is_bestseller
        })
    return jsonify(products_data)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    # ... (rest of get_product function) ...
    product = Product.query.get(product_id)
    if product:
        return jsonify({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'sku': product.sku,
            'stock_quantity': product.stock_quantity,
            'category': product.category.name if product.category else None,
            'image_url': product.image_url,
            'rating': product.rating,
            'rating_count': product.rating_count,
            'is_bestseller': product.is_bestseller
        })
    return jsonify({"error": "Product not found"}), 404

@app.route('/api/categories', methods=['GET'])
def get_categories():
    # ... (rest of get_categories function) ...
    categories = Category.query.all()
    categories_data = [{'id': cat.id, 'name': cat.name} for cat in categories]
    return jsonify(categories_data)

print("Step 5: API Routes defined.") # Add this line

# --- Run the App ---
if __name__ == '__main__':
    print("Step 6: Entering __main__ block.") # Add this line
    with app.app_context():
        print("Step 6a: Entering app context for database operations.") # Add this line
        # Delete the existing database file if it exists, to ensure fresh seed
        # This is ONLY for debugging this issue. Comment out later.
        try:
            import os
            db_path = os.path.join(os.path.dirname(__file__), 'site.db')
            if os.path.exists(db_path):
                os.remove(db_path)
                print(f"Removed old database: {db_path}")
        except Exception as e:
            print(f"Error removing old database: {e}")

        seed_database() # This will create tables and seed if no categories exist

    print("Step 7: Database seeding completed. Attempting to run app...") # Add this line
    app.run(debug=True, port=5000)
    print("Step 8: App should be running now (you won't see this if it runs correctly).") # Add this line