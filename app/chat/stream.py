from typing import Any

from langchain.callbacks.base import BaseCallbackHandler


class StreamingCallbackHandler(BaseCallbackHandler):
    def __init__(self):
        self.tokens = []

    def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        self.tokens.append(token)

    def on_llm_end(self, response: Any, **kwargs: Any) -> None:
        pass

    def on_llm_error(self, error: Exception, **kwargs: Any) -> None:
        self.tokens.append(f"Error: {str(error)}")
