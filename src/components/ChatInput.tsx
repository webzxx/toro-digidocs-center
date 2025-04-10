"use client";

import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import TextareaAutosize from "react-textarea-autosize";
import { Message } from "@/lib/validators/message";
import ChatMessages from "./ChatMessages";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<JSX.Element[]>([]);

  const { mutateAsync: sendMessage } = useMutation<string, unknown, Message>({
    mutationFn: async (message: Message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      const data = await response.json();
      console.log("Response:", data);
      return data.message;
    },
    onSuccess: (data) => {

    },
  });

  useEffect(() => {
    async function loadWelcomeMessage() {
      setMessages([
        <BotMessage
          key="0"
          fetchMessage={async () => sendMessage({ id: nanoid(), isUserMessage: false, text: "start" })}
        />,
      ]);
    }
    loadWelcomeMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div {...props} className={cn("border-t border-zinc-300 h-full", className)}>
      <div className='relative mt-4 flex h-full flex-col justify-between rounded-lg border-none outline-none '>
        <ChatMessages messages={messages} />
        <TextareaAutosize
          rows={2}
          onKeyDown={(e) => {
            if(e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              const message: Message = {
                id: nanoid(),
                isUserMessage: true,
                text: input,
              };

              const newMessages = messages.concat(
                <UserMessage key={messages.length + 1} text={input} />,
                <BotMessage
                  key={messages.length + 2}
                  fetchMessage={async () => sendMessage(message)}
                />,
              );
              setMessages(newMessages);
              // clear input
              setInput("");
            }
          }}
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          placeholder='Write a message...'
          className='peer block w-full resize-none overflow-hidden border-0 bg-zinc-100 py-1.5 pr-14 text-sm text-gray-900 focus:ring-0 disabled:opacity-50 sm:leading-6'
        />
      </div>
    </div>
  );
};

export default ChatInput;
