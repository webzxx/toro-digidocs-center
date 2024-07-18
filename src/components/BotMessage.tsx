import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function BotMessage({ fetchMessage } : { fetchMessage: () => Promise<string> }
) {
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMessage() {
      const data= await fetchMessage();
      setLoading(false);
      const formattedMessage = data.replace(/\n/g, '<br />')
      setMessage(formattedMessage);
    }
    loadMessage();
  }, [fetchMessage]);

  return (
    <div className="mb-3 flex me-5 justify-start items-start">
      <Image src="/man.png" alt="Bot" width={24} height={24} className="rounded-sm mt-2 pr-1 outline" />
      <div className="rounded-lg bg-zinc-100 text-gray-900 py-1.5 px-3 text-sm sm:leading-6">
        {isLoading ? "..." : <span dangerouslySetInnerHTML={{ __html: message }} />}
      </div>
    </div>
  );
}
