import uvicorn
from fastapi import FastAPI
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test")

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok"}

if __name__ == "__main__":
    logger.info("Starting test server on port 10000...")
    uvicorn.run(app, host="127.0.0.1", port=10001) # Try a different port just in case
