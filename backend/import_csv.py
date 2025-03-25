import csv
import sqlite3

# Connect to the database
conn = sqlite3.connect("rules.db")
cursor = conn.cursor()

# Open the CSV file and read its rows.
# Make sure the CSV file "Ruleset.csv" is in the same folder.
with open("Ruleset.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Extract CSV fields
        rule_category = row["RULE_CATEGORY"]
        rule_description = row["RULE_DESCRIPTION"]
        rule_labels = row["RULE_LABELS"]
        rule_lhs = row["RULE_LEFT_HAND_SIDE"]
        rule_name = row["RULE_NAME"]
        # Convert the SCORE value to an integer
        score = int(row["SCORE"])

        # Set default additional values.
        # For example, we can set:
        # - product to be the same as rule_category
        # - capability to be the same as rule_labels
        # - credential to a default value "ID"
        # - related_capabilities left as None for now
        product = rule_category
        capability = rule_labels
        credential = "ID"
        related_capabilities = None

        cursor.execute("""
            INSERT INTO rules (
                rule_category, rule_description, rule_labels, rule_lhs, rule_name, score,
                product, capability, credential, related_capabilities
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            rule_category, rule_description, rule_labels, rule_lhs, rule_name, score,
            product, capability, credential, related_capabilities
        ))

conn.commit()
conn.close()
print("CSV data imported successfully.")
