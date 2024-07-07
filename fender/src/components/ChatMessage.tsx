import { Flex, Alert, Text } from "@mantine/core";
import { type ChatMessage as ChatMessageType } from "../types";
import { IconBallBasketball, IconMan } from "@tabler/icons-react";

interface ChatMessageProps {
  key: number;
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const icon = message.sender === "ai" ? <IconBallBasketball /> : <IconMan />;
  const color = message.sender === "ai" ? "orange" : "blue";
  const justify = message.sender === "ai" ? "flex-start" : "flex-end";

  return (
    <Flex justify={justify} align={"center"} m={"xs"}>
      <Alert
        variant="light"
        color={color}
        radius={"lg"}
        icon={icon}
        style={{
          maxWidth: "80%",
          marginLeft: message.sender === "ai" ? 10 : 0,
          marginRight: message.sender === "ai" ? 0 : 10,
        }}
      >
        <Text ta={"left"}>{message.content}</Text>
      </Alert>
    </Flex>
  );
};

export default ChatMessage;
