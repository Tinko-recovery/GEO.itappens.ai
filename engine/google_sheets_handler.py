import os
import json
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']


class GoogleSheetsHandler:
    def __init__(self):
        self.spreadsheet_id = os.getenv("GOOGLE_SHEET_ID")
        sheet_name = os.getenv('GOOGLE_SHEET_NAME', 'Sheet1')
        sheet_range = os.getenv('GOOGLE_SHEET_RANGE', 'A:F')
        self.range_name = f"{sheet_name}!{sheet_range}"
        self.creds = self._get_credentials()
        self.service = build('sheets', 'v4', credentials=self.creds) if self.creds else None

    def _get_credentials(self):
        """
        Uses a Service Account for permanent, non-expiring authentication.
        Priority:
          1. GOOGLE_SERVICE_ACCOUNT_JSON env var (Cloud/Render — recommended)
          2. service_account.json local file (local dev)
        """
        try:
            from google.oauth2 import service_account

            sa_json_env = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
            if sa_json_env:
                sa_info = json.loads(sa_json_env)
                creds = service_account.Credentials.from_service_account_info(
                    sa_info, scopes=SCOPES
                )
                print("✅ Google Sheets: Authenticated via Service Account (env var)")
                return creds

            if os.path.exists('service_account.json'):
                creds = service_account.Credentials.from_service_account_file(
                    'service_account.json', scopes=SCOPES
                )
                print("✅ Google Sheets: Authenticated via Service Account (local file)")
                return creds

            print("❌ Google Sheets: No Service Account credentials found.")
            print("   Set GOOGLE_SERVICE_ACCOUNT_JSON env var in Render, or add service_account.json locally.")
            return None

        except Exception as e:
            print(f"❌ Google Sheets credential error: {e}")
            return None

    def get_topic_by_day(self, day):
        """Fetches all data for a specific day from the sheet."""
        if not self.service:
            print("❌ Google Sheets service not initialized.")
            return None

        try:
            sheet = self.service.spreadsheets()
            result = sheet.values().get(
                spreadsheetId=self.spreadsheet_id,
                range=self.range_name
            ).execute()
            values = result.get('values', [])

            if not values:
                print('No data found in sheet.')
                return None

            print(f"--- DEBUG: Searching for Day '{day}' in {len(values)-1} rows... ---")
            for i, row in enumerate(values[1:]):
                if not row or len(row) == 0:
                    continue

                raw_val = str(row[0]).strip().lower()
                match_val = raw_val.replace("day", "").strip().split('.')[0]

                if i < 10:
                    print(f"--- DEBUG: Row {i+1} Col A: '{raw_val}' -> '{match_val}'")

                if match_val == str(day):
                    print(f"--- DEBUG: SUCCESS! Found Day {day} at row {i+2} ---")
                    while len(row) < 6:
                        row.append("")
                    return {
                        "day": row[0],
                        "title": row[1],
                        "hook": row[2],
                        "category": row[3],
                        "footer": row[4],
                        "directive": row[5]
                    }

            print(f"--- DEBUG: Day {day} not found in sheet.")
            return None

        except HttpError as err:
            print(f"Google Sheets API error: {err}")
            return None

    def list_sheet_names(self):
        """Lists all sheet names in the spreadsheet."""
        if not self.service:
            return []
        try:
            spreadsheet = self.service.spreadsheets().get(
                spreadsheetId=self.spreadsheet_id
            ).execute()
            names = [s.get("properties", {}).get("title") for s in spreadsheet.get('sheets', [])]
            print(f"Available sheets: {names}")
            return names
        except Exception as e:
            print(f"Error listing sheets: {e}")
            return []


if __name__ == "__main__":
    handler = GoogleSheetsHandler()
    handler.list_sheet_names()
    print(f"Topic for Day 1: {handler.get_topic_by_day(1)}")
