"""Compatibility entrypoint so `uvicorn src.main:app` works."""

from main import app

__all__ = ["app"]
