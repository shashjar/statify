import os

import requests
from bs4 import BeautifulSoup
from langchain.tools import tool


@tool
def search_statmuse(statmuse_query: str) -> str:
    """
    A sports search engine. Use this more than normal search if the question is about NBA basketball,
    like 'who is the highest scoring player in the NBA?'. Always specify a year or timeframe with your
    search. Only ask about one player or team at a time, don't ask about multiple players at once.
    """
    url = f"https://www.statmuse.com/nba/ask/{statmuse_query}"
    page = requests.get(url)

    with open("page_content.txt", "w") as f:
        f.write(str(page.content))
    soup = BeautifulSoup(page.content, "html.parser")
    return soup.find("meta", property="og:description")["content"]


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


@tool
def get_specific_player_by_id(player_id: int) -> dict:
    """
    Retrieves a specific NBA player by their ID.

    Args:
        player_id (int): The ID of the NBA player to retrieve data for.

    Returns:
        dict: The data for the specified NBA player.
    """
    url = f"https://api.balldontlie.io/v1/players/{player_id}"
    headers = {"Content-type": "application/json", "Authorization": os.environ["BALL_DONT_LIE_API_KEY"]}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()["data"]
    except requests.exceptions.RequestException as e:
        return f"Error retrieving player by ID: {e}"


CUSTOM_TOOLS = [search_statmuse, get_specific_game_by_id, get_specific_player_by_id]
AUXILIARY_TOOLS = ["serpapi", "llm-math"]
