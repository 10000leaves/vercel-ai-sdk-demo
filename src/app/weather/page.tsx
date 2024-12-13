'use client';

import { ToolInvocation } from 'ai';
import { Message, useChat } from 'ai/react';
import { useState } from 'react';

type WeatherInfo = {
  date: string;
  weather: string;
  maxTemp?: string;
  minTemp?: string;
  wind: string;
};

const WeatherCard = ({ weather }: { weather: WeatherInfo }) => {
  const getWeatherIcon = (weather: string) => {
    if (weather.includes('晴れ')) return '☀️';
    if (weather.includes('くもり')) return '☁️';
    if (weather.includes('雨')) return '🌧️';
    return '❓';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full hover:shadow-xl transition-shadow duration-300">
      <div className="text-xl font-bold text-center mb-4 text-gray-800">{weather.date}</div>
      <div className="flex flex-col items-center gap-3">
        <div className="text-6xl mb-3">{getWeatherIcon(weather.weather)}</div>
        <div className="text-md text-gray-600 font-medium">{weather.weather}</div>
        {weather.maxTemp && weather.minTemp && (
          <div className="flex items-center gap-6 mt-3 bg-gray-50 p-3 rounded-lg w-full justify-center">
            <div className="text-red-500 flex flex-col items-center">
              <span className="text-sm font-medium">最高気温</span>
              <span className="text-2xl font-bold">{weather.maxTemp}°</span>
            </div>
            <div className="text-blue-500 flex flex-col items-center">
              <span className="text-sm font-medium">最低気温</span>
              <span className="text-2xl font-bold">{weather.minTemp}°</span>
            </div>
          </div>
        )}
        <div className="text-sm text-gray-600 mt-3 flex items-center gap-2 bg-gray-50 p-3 rounded-lg w-full justify-center">
          <span className="text-lg">💨</span>
          <span className="font-medium">{weather.wind}</span>
        </div>
      </div>
    </div>
  );
};

const ChatMessage = ({ message }: { message: Message }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[80%] p-4 rounded-2xl ${
      message.role === 'user' 
        ? 'bg-blue-500 text-white' 
        : 'bg-white text-gray-800'
    }`}>
      <div className="font-bold mb-1">
        {message.role === 'user' ? 'あなた' : 'AI'}
      </div>
      <div className="whitespace-pre-wrap">{message.content}</div>
    </div>
  </div>
);

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult, isLoading } = useChat({
    api: '/api/chat',
    maxSteps: 5,
  });
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">東京の天気予報</h1>
          <p className="text-center text-gray-600">
            天気を知りたい時は「天気を教えて」と入力してください
          </p>
        </div>

        <div className="space-y-6 mb-24">
          {messages.map((m: Message) => (
            <div key={m.id} className="space-y-4">
              <ChatMessage message={m} />
              
              {'toolInvocations' in m && m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                const toolCallId = toolInvocation.toolCallId;
                const addResult = (result: string) =>
                  addToolResult({ toolCallId, result });

                if (toolInvocation.toolName === 'askForConfirmation') {
                  return (
                    <div key={toolCallId} className="bg-yellow-50 rounded-xl p-6 shadow-md">
                      <p className="text-gray-800 mb-4">{toolInvocation.args.message}</p>
                      {'result' in toolInvocation ? (
                        <div className="font-bold text-gray-800">{toolInvocation.result}</div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => addResult('はい')}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                          >
                            はい
                          </button>
                          <button
                            onClick={() => addResult('いいえ')}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                          >
                            いいえ
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                if (toolInvocation.toolName === 'getWeatherInformation' && 'result' in toolInvocation) {
                  return (
                    <div key={toolCallId} className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {toolInvocation.result.forecast.map((weather: WeatherInfo, index: number) => (
                          <WeatherCard key={index} weather={weather} />
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4 max-w-[80%]">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className={`relative rounded-xl transition-all duration-200 ${
              isFocused ? 'ring-2 ring-blue-500' : 'border border-gray-300'
            }`}>
              <input
                className="w-full p-4 rounded-xl focus:outline-none"
                value={input}
                placeholder="メッセージを入力してください..."
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                disabled={isLoading}
              >
                送信
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}