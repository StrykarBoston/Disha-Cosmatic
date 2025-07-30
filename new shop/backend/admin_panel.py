# backend/admin_panel.py
import os
from datetime import datetime
from app import app, db # Import app and db from your Flask application
from models import Product, Category # Import your models

# Path to the dummy image for new products if no image URL is provided
# IMPORTANT: Ensure this path is correct relative to your 'shop.html'
# For example, if your 'img' folder is next to 'shop.html', use './img/default_product.jpg'
DEFAULT_IMAGE_URL = './img/default_product.jpg' # You might want to create this image or change it


def clear_screen():
    # Clears the terminal screen for a cleaner interface
    #os.system('cls' if os.name == 'nt' else 'clear')
    pass

def main_menu():
    #clear_screen()
    print("\n--- Disha Skin Care Admin Panel ---")
    print("1. Manage Products")
    print("2. Manage Categories")
    print("3. Exit")
    choice = input("Enter your choice: ")
    return choice

def product_menu():
    #clear_screen()
    print("\n--- Product Management ---")
    print("1. List All Products")
    print("2. Add New Product")
    print("3. Edit Product")
    print("4. Delete Product")
    print("5. Back to Main Menu")
    choice = input("Enter your choice: ")
    return choice

def category_menu():
    #clear_screen()
    print("\n--- Category Management ---")
    print("1. List All Categories")
    print("2. Add New Category")
    print("3. Delete Category")
    print("4. Back to Main Menu")
    choice = input("Enter your choice: ")
    return choice

def list_products():
    clear_screen()
    print("\n--- All Products ---")
    products = Product.query.all()
    if not products:
        print("No products found.")
        return

    for p in products:
        category_name = p.category.name if p.category else "N/A"
        print(f"ID: {p.id}")
        print(f"  Name: {p.name}")
        print(f"  Category: {category_name}")
        print(f"  Price: ₹{p.price:.2f}")
        print(f"  Stock: {p.stock_quantity}")
        print(f"  SKU: {p.sku}")
        print(f"  Rating: {p.rating} ({p.rating_count} reviews)")
        print(f"  Bestseller: {'Yes' if p.is_bestseller else 'No'}")
        print(f"  Active: {'Yes' if p.is_active else 'No'}")
        print(f"  Image URL: {p.image_url}")
        print("-" * 30)
    input("\nPress Enter to continue...")

