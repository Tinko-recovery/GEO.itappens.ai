import os
import requests
from dotenv import load_dotenv

load_dotenv()

def introspect_errors():
    token = os.getenv("BUFFER_ACCESS_TOKEN")
    url = "https://api.buffer.com"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    query = """
    query IntrospectErrors {
      __type(name: "UnexpectedError") {
        fields {
          name
        }
      }
    }
    """
    
    try:
        res = requests.post(url, json={'query': query}, headers=headers).json()
        print(res)
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    introspect_errors()
