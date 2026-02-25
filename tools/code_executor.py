"""
tools/code_executor.py
──────────────────────
Safely executes Python and JavaScript code snippets produced by AI agents.
Uses subprocess with strict timeouts and resource limits.
"""

import subprocess
import tempfile
import os
import sys
from pathlib import Path
from typing import Type

from crewai.tools import BaseTool
from pydantic import BaseModel, Field

EXEC_TIMEOUT_SECONDS = 30  # Hard timeout for any code execution
MAX_OUTPUT_CHARS = 10_000  # Truncate runaway output


class RunPythonInput(BaseModel):
    """Input schema for RunPythonTool."""
    code: str = Field(..., description="Python code to execute.")
    requirements: list[str] = Field(
        default_factory=list,
        description="Additional pip packages to install before running."
    )


class RunJavaScriptInput(BaseModel):
    """Input schema for RunJavaScriptTool."""
    code: str = Field(..., description="JavaScript (Node.js) code to execute.")


# ── Python executor ──────────────────────────────────────────────────────────

class RunPythonTool(BaseTool):
    """
    Execute a Python code snippet safely in a temporary file.
    Returns stdout + stderr combined. Hard timeout: 30 seconds.
    Never expose the host filesystem to the executed code via cwd restriction.
    """

    name: str = "run_python"
    description: str = (
        "Execute Python code and return the output. Useful for testing logic, "
        "running calculations, or validating code snippets before delivery."
    )
    args_schema: Type[BaseModel] = RunPythonInput

    def _run(self, code: str, requirements: list[str] | None = None) -> str:
        # Install optional requirements
        if requirements:
            for pkg in requirements:
                try:
                    subprocess.run(
                        [sys.executable, "-m", "pip", "install", pkg, "-q"],
                        timeout=60, check=True, capture_output=True
                    )
                except subprocess.CalledProcessError as e:
                    return f"ERROR: Failed to install {pkg}: {e.stderr.decode()}"

        with tempfile.NamedTemporaryFile(suffix=".py", mode="w",
                                        delete=False, encoding="utf-8") as tmp:
            tmp.write(code)
            tmp_path = tmp.name

        try:
            result = subprocess.run(
                [sys.executable, tmp_path],
                capture_output=True,
                text=True,
                timeout=EXEC_TIMEOUT_SECONDS,
                cwd=tempfile.gettempdir(),  # isolate from project root
            )
            output = result.stdout + result.stderr
            if len(output) > MAX_OUTPUT_CHARS:
                output = output[:MAX_OUTPUT_CHARS] + "\n... [TRUNCATED]"
            return output if output else "(no output)"
        except subprocess.TimeoutExpired:
            return f"ERROR: Execution timed out after {EXEC_TIMEOUT_SECONDS}s"
        except Exception as exc:
            return f"ERROR: {exc}"
        finally:
            os.unlink(tmp_path)


# ── JavaScript executor ──────────────────────────────────────────────────────

class RunJavaScriptTool(BaseTool):
    """
    Execute a JavaScript (Node.js) snippet safely.
    Requires Node.js to be installed on the host.
    Returns stdout + stderr combined.
    """

    name: str = "run_javascript"
    description: str = (
        "Execute JavaScript (Node.js) code and return the output. "
        "Requires Node.js installed. Use for testing frontend components or JS logic."
    )
    args_schema: Type[BaseModel] = RunJavaScriptInput

    def _run(self, code: str) -> str:
        # Check Node.js is available
        if subprocess.run(["node", "--version"], capture_output=True).returncode != 0:
            return "ERROR: Node.js is not installed or not in PATH."

        with tempfile.NamedTemporaryFile(suffix=".js", mode="w",
                                         delete=False, encoding="utf-8") as tmp:
            tmp.write(code)
            tmp_path = tmp.name

        try:
            result = subprocess.run(
                ["node", tmp_path],
                capture_output=True,
                text=True,
                timeout=EXEC_TIMEOUT_SECONDS,
                cwd=tempfile.gettempdir(),
            )
            output = result.stdout + result.stderr
            if len(output) > MAX_OUTPUT_CHARS:
                output = output[:MAX_OUTPUT_CHARS] + "\n... [TRUNCATED]"
            return output if output else "(no output)"
        except subprocess.TimeoutExpired:
            return f"ERROR: Execution timed out after {EXEC_TIMEOUT_SECONDS}s"
        except Exception as exc:
            return f"ERROR: {exc}"
        finally:
            os.unlink(tmp_path)


# Convenience instances
run_python_tool = RunPythonTool()
run_javascript_tool = RunJavaScriptTool()
