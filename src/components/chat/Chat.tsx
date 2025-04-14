"use client";

import { FC, useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { X, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validators/message";
import { useMutation } from "@tanstack/react-query";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import { STORAGE_KEYS } from "@/lib/utils";

const Chat: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [messages, setMessages] = useState<JSX.Element[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoadedInitialMessages, setHasLoadedInitialMessages] = useState<boolean>(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      // Create an array to collect the message data
      const messageData: Array<{
        id: string;
        isUserMessage: boolean;
        text: string | undefined;
      }> = [];
      
      // Process the messages and extract their text content
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const isUserMessage = msg.type === UserMessage;
        
        // For user messages, directly extract the text prop
        if (isUserMessage && msg.props.text) {
          messageData.push({
            id: `msg-${i}`,
            isUserMessage: true,
            text: msg.props.text,
          });
        } 
        // For bot messages, we need to handle them differently
        else if (msg.type === BotMessage) {
          // Store the bot's processed message
          // Since fetchMessage is a function, we'll mark it to be loaded later
          messageData.push({
            id: `msg-${i}`,
            isUserMessage: false,
            text: msg.props.children?.props?.dangerouslySetInnerHTML?.__html || 
                  "Hello! How can I help you today? (Type 'start' to show quick links)",
          });
        }
      }
      
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messageData));
    }
  }, [messages]);

  const { mutateAsync: sendMessage } = useMutation<string, unknown, Message>({
    mutationFn: async (message: Message) => {
      setIsLoading(true);
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      setIsLoading(false);
      const data = await response.json();
      return data.message;
    },
  });

  // Load messages from localStorage on initial mount
  useEffect(() => {
    if (isOpen && !hasLoadedInitialMessages) {
      const loadSavedMessages = async () => {
        try {
          const savedMessages = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
          
          if (savedMessages) {
            const parsedMessages = JSON.parse(savedMessages) as Array<{
              id: string;
              isUserMessage: boolean;
              text: string | undefined;
            }>;
            
            if (parsedMessages.length > 0) {
              const newMessages: JSX.Element[] = [];
              
              for (const msg of parsedMessages) {
                if (msg.isUserMessage && msg.text) {
                  newMessages.push(<UserMessage key={`user-${msg.id}`} text={msg.text} />);
                } else {
                  // Fixed: Use the actual text from saved message instead of a default message
                  const botMessage = msg.text || "Hello! How can I help you today?";
                  newMessages.push(
                    <BotMessage
                      key={`bot-${msg.id}`}
                      fetchMessage={async () => botMessage}
                    />,
                  );
                }
              }
              
              setMessages(newMessages);
              setHasLoadedInitialMessages(true);
              return;
            }
          }
          
          setMessages([
            <BotMessage
              key="0"
              fetchMessage={async () => sendMessage({ id: nanoid(), isUserMessage: false, text: "start" })}
            />,
          ]);
          setHasLoadedInitialMessages(true);
        } catch (error) {
          console.error("Error loading saved messages:", error);
          setMessages([
            <BotMessage
              key="0"
              fetchMessage={async () => sendMessage({ id: nanoid(), isUserMessage: false, text: "start" })}
            />,
          ]);
          setHasLoadedInitialMessages(true);
        }
      };
      
      loadSavedMessages();
    }
  }, [isOpen, hasLoadedInitialMessages, sendMessage]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
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
    setInput("");
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClearChat = () => {
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    setMessages([
      <BotMessage
        key="0"
        fetchMessage={async () => sendMessage({ id: nanoid(), isUserMessage: false, text: "start" })}
      />,
    ]);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={handleToggleChat}
          className="fixed bottom-5 right-5 z-50 flex h-12 w-12 animate-fadeIn items-center justify-center rounded-full bg-primary shadow-lg transition-all hover:bg-primary/90 sm:bottom-8 sm:right-8"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div 
          className={`fixed bottom-0 right-0 z-50 flex h-full w-full 
                    flex-col overflow-hidden bg-white sm:bottom-8 sm:right-8 sm:h-[600px] sm:max-h-[80vh]
                    sm:w-96 sm:rounded-lg sm:border sm:border-gray-200 sm:shadow-lg 
                    ${isMobile ? "animate-slideUp" : "animate-fadeIn"}`}
        >
          {isMobile && (
            <div className="absolute right-0 top-0 z-50 flex items-center p-2">
              <button 
                onClick={handleClearChat}
                className="mr-1 rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
                title="Clear chat history"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={handleToggleChat}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
              >
                <X size={18} />
              </button>
            </div>
          )}
          
          <div className="flex h-full flex-col">
            <div onClick={() => !isMobile && handleToggleChat()} className="cursor-pointer sm:cursor-default">
              <ChatHeader 
                status="online"
                onClearChat={handleClearChat}
              />
            </div>
            
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-3">
                <ChatMessages messages={messages} />
              </div>
              
              <div className="border-t border-gray-200 p-3">
                <ChatInput 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onSend={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
