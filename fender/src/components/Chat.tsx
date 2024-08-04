import React, { useRef, useState } from "react";
import { Stack, Button, Space, Container } from "@mantine/core";
import NavBar from "./NavBar";
import ChatMessages from "./ChatMessages";
import ChatBox from "./ChatBox";
import { ChatMessage } from "../types";
import { streamingAPI } from "../api";

const Chat: React.FC = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () =>
    viewportRef.current!.scrollTo({
      top: viewportRef.current!.scrollHeight,
      behavior: "smooth",
    });

  const chatWithAI = async (
    userInput: string,
    onToken: (token: string) => void,
  ): Promise<void> => {
    try {
      const response = await streamingAPI.post(
        "/chat",
        {
          userInput,
        },
        {
          responseType: "stream",
        },
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error with status code: ${response.status}`);
      }

      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              onToken(jsonData.token);
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      }

      if (buffer.startsWith("data:")) {
        try {
          const jsonData = JSON.parse(buffer.slice(6));
          onToken(jsonData.token);
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      }
    } catch (error) {
      console.error("There was a problem with the Axios request:", error);
      onToken(
        "I'm undergoing self-actualization at the present moment. Please try again later.",
      );
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (userInput === "" || isLoading) {
      return;
    }

    if (event.key === "Enter") {
      setIsLoading(true);
      event.preventDefault();

      textAreaRef.current!.value = "";
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", content: userInput },
      ]);

      // TODO: add a typing indicator while the AI is "thinking" before the first token arrives
      const aiResponse: ChatMessage = { sender: "ai", content: "" };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);

      const onToken = (token: string) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          lastMessage.content += token;
          return updatedMessages;
        });
        scrollToBottom();
      };

      await chatWithAI(userInput, onToken);

      setUserInput("");
      setIsLoading(false);
      scrollToBottom();
      return;
    }
  };

  return (
    <Stack>
      <NavBar />
      <Container style={{ alignContent: "center" }}>
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          viewportRef={viewportRef}
        />
        <ChatBox
          setUserInput={setUserInput}
          handleKeyDown={handleKeyDown}
          textAreaRef={textAreaRef}
          isLoading={isLoading}
        />
        <Space h={16} />
        <Button
          variant="filled"
          color="red"
          onClick={() => setMessages([])}
          w={200}
        >
          Clear Conversation
        </Button>
      </Container>
    </Stack>
  );
};

export default Chat;
