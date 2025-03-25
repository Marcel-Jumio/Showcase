from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import json
import requests  # To make HTTP requests
from dotenv import load_dotenv
import csv
import os
import io
import config
import time
import logging
import sqlite3


# 🔹 Configure logging
logging.basicConfig(
    filename="flask_app.log",  # Log file name
    level=logging.DEBUG,  # Log everything from DEBUG level and above
    format="%(asctime)s - %(levelname)s - %(message)s",  # Log format with timestamp
)

# Optional: Also log to the console (for immediate visibility)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)
logging.getLogger().addHandler(console_handler)

load_dotenv()  # This loads the environment variables from the .env file

app = Flask(__name__)
CORS(app)

access_token = None
token_expiration_time = None

# function that queried my database rules.db
def get_rules():
    import os, sqlite3
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, "rules.db")
    print("Using database at:", db_path)  # Debug: print the full database path
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rules")
    rules = cursor.fetchall()
    conn.close()
    return rules

# function that gets rules by ids
def get_rules_by_ids(rule_ids):
    # Build the absolute path to your database file
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, "rules.db")
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Create a parameterized query that uses placeholders for rule_ids
    query = "SELECT * FROM rules WHERE id IN ({seq})".format(
        seq=','.join(['?'] * len(rule_ids))
    )
    cursor.execute(query, rule_ids)
    rows = cursor.fetchall()
    conn.close()
    return rows

# Function that retrieves the access token
def get_access_token():
    global access_token, token_expiration_time
    
    # If token is stored and still valid, return it
    if access_token and time.time() < token_expiration_time:
        print(f"Access token is still valid in memory: {access_token}")
        return access_token  # Return the token if it's still valid

    # Otherwise, fetch a new access token
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    auth_url = config.AUTH_URL

    try:
        # Request the access token from the external service
        access_token_response = requests.post(auth_url, data={
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'client_credentials'
        })

        if access_token_response.status_code == 200:
            access_token = access_token_response.json().get('access_token')
            expires_in = access_token_response.json().get('expires_in', 3600)  # Default to 3600 seconds (1 hour) if expires_in is not in the response
            token_expiration_time = time.time() + expires_in  # Set expiration time (current time + expires_in)
            print(f"Access token fetched and stored: {access_token}")
            return access_token
        else:
            raise Exception("Failed to get access token")
    except Exception as e:
        raise Exception(f"Error getting access token: {e}")

    

# Function to create an account
def create_account(account_data):
    access_token = get_access_token()
    create_account_url = config.CREATE_ACCOUNT_URL

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("User-Agent", "MyFlaskApp/1.0")
    }

    try:
        response = requests.post(create_account_url, json=account_data, headers=headers)

        logging.debug(f"Raw Response Content: {response.text}")  # Debugging logs
        logging.info(f"Status Code: {response.status_code}")

        # ✅ Allow both 200 and 201 as successful cases
        if response.status_code in [200, 201]:
            logging.info("Account successfully created.")
            return response.json(), response.status_code

        logging.warning(f"Failed to create account - Status Code: {response.status_code}")

        # 🚨 Otherwise, treat it as an error
        return jsonify({
            "error": "Failed to create account",
            "status_code": response.status_code,
            "details": response.json() if response.headers.get('content-type') == 'application/json' else response.text
        }), response.status_code

    except requests.exceptions.RequestException as e:
        logging.error(f"RequestException in create_account: {str(e)}")
        return jsonify({"error": f"Request failed: {str(e)}"}), 500


