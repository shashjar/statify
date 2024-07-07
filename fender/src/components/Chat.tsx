import React, { useRef, useState } from "react";
import { Stack, Button, Space, Container } from "@mantine/core";
import NavBar from "./NavBar";
import ChatMessages from "./ChatMessages";
import ChatBox from "./ChatBox";
import { ChatMessage } from "../types";
import axios from "axios";

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

  const chatWithAI = async (userInput: string): Promise<string> => {
    try {
      // TODO: set base URL using environment variable for dev & prod
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        userInput,
      });
      return response.data.aiResponse;
    } catch (error) {
      console.error("There was a problem with the Axios request:", error);
      return "";
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
      messages.push({ sender: "user", content: userInput });

      const aiResponse = await chatWithAI(userInput);
      messages.push({ sender: "ai", content: aiResponse });

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
