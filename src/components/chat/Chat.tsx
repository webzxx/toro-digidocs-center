"use client";

import { FC, useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { X, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validators/message";
import { useMutation } from "@tanstack/react-query";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";

interface MessageData {
  id: string;
  isUserMessage: boolean;
  content: string;
}

const Chat: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [messages, setMessages] = useState<JSX.Element[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasInitializedMessages, setHasInitializedMessages] = useState<boolean>(false);
  
  // Use a ref to persist message data between open/close states
  const messagesDataRef = useRef<MessageData[]>([]);
  
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

  // Initialize messages when opening chat
  useEffect(() => {
    if (isOpen && !hasInitializedMessages) {
      // If we have message data in the ref, convert it to JSX elements
      if (messagesDataRef.current.length > 0) {
        const restoredMessages = messagesDataRef.current.map((msgData, index) => {
          if (msgData.isUserMessage) {
            return <UserMessage key={`user-${msgData.id}`} text={msgData.content} />;
          } else {
            // Pass the content directly as initialContent to avoid fetching
            return (
              <BotMessage
                key={`bot-${msgData.id}`}
                fetchMessage={async () => msgData.content}
                initialContent={msgData.content}
              />
            );
          }
        });
        
        setMessages(restoredMessages);
      } else {
        // Otherwise, initialize with welcome message
        const initialMessageId = nanoid();
        
        // Create a loading state for the initial message
        setIsLoading(true);
        
        // Fetch the initial message first, then create the BotMessage with initialContent
        sendMessage({ id: initialMessageId, isUserMessage: false, text: "start" })
          .then(botResponse => {
            // Store in ref
            messagesDataRef.current = [{
              id: initialMessageId,
              isUserMessage: false,
              content: botResponse,
            }];
            
            // Create message with initialContent to prevent additional fetch
            setMessages([
              <BotMessage
                key={`bot-${initialMessageId}`}
                fetchMessage={async () => botResponse}
                initialContent={botResponse}
                isLoading={false}
              />,
            ]);
          })
          .catch(error => {
            console.error("Failed to get initial bot response:", error);
          });
      }
      setHasInitializedMessages(true);
    }
  }, [isOpen, hasInitializedMessages, sendMessage]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const messageId = nanoid();
    const botMessageId = nanoid();
    
    // Store user message in ref
    messagesDataRef.current = [
      ...messagesDataRef.current,
      {
        id: messageId,
        isUserMessage: true,
        content: input,
      },
    ];
    
    // Create a message object for the API
    const userMessage: Message = {
      id: botMessageId,
      isUserMessage: true,
      text: input,
    };
    
    // Add user message to UI immediately
    setMessages(prev => [
      ...prev,
      <UserMessage key={`user-${messageId}`} text={input} />,
    ]);
    
    setInput("");
    
    // Add a loading bot message immediately
    setMessages(prev => [
      ...prev,
      <BotMessage
        key={`bot-${botMessageId}`}
        fetchMessage={async () => ""}
        isLoading={true}
      />,
    ]);
    
    // Fetch the bot response
    try {
      setIsLoading(true);
      const botResponse = await sendMessage(userMessage);
      setIsLoading(false);
      
      // Update the ref with the bot response
      messagesDataRef.current = [
        ...messagesDataRef.current,
        {
          id: botMessageId,
          isUserMessage: false,
          content: botResponse,
        },
      ];
      
      // Replace the loading message with the actual response
      setMessages(prev => [
        ...prev.slice(0, -1),
        <BotMessage
          key={`bot-${botMessageId}`}
          fetchMessage={async () => botResponse}
          initialContent={botResponse}
          isLoading={false}
        />,
      ]);
    } catch (error) {
      console.error("Failed to get bot response:", error);
      setIsLoading(false);
    }
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClearChat = () => {
    // Reset messages and clear the ref
    messagesDataRef.current = [];
    setHasInitializedMessages(false);
    setMessages([]);
    
    // Re-initialize with welcome message
    const initialMessageId = nanoid();
    
    // Create a loading state for the initial message
    setIsLoading(true);
    
    // Fetch the initial message first, then create the BotMessage with initialContent
    sendMessage({ id: initialMessageId, isUserMessage: false, text: "start" })
      .then(botResponse => {
        // Store in ref
        messagesDataRef.current = [{
          id: initialMessageId,
          isUserMessage: false,
          content: botResponse,
        }];
        
        // Create message with initialContent to prevent additional fetch
        setMessages([
          <BotMessage
            key={`bot-${initialMessageId}`}
            fetchMessage={async () => botResponse}
            initialContent={botResponse}
            isLoading={false}
          />,
        ]);
      })
      .catch(error => {
        console.error("Failed to get initial bot response:", error);
      });
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
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
              <ChatHeader status="online" onClearChat={handleClearChat} />
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
