'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } = useChat();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">生成AIとチャット</h1>
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}
      {isLoading && <div className="whitespace-pre-wrap">回答中</div> }
      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-2xl p-2 mb-8 border border-gray-300 rounded-md">
        <input
          className="w-full p-2 border border-gray-300 rounded"
          value={input}
          placeholder="メッセージを入力してください..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}