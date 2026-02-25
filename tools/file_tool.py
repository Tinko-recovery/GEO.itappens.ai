"""
tools/file_tool.py
──────────────────
CrewAI BaseTool wrappers for reading and writing files in the workspace.
Used by agents to store code outputs, research, and reports.
"""

import os
from pathlib import Path
from typing import Type, Optional

from crewai.tools import BaseTool
from pydantic import BaseModel, Field


WORKSPACE_ROOT = Path(__file__).parent.parent / "workspace"
WORKSPACE_ROOT.mkdir(exist_ok=True)


# ── Input schemas ───────────────────────────────────────────────────────────

class ReadFileInput(BaseModel):
    """Input for ReadFileTool."""
    path: str = Field(..., description="Relative path inside workspace/ to read.")


class WriteFileInput(BaseModel):
    """Input for WriteFileTool."""
    path: str = Field(..., description="Relative path inside workspace/ to write.")
    content: str = Field(..., description="Full content to write to the file.")
    append: bool = Field(False, description="If true, append to existing file instead of overwriting.")


class ListFilesInput(BaseModel):
    """Input for ListFilesTool."""
    directory: str = Field(".", description="Sub-directory inside workspace/ to list.")


# ── Tools ───────────────────────────────────────────────────────────────────

class ReadFileTool(BaseTool):
    """
    Read a file from the workspace directory.
    Returns the full file content as a string.
    """

    name: str = "read_file"
    description: str = (
        "Read a file from the workspace. Provide a relative path like 'src/app.py'. "
        "Returns the full file content."
    )
    args_schema: Type[BaseModel] = ReadFileInput

    def _run(self, path: str) -> str:
        full_path = WORKSPACE_ROOT / path
        if not full_path.exists():
            return f"ERROR: File not found: {path}"
        try:
            return full_path.read_text(encoding="utf-8")
        except Exception as exc:
            return f"ERROR reading file {path}: {exc}"


class WriteFileTool(BaseTool):
    """
    Write or append content to a file in the workspace directory.
    Creates parent directories automatically.
    Returns a success or error message.
    """

    name: str = "write_file"
    description: str = (
        "Write content to a file in the workspace. Provide a relative path and the content. "
        "Directories are created automatically. Set append=true to add to existing content."
    )
    args_schema: Type[BaseModel] = WriteFileInput

    def _run(self, path: str, content: str, append: bool = False) -> str:
        full_path = WORKSPACE_ROOT / path
        try:
            full_path.parent.mkdir(parents=True, exist_ok=True)
            mode = "a" if (append and full_path.exists()) else "w"
            full_path.write_text(content, encoding="utf-8") if mode == "w" else \
                open(full_path, "a", encoding="utf-8").write(content)
            return f"✅ Written {len(content)} characters to {path}"
        except Exception as exc:
            return f"ERROR writing file {path}: {exc}"


class ListFilesTool(BaseTool):
    """
    List all files in a workspace subdirectory.
    Returns a newline-separated list of relative paths.
    """

    name: str = "list_files"
    description: str = (
        "List files in the workspace directory. Provide a subdirectory path "
        "(or '.' for root). Returns relative file paths."
    )
    args_schema: Type[BaseModel] = ListFilesInput

    def _run(self, directory: str = ".") -> str:
        target = WORKSPACE_ROOT / directory
        if not target.exists():
            return f"Directory not found: {directory}"
        files = [
            str(p.relative_to(WORKSPACE_ROOT))
            for p in target.rglob("*")
            if p.is_file()
        ]
        if not files:
            return "No files found."
        return "\n".join(sorted(files))


# ── Convenience instances for import ────────────────────────────────────────
read_file_tool = ReadFileTool()
write_file_tool = WriteFileTool()
list_files_tool = ListFilesTool()
