import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function BotMessage({ fetchMessage } : { fetchMessage: () => Promise<string> },
) {
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMessage() {
      const data= await fetchMessage();
      setLoading(false);
      const formattedMessage = data.replace(/\n/g, "<br />");
      setMessage(formattedMessage);
    }
    loadMessage();
  }, [fetchMessage]);

  return (
    <div className="mb-3 me-5 flex items-start justify-start">
      <Image src="/man.png" alt="Bot" width={24} height={24} className="mt-2 rounded-sm pr-1 outline" />
      <div className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-gray-900 sm:leading-6">
        {isLoading ? "..." : <span dangerouslySetInnerHTML={{ __html: message }} />}
      </div>
    </div>
  );
}
