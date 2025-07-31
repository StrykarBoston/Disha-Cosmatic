# DISHA-COSMATIC/new shop/backend/export_and_email.py

import os
import csv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from datetime import datetime
import sys

# Ensure app.py and models.py can be imported by adding parent directory to path
# This assumes this script is in 'new shop/backend' and app.py/models.py are also there.
# We add 'new shop/backend' itself to path for local imports, and 'new shop' for cross-module imports if needed.
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import app and db from your Flask application, and ContactSubmission model
# Note: app is initialized without running the server here, just to get db context
# It's better practice to avoid importing app and directly connect to SQLAlchemy
# but for simplicity and consistency with current setup, we'll use app_context.
# If app.py changes drastically, this might need adjustment.
from app import app, db # Import app and db from your Flask application
from models import ContactSubmission # Import your ContactSubmission model


# --- Configuration ---
# IMPORTANT: Replace with your actual email details and recipient
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'ashishchinthakuntlawar@gmail.com')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'ashishchinthakuntlawar@gmail.com')

# Get the password from the environment variable (this is the secure way)
# The script will now fail with a clear error if the variable is not set.
SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD')
if not SENDER_PASSWORD:
    print("Error: The SENDER_PASSWORD environment variable is not set.")
    print("Please set it securely on your system as per previous instructions.")
    sys.exit(1) # Exit the script if the password is not found

# Email server settings (for Gmail)
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587 # 587 for TLS, 465 for SSL

# Path for the CSV file (will be created in the same directory as this script)
CSV_FILENAME = f"contact_submissions_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
CSV_PATH = os.path.join(os.path.dirname(__file__), CSV_FILENAME)

def export_and_email_contacts():
    print(f"[{datetime.now()}] Starting contact export and email process...")

    with app.app_context(): # Essential to interact with Flask-SQLAlchemy outside the running app
        try:
            submissions = ContactSubmission.query.order_by(ContactSubmission.submitted_at.asc()).all()

            if not submissions:
                print("No contact submissions found in DB. Generating empty report.")
                # You might want to send a different email or skip if no submissions
                # For now, it creates an empty CSV and sends it.

            # --- 1. Export to CSV ---
            with open(CSV_PATH, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['ID', 'Name', 'Email', 'Mobile', 'Country', 'State', 'Company', 'Message', 'Submitted At']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

                writer.writeheader()
                for sub in submissions:
                    writer.writerow({
                        'ID': sub.id,
                        'Name': sub.name,
                        'Email': sub.email,
                        'Mobile': sub.mobile,
                        'Country': sub.country,
                        'State': sub.state if sub.state else '', # Ensure empty string for None
                        'Company': sub.company if sub.company else '', # Ensure empty string for None
                        'Message': sub.message if sub.message else '', # Ensure empty string for None
                        'Submitted At': sub.submitted_at.strftime('%Y-%m-%d %H:%M:%S')
                    })
            print(f"CSV report generated at: {CSV_PATH}")

            # --- 2. Send Email with CSV Attachment ---
            msg = MIMEMultipart()
            msg['From'] = SENDER_EMAIL
            msg['To'] = RECIPIENT_EMAIL
            msg['Subject'] = f"Disha Skin Care - Daily Contact Submissions Report - {datetime.now().strftime('%Y-%m-%d')}"

            body = "Please find attached the daily contact submissions report."
            msg.attach(MIMEText(body, 'plain'))

            with open(CSV_PATH, 'rb') as fp:
                attachment = MIMEApplication(fp.read(), _subtype="csv")
                attachment.add_header('Content-Disposition', 'attachment', filename=os.path.basename(CSV_PATH))
                msg.attach(attachment)

            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls() # Enable TLS encryption
                server.login(SENDER_EMAIL, SENDER_PASSWORD)
                server.send_message(msg)

            print("Email sent successfully!")

            # --- Optional: Clear data from DB after successful export ---
            # Uncomment the lines below ONLY IF you want to clear submissions AFTER they are emailed.
            # db.session.query(ContactSubmission).delete()
            # db.session.commit()
            # print("All contact submissions cleared from database.")

        except Exception as e:
            print(f"Error during export/email process: {e}")
            print("Please ensure SENDER_EMAIL, SENDER_PASSWORD, RECIPIENT_EMAIL are correctly configured.")
            print("For Gmail, you might need to generate an 'App password' for SENDER_PASSWORD.")

    print(f"[{datetime.now()}] Export and email process finished.")


if __name__ == '__main__':
    export_and_email_contacts()