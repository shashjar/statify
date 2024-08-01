import threading

from dotenv import load_dotenv
from langchain import hub
from langchain.agents import AgentExecutor, create_structured_chat_agent
from langchain.callbacks.manager import CallbackManager
from langchain_anthropic import ChatAnthropic
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_community.chat_message_histories import ChatMessageHistory

from .stream import StreamingCallbackHandler
from .tools import AUXILIARY_TOOLS, CUSTOM_TOOLS


class StatifyAgent:

    def __init__(self):
        load_dotenv()

        self.streaming_handler = StreamingCallbackHandler()
        callback_manager = CallbackManager([self.streaming_handler])

        llm = ChatAnthropic(
            model="claude-3-5-sonnet-20240620",
            temperature=0.1,
            max_tokens=1024,
            timeout=None,
            max_retries=2,
            streaming=True,
            callback_manager=callback_manager,
        )
        prompt = hub.pull("hwchase17/structured-chat-agent")
        tools = CUSTOM_TOOLS + load_tools(AUXILIARY_TOOLS, llm=llm)

        agent = create_structured_chat_agent(llm, tools, prompt)
        self.agent_executor = AgentExecutor(
            agent=agent, tools=tools, verbose=True, handle_parsing_errors=True
        )

        self.chat_history = ChatMessageHistory()

    def stream(self, user_input: str):
        self.chat_history.add_user_message(user_input)

        # Run the agent executor in a separate thread
        def run_agent():
            self.agent_executor.invoke(
                {
                    "input": user_input,
                    "chat_history": self.chat_history.messages,
                }
            )

        agent_thread = threading.Thread(target=run_agent())
        agent_thread.start()

        # Yield response tokens as they become available
        while agent_thread.is_alive() or self.streaming_handler.tokens:
            if self.streaming_handler.tokens:
                yield self.streaming_handler.tokens.pop(0)

        agent_thread.join()

        # Yield any remaining tokens
        while self.streaming_handler.tokens:
            yield self.streaming_handler.tokens.pop(9)

        # Add the complete response to the chat history
        complete_response = "".join(self.streaming_handler.tokens)
        self.chat_history.add_ai_message(complete_response)
