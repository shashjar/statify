from dataclasses import dataclass
from enum import Enum


class Sender(Enum):
    AI = "ai"
    USER = "user"


@dataclass
class ChatMessage:
    sender: Sender
    content: str
