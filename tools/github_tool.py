import os
import requests
from typing import Type
from pydantic import BaseModel, Field
from crewai.tools import BaseTool

class GithubPushInput(BaseModel):
    """Input for GithubPushTool."""
    file_path: str = Field(..., description="The relative path inside the repository to save the file (e.g. 'src/main.py')")
    content: str = Field(..., description="The full string content of the file.")
    commit_message: str = Field(..., description="A clear, descriptive commit message.")

class GithubPushTool(BaseTool):
    name: str = "github_push_tool"
    description: str = (
        "Force-pushes or updates a file in the configured GitHub repository. "
        "Use this to ship code once it has passed QA. "
        "It uses GITHUB_TOKEN and GITHUB_REPO from environment variables."
    )
    args_schema: Type[BaseModel] = GithubPushInput

    def _run(self, file_path: str, content: str, commit_message: str) -> str:
        token = os.getenv("GITHUB_TOKEN")
        repo = os.getenv("GITHUB_REPO")
        
        if not token or not repo:
            return "Error: GITHUB_TOKEN or GITHUB_REPO not set in environment."

        # Handle full URL vs path
        if repo.startswith("https://github.com/"):
            repo = repo.replace("https://github.com/", "")
        
        url = f"https://api.github.com/repos/{repo}/contents/{file_path}"
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json"
        }

        # Step 1: Check if file exists to get SHA
        res = requests.get(url, headers=headers)
        sha = None
        if res.status_code == 200:
            sha = res.json().get("sha")

        # Step 2: Push content (base64)
        import base64
        encoded_content = base64.b64encode(content.encode()).decode()
        
        payload = {
            "message": commit_message,
            "content": encoded_content,
            "branch": "staging" # Always ship to staging first
        }
        if sha:
            payload["sha"] = sha

        put_res = requests.put(url, headers=headers, json=payload)
        
        if put_res.status_code in [200, 201]:
            return f"Successfully pushed {file_path} to {repo} (branch: staging)."
        else:
            return f"Failed to push: {put_res.text}"

github_push_tool = GithubPushTool()
