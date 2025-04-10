import React, { useEffect, useRef } from "react";

export default function ChatMessages({ messages } : { messages: JSX.Element[] }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (el.current) {
      el.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  });
  return (
    <div className="h-full grow overflow-y-auto px-3">
      {messages}
      <div id={"el"} ref={el} />
    </div>
  );
}
