import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
  messages?: JSX.Element[];
  className?: string;
}

export default function ChatMessages({ messages = [], className }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  return (
    <div className={cn("flex h-full flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200", className)}>
      <div className="flex flex-col gap-3 py-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className="animate-messageIn"
          >
            {message}
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
