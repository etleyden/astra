import os
import plaid
from plaid.api import plaid_api
from datetime import datetime, timedelta
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()
PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")
PLAID_ENV = os.getenv("PLAID_ENV", "sandbox")  # Use 'sandbox' for testing

# Initialize the Plaid client
configuration = plaid.Configuration(
    host=plaid.Environment[PLAID_ENV],
    api_key={
        "clientId": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
    }
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

# Step 1: Create a link token (for user authentication)
def create_link_token():
    request = plaid.LinkTokenCreateRequest(
        products=["transactions"],
        client_name="Your App Name",
        country_codes=["US"],
        language="en",
        user=plaid.LinkTokenCreateRequestUser(client_user_id="unique_user_id")
    )
    response = client.link_token_create(request)
    return response["link_token"]

# Step 2: Exchange public token for an access token after user authentication
# (The public token comes from Plaid Link UI after the user logs in to their bank)
def exchange_public_token(public_token):
    request = plaid.ItemPublicTokenExchangeRequest(public_token=public_token)
    response = client.item_public_token_exchange(request)
    return response["access_token"]

# Step 3: Fetch transactions
def fetch_transactions(access_token, start_date, end_date):
    request = plaid.TransactionsGetRequest(
        access_token=access_token,
        start_date=start_date,
        end_date=end_date
    )
    response = client.transactions_get(request)
    return response["transactions"]

# Run the script
if __name__ == "__main__":
    # Generate a link token and complete Plaid Link setup in a browser
    link_token = create_link_token()
    print("Open this link in a browser to authenticate your account:")
    print(f"https://link.plaid.com/?token={link_token}")

    # After user authenticates, exchange the public token for an access token
    # (Simulate this part for demo purposes)
    public_token = "public-sandbox-xxx-xxx"  # Replace with the token from Plaid Link
    access_token = exchange_public_token(public_token)

    # Fetch transactions for the past 30 days
    start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    end_date = datetime.now().strftime("%Y-%m-%d")
    transactions = fetch_transactions(access_token, start_date, end_date)

    # Print the transactions
    print("Transactions from the last month:")
    print(json.dumps(transactions, indent=2))