# Function to update an account
def update_account(account_id, account_data):
    access_token = get_access_token()
    update_account_url = config.UPDATE_ACCOUNT_URL.format(account_id=account_id)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("User-Agent", "MyFlaskApp/1.0")
    }

    try:
        response = requests.put(update_account_url, json=account_data, headers=headers)

        logging.debug(f"Raw Response Content: {response.text}")
        logging.info(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            logging.info(f"Account {account_id} successfully updated.")
            return response.json(), 200

        logging.warning(f"Failed to update account {account_id} - Status Code: {response.status_code}")

        return jsonify({
            "error": "Failed to update account",
            "status_code": response.status_code,
            "details": response.json() if response.headers.get('content-type') == 'application/json' else response.text
        }), response.status_code

    except requests.exceptions.RequestException as e:
        logging.error(f"RequestException in update_account: {str(e)}")
        return jsonify({"error": f"Request failed: {str(e)}"}), 500

    

# Function to prepare the callback data for the next script
def prepare_data_for_retrieval(data):
    # Extract necessary fields and prepare the data
    prepared_data = {
        "callback_sent_at": data.get("callbackSentAt"),
        "user_reference": data.get("userReference"),
        "workflow_execution": {
            "id": data.get("workflowExecution", {}).get("id"),
            "href": data.get("workflowExecution", {}).get("href"),
            "definition_key": data.get("workflowExecution", {}).get("definitionKey"),
            "status": data.get("workflowExecution", {}).get("status")
        },
        "account": {
            "id": data.get("account", {}).get("id"),
            "href": data.get("account", {}).get("href")
        }
    }

    # Return the structured data (now "ready" for the next step)
    return prepared_data


@app.route('/rules', methods=['GET'])
def get_all_rules():
    try:
        # Call the helper function to query all rules
        rules = get_rules()
        
        # Convert each sqlite3.Row object into a plain dictionary
        rules_list = [dict(row) for row in rules]
        
        # Return the list as JSON with a 200 OK status
        return jsonify(rules_list), 200
    except Exception as e:
        # Return an error message and a 500 status code in case of issues
        return jsonify({"error": str(e)}), 500
    

@app.route('/export-csv', methods=['POST'])
def export_csv():
    try:
        # Retrieve JSON payload from the request
        data = request.get_json()
        if not data or "rules" not in data:
            return jsonify({"error": "No rule_ids provided"}), 400

        rules_payload = data["rules"]
        if not isinstance(rules_payload, list):
            return jsonify({"error": "rule_ids must be a list"}), 400
        
        # Extract IDs and build a mapping of updated scores
        rule_ids = [item["id"] for item in rules_payload]
        updated_scores = {item["id"]: item["score"] for item in rules_payload}

        # Query the database to get the rules for the provided IDs
        rows = get_rules_by_ids(rule_ids)

        # Create an in-memory string buffer to hold the CSV data
        output = io.StringIO()
        writer = csv.writer(output)

        # Write the header row - ensure it exactly matches your required CSV structure
        header = ["RULE_CATEGORY", "RULE_DESCRIPTION", "RULE_LABELS", "RULE_LEFT_HAND_SIDE", "RULE_NAME", "SCORE"]
        writer.writerow(header)

        # Write each row into the CSV in the order specified by the header
        for row in rows:
            new_score = updated_scores.get(row["id"], row["score"])
            writer.writerow([
                row["rule_category"],
                row["rule_description"],
                row["rule_labels"],
                row["rule_lhs"],
                row["rule_name"],
                new_score
            ])

        # Retrieve the CSV content from the in-memory file
        csv_content = output.getvalue()
        output.close()

        # Create a response with the CSV content and set headers to force download
        response = make_response(csv_content)
        response.headers["Content-Disposition"] = "attachment; filename=exported_rules.csv"
        response.headers["Content-Type"] = "text/csv"
        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500    

    
@app.route('/get-access-token', methods=['GET'])
def access_token_route():
    try:
        token = get_access_token()
        return jsonify({"access_token": token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route for account creation
@app.route('/create-account', methods=['POST'])
def create_account_route():
    try:
        if request.content_type != 'application/json':
            logging.warning("Invalid content-type in request.")
            return jsonify({"error": "Content-Type must be application/json"}), 400

        account_data = request.json
        logging.info(f"Received account data: {account_data}")

        account_response, status_code = create_account(account_data)

        return account_response, status_code
    except Exception as e:
        logging.error(f"Error during account creation: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route('/update-account/<account_id>', methods=['PUT'])
def update_account_route(account_id):
    try:
        if request.content_type != 'application/json':
            logging.warning("Invalid content-type in request.")
            return jsonify({"error": "Content-Type must be application/json"}), 400

        account_data = request.json
        logging.info(f"Received update request for account {account_id} with data: {account_data}")

        account_response, status_code = update_account(account_id, account_data)

        return account_response, status_code  # ✅ Return API response as-is
    except Exception as e:
        logging.error(f"Error during account update: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route('/callback', methods=['POST'])
def callback():
    # Receive the incoming JSON data
    data = request.json
    print("Received callback:", data)

    # Process and prepare the data for the next script
    prepared_data = prepare_data_for_retrieval(data)

    # Call the retrieval API with the prepared data and store the result
    api_result = call_retrieval_api(prepared_data)

    if api_result:
        # Optionally, store the API result in a file (for future retrieval)
        with open("api_results.json", "a") as log_file:
            log_file.write(json.dumps(api_result) + "\n")

        return jsonify({"message": "Callback processed and data retrieved", "api_result": api_result}), 200
    else:
        return jsonify({"message": "Callback processed, but API call failed"}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
