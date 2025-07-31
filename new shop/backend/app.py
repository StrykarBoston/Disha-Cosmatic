# DISHA-COSMATIC/new shop/backend/app.py

# ... (existing imports) ...
from flask import Flask, jsonify, request
from flask_cors import CORS
# Ensure you import ContactSubmission from models
from models import db, Product, Category, ContactSubmission # ADD ContactSubmission here
import json

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# ... (existing Flask app setup and CORS(app)) ...

# --- Utility Function to Initialize Database with Dummy Data (Keep as is) ---
def seed_database():
    # This function creates all tables defined in models.py
    # So, db.create_all() will now automatically create the ContactSubmission table.
    with app.app_context():
        db.create_all() # This will now create ContactSubmission table too

        if not Category.query.first(): # Only seed products/categories if they don't exist
            print("Seeding initial data...")
            # ... (your existing category and product seeding logic) ...
            print("Database seeded successfully.")
        else:
            print("Database already seeded.")


# --- API Routes for Frontend (existing Product/Category routes, keep them as they are) ---

@app.route('/api/products', methods=['GET'])
def get_products():
    # ... (your existing get_products function code) ...
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
    # ... (your existing get_product function code) ...
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
    # ... (your existing get_categories function code) ...
    categories = Category.query.all()
    categories_data = [{'id': cat.id, 'name': cat.name} for cat in categories]
    return jsonify(categories_data)


# NEW API ROUTE: Contact Form Submission
@app.route('/api/contact_submissions', methods=['POST'])
def submit_contact_form():
    data = request.get_json() # Get JSON data sent from frontend

    # Basic validation: ensure required fields are present
    if not data or not all(k in data for k in ['name', 'email', 'mobile', 'country', 'state']):
        return jsonify({"success": False, "message": "Missing required fields (Name, Email, Mobile, Country)."}), 400

    try:
        new_submission = ContactSubmission(
            name=data['name'],
            email=data['email'],
            mobile=data['mobile'],
            country=data['country'],
            state=data['state'], # Use the 'state' variable directly
            company=data.get('company'),
            message=data.get('message')
        )

        db.session.add(new_submission)
        db.session.commit()

        return jsonify({"success": True, "message": "Your message has been sent successfully!"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error saving contact submission: {e}")
        return jsonify({"success": False, "message": "Failed to save your message. Please try again."}), 500


# --- Run the App (Keep this block as is) ---
if __name__ == '__main__':
    # print("Step 0: Starting app.py execution...") # Keep your debug prints if you want
    with app.app_context():
        # print("Step 6a: Entering app context for database operations.") # Keep your debug prints
        # This block was for temporary database deletion and seeding.
        # You should remove it or comment it out if your database is stable and you don't want to re-create it.
        # For first run with new ContactSubmission table, deleting site.db manually is best.
        # try:
        #     import os
        #     db_path = os.path.join(os.path.dirname(__file__), 'site.db')
        #     if os.path.exists(db_path):
        #         os.remove(db_path)
        #         print(f"Removed old database: {db_path}")
        # except Exception as e:
        #     print(f"Error removing old database: {e}")

        seed_database() # This will create tables and seed if not already present

    # print("Step 7: Database seeding completed. Attempting to run app...") # Keep your debug prints
    app.run(debug=True, port=5000)
    # print("Step 8: App should be running now (you won't see this if it runs correctly).") # Keep your debug prints