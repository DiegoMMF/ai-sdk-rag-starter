'use client';

import { useChat } from 'ai/react';

/* 
The useChat hook enables the streaming of chat messages from your AI provider, 
manages the state for chat input, and updates the UI automatically as new messages 
are received.
*/

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* 
      The messages array contains all the messages in the chat, including the 
      system messages.
      */}
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              <p>{m.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 
      The form component is used to submit the chat input to the server.
      */}
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}