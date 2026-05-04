import os
import requests
from dotenv import load_dotenv

load_dotenv()

def list_anthropic_models():
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("No ANTHROPIC_API_KEY found in .env")
        return

    url = "https://api.anthropic.com/v1/models"
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            models = response.json().get("data", [])
            print("--- Available Anthropic Models ---")
            for m in models:
                print(f"- {m['id']}")
        else:
            print(f"Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_anthropic_models()
