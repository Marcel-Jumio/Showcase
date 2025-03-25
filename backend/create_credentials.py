import sqlite3

# Connect to the existing database (assuming it's named rules.db)
conn = sqlite3.connect("rules.db")
cursor = conn.cursor()

# Create the credentials table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS credentials (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE CHECK(name IN ('ID', 'FACEMAP', 'SELFIE', 'DATA', 'DOCUMENT'))
);
""")
conn.commit()

# List of fixed credential values
credential_values = ['ID', 'FACEMAP', 'SELFIE', 'DATA', 'DOCUMENT']

# Insert each value, ignore if already exists
for cred in credential_values:
    try:
        cursor.execute("INSERT INTO credentials (name) VALUES (?)", (cred,))
    except sqlite3.IntegrityError:
        print(f"Credential '{cred}' already exists. Skipping.")
        
conn.commit()
conn.close()

print("Credentials table created and populated successfully.")
