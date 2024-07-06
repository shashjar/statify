from colorama import Fore
from dotenv import load_dotenv
from langchain import hub
from langchain.agents import AgentExecutor, create_structured_chat_agent
from langchain_anthropic import ChatAnthropic
from langchain_community.chat_message_histories import ChatMessageHistory
from tools import tools

load_dotenv()


##############################################################
# DEFINE AGENT EXECUTOR
##############################################################

llm = ChatAnthropic(
    model="claude-3-5-sonnet-20240620",
    temperature=0.1,
    max_tokens=1024,
    timeout=None,
    max_retries=2,
)

prompt = hub.pull("hwchase17/structured-chat-agent")

agent = create_structured_chat_agent(llm, tools, prompt)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)


##############################################################
# RUN CHAT
##############################################################

chat_history = ChatMessageHistory()
while True:
    user_input = input(Fore.MAGENTA + "\nEnter your prompt: ")
    chat_history.add_user_message(user_input)

    llm_output = agent_executor.invoke(
        {
            "input": user_input,
            "chat_history": chat_history.messages,
        }
    )
    chat_history.add_ai_message(llm_output["output"])
