import os
import requests
from dotenv import load_dotenv

load_dotenv()

def introspect_schema():
    token = os.getenv("BUFFER_ACCESS_TOKEN")
    url = "https://api.buffer.com"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Query to get details about CreatePostInput and its enums
    query = """
    query IntrospectCreatePost {
      __type(name: "CreatePostInput") {
        inputFields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
      ShareMode: __type(name: "ShareMode") {
        enumValues {
          name
        }
      }
      SchedulingType: __type(name: "SchedulingType") {
        enumValues {
          name
        }
      }
    }
    """
    
    try:
        res = requests.post(url, json={'query': query}, headers=headers).json()
        if "data" in res:
            print("--- CreatePostInput Fields ---")
            for field in res["data"]["__type"]["inputFields"]:
                type_info = field["type"]["name"] or field["type"]["ofType"]["name"]
                print(f"- {field['name']}: {type_info}")
            
            print("\n--- ShareMode Enum Values ---")
            if res["data"]["ShareMode"]:
                for val in res["data"]["ShareMode"]["enumValues"]:
                    print(f"- {val['name']}")
            
            print("\n--- SchedulingType Enum Values ---")
            if res["data"]["SchedulingType"]:
                for val in res["data"]["SchedulingType"]["enumValues"]:
                    print(f"- {val['name']}")
        else:
            print(f"Error: {res}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    introspect_schema()
