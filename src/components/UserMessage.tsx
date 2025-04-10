import React from "react";

export default function UserMessage({ text }: { text: string }) {
  return (
    <div className="mb-3 ms-5 flex items-center justify-end">
      <div className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-gray-100 sm:leading-6">
        {text}
      </div>
    </div>
  );
}
