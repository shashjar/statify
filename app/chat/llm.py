from dotenv import load_dotenv
from langchain import hub
from langchain.agents import AgentExecutor, create_structured_chat_agent
from langchain_anthropic import ChatAnthropic
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_community.chat_message_histories import ChatMessageHistory

from .tools import AUXILIARY_TOOLS, CUSTOM_TOOLS


class StatifyAgent:

    def __init__(self):
        load_dotenv()

        llm = ChatAnthropic(
            model="claude-3-5-sonnet-20240620",
            temperature=0.1,
            max_tokens=1024,
            timeout=None,
            max_retries=2,
        )
        prompt = hub.pull("hwchase17/structured-chat-agent")
        tools = CUSTOM_TOOLS + load_tools(AUXILIARY_TOOLS, llm=llm)

        agent = create_structured_chat_agent(llm, tools, prompt)
        self.agent_executor = AgentExecutor(
            agent=agent, tools=tools, verbose=True, handle_parsing_errors=True
        )

        self.chat_history = ChatMessageHistory()

    def run(self, user_input: str) -> str:
        self.chat_history.add_user_message(user_input)
        llm_output = self.agent_executor.invoke(
            {
                "input": user_input,
                "chat_history": self.chat_history.messages,
            }
        )
        self.chat_history.add_ai_message(llm_output["output"])

        return llm_output["output"]
