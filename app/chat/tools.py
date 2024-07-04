import os

import requests
from langchain.tools import tool


@tool
def get_specific_game_by_id(game_id: int) -> dict:
    """
    Retrieves a specific NBA game by its ID.

    Args:
        game_id (int): The ID of the NBA game to retrieve data for.

    Returns:
        dict: The data for the specified NBA game.
    """
    url = f"https://api.balldontlie.io/v1/games/{game_id}"
    headers = {"Content-type": "application/json", "Authorization": os.environ["BALL_DONT_LIE_API_KEY"]}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()["data"]
    except requests.exceptions.RequestException as e:
        return f"Error retrieving game by ID: {e}"


tools = [get_specific_game_by_id]
