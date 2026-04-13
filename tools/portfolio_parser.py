import json
import pandas as pd
from config import logger, ANTHROPIC_API_KEY
from anthropic import Anthropic
import base64

class PortfolioParser:
    def __init__(self):
        self.anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)

    def parse_json(self, file_content):
        try:
            items = json.loads(file_content)
            # Expecting list of dicts: [{"ticker": "AAPL", "quantity": 10, "buy_price": 150}, ...]
            return items
        except Exception as e:
            logger.error(f"JSON parse error: {e}")
            return []

    def parse_excel(self, file_path):
        try:
            df = pd.read_excel(file_path)
            # Normalize columns to lowercase
            df.columns = [c.lower() for c in df.columns]
            return df.to_dict('records')
        except Exception as e:
            logger.error(f"Excel parse error: {e}")
            return []

    def parse_with_vision(self, file_bytes, mime_type):
        """Uses Claude 3.5 Sonnet to extract portfolio data from images or PDFs."""
        encoded_string = base64.b64encode(file_bytes).decode('utf-8')
        
        prompt = """
        Extract the stock portfolio data from this document. 
        I need a JSON list of objects with the following keys: 'ticker', 'quantity', 'buy_price'.
        If 'buy_price' is not available, set it to 0.
        Only return the JSON list, no other text.
        """
        
        try:
            message = self.anthropic.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": mime_type,
                                    "data": encoded_string,
                                },
                            },
                            {"type": "text", "text": prompt}
                        ],
                    }
                ],
            )
            raw_text = message.content[0].text
            # Simple clean up to get only the JSON part
            json_start = raw_text.find("[")
            json_end = raw_text.rfind("]") + 1
            if json_start != -1 and json_end != -1:
                return json.loads(raw_text[json_start:json_end])
            return []
        except Exception as e:
            logger.error(f"Vision parse error: {e}")
            return []
