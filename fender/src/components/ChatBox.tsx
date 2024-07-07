import React from "react";
import { Group, Textarea, ActionIcon, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCalculator, IconSend } from "@tabler/icons-react";

interface ChatBoxProps {
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => Promise<void>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  isLoading: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  setUserInput,
  handleKeyDown,
  textAreaRef,
  isLoading,
}) => {
  const handleCalculatorIconClick = () => {
    notifications.show({
      title: "This is awkward...",
      message: "That one's readonly 🤥",
      autoClose: 3000,
      withBorder: true,
    });
  };
  const calculatorIcon = (
    <IconCalculator
      style={{ width: rem(16), height: rem(16) }}
      onClick={handleCalculatorIconClick}
    />
  );

  return (
    <Group p={"xs"} style={{ justifyContent: "center" }}>
      <Textarea
        aria-label="Chat input"
        size="lg"
        radius="lg"
        placeholder="Ask me"
        rightSectionPointerEvents="visible"
        rightSection={calculatorIcon}
        autosize
        w={850}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={textAreaRef}
        disabled={isLoading}
      />
      <ActionIcon
        onClick={() =>
          handleKeyDown({
            key: "Enter",
            preventDefault: () => {},
          } as React.KeyboardEvent<HTMLTextAreaElement>)
        }
        variant="gradient"
        size="lg"
        disabled={textAreaRef.current?.value === "" || isLoading}
      >
        <IconSend />
      </ActionIcon>
    </Group>
  );
};

export default ChatBox;
