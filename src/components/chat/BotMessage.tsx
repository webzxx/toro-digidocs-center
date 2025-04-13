import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface BotMessageProps {
  fetchMessage: () => Promise<string>;
}

export default function BotMessage({ fetchMessage }: BotMessageProps) {
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMessage() {
      const data = await fetchMessage();
      setLoading(false);
      setMessage(data);
    }
    loadMessage();
  }, [fetchMessage]);

  return (
    <div className="flex items-start">
      <div className="relative mr-2 flex-shrink-0">
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <Image 
            src="/man.png" 
            alt="AI Assistant" 
            width={32} 
            height={32}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2 text-sm text-zinc-800 shadow-sm">
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
          </div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {message}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
