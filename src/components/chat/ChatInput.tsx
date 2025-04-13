"use client";

import { cn } from "@/lib/utils";
import { FC, HTMLAttributes, ChangeEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Send } from "lucide-react";

interface ChatInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  isLoading: boolean;
}

const ChatInput: FC<ChatInputProps> = ({ 
  className, 
  value, 
  onChange, 
  onSend, 
  isLoading,
  ...props 
}) => {
  return (
    <div {...props} className={cn("w-full", className)}>
      <div className="relative">
        <TextareaAutosize
          rows={1}
          onKeyDown={(e) => {
            if(e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          maxRows={4}
          value={value}
          onChange={onChange}
          autoFocus
          placeholder="Write a message..."
          className="peer block w-full resize-none rounded-md border border-zinc-200 bg-transparent py-2.5 pl-3 pr-10 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 sm:leading-6"
        />
        
        <button 
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          className={cn(
            "absolute right-2 top-2.5 rounded-full p-1 transition-colors",
            value.trim() 
              ? "bg-primary text-white hover:bg-primary/90" 
              : "bg-gray-200 text-gray-500 cursor-not-allowed",
          )}
        >
          <Send size={16} className={isLoading ? "animate-pulse" : ""} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
