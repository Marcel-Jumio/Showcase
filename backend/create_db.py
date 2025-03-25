import sqlite3

# Connect to (or create) the SQLite database file in the backend folder
conn = sqlite3.connect("rules.db")
cursor = conn.cursor()

# Create the rules table with our schema
cursor.execute("""
    CREATE TABLE IF NOT EXISTS rules (
        id                   INTEGER PRIMARY KEY AUTOINCREMENT,
        rule_category        TEXT NOT NULL,
        rule_description     TEXT,
        rule_labels          TEXT,
        rule_lhs             TEXT NOT NULL,
        rule_name            TEXT NOT NULL,
        score                INTEGER NOT NULL,
        product              TEXT NOT NULL,
        capability           TEXT NOT NULL,
        credential           TEXT NOT NULL,
        related_capabilities TEXT,
        is_active            BOOLEAN DEFAULT 1,
        priority             INTEGER DEFAULT 0,
        imported_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by           TEXT,
        updated_by           TEXT,
        notes                TEXT
    );
""")

# Commit changes and close the connection
conn.commit()
conn.close()

print("Database and table created successfully.")
