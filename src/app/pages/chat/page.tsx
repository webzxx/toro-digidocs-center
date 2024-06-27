'use client';

import { useChat } from '@ai-sdk/react';


export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        // Provide necessary options for useChat hook
        api: 'sk-proj-yLonmpDCdk5XITxGdyOQT3BlbkFJC214hRh4s9L29gql4VEc',
        initialMessages: [],
        initialInput: '',
      });

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-0">
          
        {/* First Section */}
        <section id="first-section" className="relative flex justify-center items-center w-full py-8">
        <div className="w-full max-w-4xl text-center relative">
          <h2 className="text-7xl mb-8">CHAT</h2>
          <div className="bg-white rounded-lg shadow-lg border border-stone-300 p-8 h-[44rem] overflow-y-auto">
            {messages.length > 0
              ? messages.map((m) => (
                  <div key={m.id} className="whitespace-pre-wrap mb-2">
                    {m.role === "user" ? "User:" : "AI:"} {m.content}
                  </div>
                ))
              : null}
            {/* Placeholder div to prevent content from being covered by the form */}
            <div className="h-20"></div>
          </div>
          <form onSubmit={handleSubmit} className="absolute bottom-0 w-full max-w-4xl p-4 bg-white border-t border-gray-300">
            <input 
              type="text" 
              className="w-full border border-gray-500 p-2"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          </form>
        </div>
      </section>
  
      </main>
    )
  }
  