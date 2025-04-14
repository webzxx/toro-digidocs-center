import { FC } from "react";
import Image from "next/image";

interface ChatHeaderProps {
  status?: "online" | "offline" | "away";
  onClearChat?: () => void;
}

const ChatHeader: FC<ChatHeaderProps> = ({ 
  status = "online",
  onClearChat,
}) => {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
  };

  return (
    <div className='flex w-full items-center justify-between gap-3 border-b border-zinc-200 bg-white/80 px-4 py-3 text-zinc-800 backdrop-blur-sm'>
      <div className='flex items-center gap-3'>
        {/* AI Avatar with Status Indicator */}
        <div className='relative hidden sm:block'>
          <div className='h-10 w-10 overflow-hidden rounded-full'>
            <Image 
              src="/man.png" 
              alt="AI Assistant" 
              width={40} 
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ${statusColors[status]} ring-2 ring-white`} />
        </div>
        
        <div className='flex flex-col items-start'>
          <p className='text-xs font-medium text-zinc-500'>Chat with</p>
          <div className='flex items-center gap-1.5'>
            <div className={`h-2.5 w-2.5 rounded-full ${statusColors[status]} sm:hidden`} />
            <p className='text-sm font-semibold sm:text-base'>AI Support</p>
          </div>
        </div>
      </div>
      
      {onClearChat && (
        <button
          onClick={onClearChat}
          className="hidden rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 sm:block"
          title="Clear chat history"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
