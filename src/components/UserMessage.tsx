import React from "react";

export default function UserMessage({ text }: { text: string }) {
  return (
    <div className="mb-3 flex items-center ms-5 justify-end">
      <div className="rounded-lg bg-zinc-900 text-gray-100 py-1.5 px-3 text-sm sm:leading-6">
        {text}
      </div>
    </div>
  );
}
