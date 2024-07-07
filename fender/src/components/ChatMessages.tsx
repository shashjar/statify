import React from "react";
import { Loader, Stack, ScrollArea } from "@mantine/core";
import { type ChatMessage as ChatMessageType } from "../types";
import ChatMessage from "./ChatMessage";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  viewportRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  viewportRef,
}) => {
  return (
    <Stack gap={"sm"}>
      <ScrollArea
        scrollbarSize={3}
        viewportRef={viewportRef}
        style={{ height: "72vh" }}
      >
        <Stack>
          {messages.map((msg, id) => {
            return <ChatMessage key={id} message={msg} />;
          })}
          {isLoading && <Loader color="blue" />}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export default ChatMessages;
