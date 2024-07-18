import React, { useEffect, useRef } from "react";

export default function ChatMessages({ messages } : { messages: JSX.Element[] }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (el.current) {
      el.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  });
  return (
    <div className="grow overflow-y-auto h-full px-3">
      {messages}
      <div id={"el"} ref={el} />
    </div>
  );
}