def add_product():
    clear_screen()
    print("\n--- Add New Product ---")
    name = input("Product Name: ")
    description = input("Description: ")
    while True:
        try:
            price = float(input("Price (e.g., 199.99): "))
            break
        except ValueError:
            print("Invalid price. Please enter a number.")
    sku = input("SKU (optional, leave empty for auto): ") or None
    while True:
        try:
            stock = int(input("Stock Quantity: "))
            break
        except ValueError:
            print("Invalid stock. Please enter an integer.")

    print("\nAvailable Categories:")
    categories = Category.query.all()
    for cat in categories:
        print(f"{cat.id}. {cat.name}")
    category_id = input("Enter Category ID (leave empty if none): ")
    category_obj = Category.query.get(int(category_id)) if category_id.isdigit() else None

    image_url = input(f"Image URL (e.g., ./img/product.jpg, default: {DEFAULT_IMAGE_URL}): ") or DEFAULT_IMAGE_URL
    while True:
        try:
            rating_input = input("Rating (0.0-5.0, e.g., 4.5): ")
            if rating_input == '': # Allow empty for default 0.0
                rating = 0.0
                break
            rating = float(rating_input)
            if 0 <= rating <= 5:
                break
            else:
                print("Rating must be between 0.0 and 5.0")
        except ValueError:
            print("Invalid rating. Please enter a number.")
    while True:
        try:
            rating_count_input = input("Rating Count (default 0): ")
            if rating_count_input == '': # Allow empty for default 0
                rating_count = 0
                break
            rating_count = int(rating_count_input)
            break
        except ValueError:
            print("Invalid rating count. Please enter an integer.")
    is_bestseller = input("Is Bestseller? (yes/no, default no): ").lower() == 'yes'
    is_active = input("Is Active? (yes/no, default yes): ").lower() != 'no'

    try:
        new_product = Product(
            name=name,
            description=description,
            price=price,
            sku=sku,
            stock_quantity=stock,
            category=category_obj,
            image_url=image_url,
            rating=rating,
            rating_count=rating_count,
            is_bestseller=is_bestseller,
            is_active=is_active
        )
        db.session.add(new_product)
        db.session.commit()
        print(f"\nProduct '{name}' added successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"\nError adding product: {e}")
    input("\nPress Enter to continue...")

def edit_product():
    clear_screen()
    print("\n--- Edit Product ---")
    list_products_simple() # Show a simple list of products
    product_id = input("Enter the ID of the product to edit: ")
    if not product_id.isdigit():
        print("Invalid ID.")
        input("\nPress Enter to continue...")
        return

    product = Product.query.get(int(product_id))
    if not product:
        print("Product not found.")
        input("\nPress Enter to continue...")
        return

    print(f"\nEditing Product: {product.name}")
    print("Enter new values, or press Enter to keep current value.")

    product.name = input(f"Product Name ({product.name}): ") or product.name
    product.description = input(f"Description ({product.description}): ") or product.description
    while True:
        price_input = input(f"Price ({product.price:.2f}): ")
        if price_input == '':
            break
        try:
            product.price = float(price_input)
            break
        except ValueError:
            print("Invalid price. Please enter a number.")

    product.sku = input(f"SKU ({product.sku or 'N/A'}): ") or product.sku

    while True:
        stock_input = input(f"Stock Quantity ({product.stock_quantity}): ")
        if stock_input == '':
            break
        try:
            product.stock_quantity = int(stock_input)
            break
        except ValueError:
            print("Invalid stock. Please enter an integer.")

    print("\nAvailable Categories:")
    categories = Category.query.all()
    for cat in categories:
        print(f"{cat.id}. {cat.name}")
    current_category = product.category.name if product.category else "N/A"
    category_id_input = input(f"Enter New Category ID ({current_category}): ")
    if category_id_input.isdigit():
        product.category = Category.query.get(int(category_id_input))
    elif category_id_input == '':
        pass # Keep current category
    else:
        print("Invalid Category ID. Keeping current category.")

    product.image_url = input(f"Image URL ({product.image_url or 'N/A'}): ") or product.image_url

    while True:
        rating_input = input(f"Rating ({product.rating}): ")
        if rating_input == '':
            break
        try:
            new_rating = float(rating_input)
            if 0 <= new_rating <= 5:
                product.rating = new_rating
                break
            else:
                print("Rating must be between 0.0 and 5.0")
        except ValueError:
            print("Invalid rating. Please enter a number.")

    while True:
        rating_count_input = input(f"Rating Count ({product.rating_count}): ")
        if rating_count_input == '':
            break
        try:
            product.rating_count = int(rating_count_input)
            break
        except ValueError:
            print("Invalid rating count. Please enter an integer.")

    bestseller_input = input(f"Is Bestseller? ({'yes' if product.is_bestseller else 'no'}): ").lower()
    if bestseller_input in ['yes', 'no']:
        product.is_bestseller = (bestseller_input == 'yes')

    active_input = input(f"Is Active? ({'yes' if product.is_active else 'no'}): ").lower()
    if active_input in ['yes', 'no']:
        product.is_active = (active_input == 'yes')


    try:
        db.session.commit()
        print(f"\nProduct '{product.name}' updated successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"\nError updating product: {e}")
    input("\nPress Enter to continue...")

def delete_product():
    clear_screen()
    print("\n--- Delete Product ---")
    list_products_simple() # Show a simple list of products
    product_id = input("Enter the ID of the product to delete: ")
    if not product_id.isdigit():
        print("Invalid ID.")
        input("\nPress Enter to continue...")
        return

    product = Product.query.get(int(product_id))
    if not product:
        print("Product not found.")
        input("\nPress Enter to continue...")
        return

    confirm = input(f"Are you sure you want to delete '{product.name}' (ID: {product.id})? (yes/no): ").lower()
    if confirm == 'yes':
        try:
            db.session.delete(product)
            db.session.commit()
            print(f"Product '{product.name}' deleted successfully.")
        except Exception as e:
            db.session.rollback()
            print(f"Error deleting product: {e}")
    else:
        print("Deletion cancelled.")
    input("\nPress Enter to continue...")

def list_products_simple():
    # Helper to just show IDs and names for selection
    print("\n--- Current Products (ID - Name) ---")
    products = Product.query.all()
    if not products:
        print("No products to display.")
        return
    for p in products:
        print(f"{p.id} - {p.name}")
    print("-" * 30)

def list_categories():
    clear_screen()
    print("\n--- All Categories ---")
    categories = Category.query.all()
    if not categories:
        print("No categories found.")
        return
    for c in categories:
        print(f"ID: {c.id}")
        print(f"  Name: {c.name}")
        print(f"  Description: {c.description or 'N/A'}")
        print("-" * 30)
    input("\nPress Enter to continue...")

def add_category():
    clear_screen()
    print("\n--- Add New Category ---")
    name = input("Category Name: ")
    description = input("Category Description (optional): ") or None

    try:
        new_category = Category(name=name, description=description)
        db.session.add(new_category)
        db.session.commit()
        print(f"\nCategory '{name}' added successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"\nError adding category: {e}")
    input("\nPress Enter to continue...")

def delete_category():
    clear_screen()
    print("\n--- Delete Category ---")
    list_categories_simple() # Show a simple list of categories
    category_id = input("Enter the ID of the category to delete: ")
    if not category_id.isdigit():
        print("Invalid ID.")
        input("\nPress Enter to continue...")
        return

    category = Category.query.get(int(category_id))
    if not category:
        print("Category not found.")
        input("\nPress Enter to continue...")
        return

    # Check if category has products
    if category.products:
        print(f"Warning: Category '{category.name}' has {len(category.products)} associated products.")
        print("These products will have their category set to NULL if you proceed.")
        confirm = input("Are you sure you want to delete this category and unassign its products? (yes/no): ").lower()
        if confirm != 'yes':
            print("Deletion cancelled.")
            input("\nPress Enter to continue...")
            return

    confirm = input(f"Are you sure you want to delete category '{category.name}' (ID: {category.id})? (yes/no): ").lower()
    if confirm == 'yes':
        try:
            db.session.delete(category)
            db.session.commit()
            print(f"Category '{category.name}' deleted successfully.")
        except Exception as e:
            db.session.rollback()
            print(f"Error deleting category: {e}")
    else:
        print("Deletion cancelled.")
    input("\nPress Enter to continue...")

def list_categories_simple():
    # Helper to just show IDs and names for selection
    print("\n--- Current Categories (ID - Name) ---")
    categories = Category.query.all()
    if not categories:
        print("No categories to display.")
        return
    for c in categories:
        print(f"{c.id} - {c.name}")
    print("-" * 30)


if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Ensure tables are created for admin script to interact with

        while True:
            main_choice = main_menu()
            if main_choice == '1':
                while True:
                    product_choice = product_menu()
                    if product_choice == '1':
                        list_products()
                    elif product_choice == '2':
                        add_product()
                    elif product_choice == '3':
                        edit_product()
                    elif product_choice == '4':
                        delete_product()
                    elif product_choice == '5':
                        break
                    else:
                        print("Invalid choice. Please try again.")
                        input("Press Enter to continue...")
            elif main_choice == '2':
                while True:
                    category_choice = category_menu()
                    if category_choice == '1':
                        list_categories()
                    elif category_choice == '2':
                        add_category()
                    elif category_choice == '3':
                        delete_category()
                    elif category_choice == '4':
                        break
                    else:
                        print("Invalid choice. Please try again.")
                        input("Press Enter to continue...")
            elif main_choice == '3':
                print("Exiting Admin Panel. Goodbye!")
                break
            else:
                print("Invalid choice. Please try again.")
                input("Press Enter to continue...")