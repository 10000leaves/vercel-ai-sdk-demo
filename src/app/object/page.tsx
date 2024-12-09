'use client';

import { useState } from 'react';

type Profile = {
  name: string;
  age: number;
  isStudent: boolean;
  description: string;
};

export default function Page() {
  const [prompt, setPrompt] = useState('20代の学生');
  const [result, setResult] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/object', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        accumulated += new TextDecoder().decode(value);
        try {
          // 完全なJSONが受信されたら解析
          const parsed = JSON.parse(accumulated);
          setResult(parsed);
        } catch {
          // JSONの解析に失敗した場合は無視（まだストリーミング中）
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ペルソナのプロフィール生成</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プロフィールの説明を入力してください
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例: 20代の学生"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? '生成中...' : 'プロフィールを生成'}
        </button>
      </form>

      {result && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-medium">生成されたプロフィール</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-gray-600">名前:</div>
              <div className="col-span-2 font-medium">{result.name}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-gray-600">年齢:</div>
              <div className="col-span-2 font-medium">{result.age}歳</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-gray-600">学生:</div>
              <div className="col-span-2 font-medium">
                {result.isStudent ? 'はい' : 'いいえ'}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-gray-600">説明:</div>
              <div className="col-span-2 font-medium">{result.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}