from colorama import Fore
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from prompt import LLM_PROMPT_TEMPLATE, NBA_API_DOCS

load_dotenv()


llm = ChatAnthropic(
    model="claude-3-5-sonnet-20240620",
    temperature=0,
    max_tokens=1024,
    timeout=None,
    max_retries=2,
)

prompt = ChatPromptTemplate.from_template(LLM_PROMPT_TEMPLATE)

chain = prompt | llm | StrOutputParser()

# e.g. "Which team was at the top of the NBA standings for the 1991-1992 regular season?"
user_prompt = input(Fore.MAGENTA + "\nEnter your prompt: ")

llm_output = chain.invoke(
    {
        "api_docs": NBA_API_DOCS,
        "user_prompt": user_prompt,
    }
)
print(Fore.CYAN + f"\n{llm_output}")
