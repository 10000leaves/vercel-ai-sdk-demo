import { streamText, tool } from 'ai';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { z } from 'zod';

const bedrock = createAmazonBedrock({
  region: process.env.NEXT_AWS_BEDROCK_REGION ?? '',
  accessKeyId: process.env.NEXT_AWS_BEDROCK_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.NEXT_AWS_BEDROCK_SECRET_ACCESS_KEY ?? '',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = await streamText({
    model: bedrock('anthropic.claude-3-5-sonnet-20241022-v2:0'),
    system: `あなたは天気予報を提供するアシスタントです。ユーザーが天気に関する質問をしたら、askForConfirmationツールを使用してユーザーに確認を求めてください。ユーザーが「はい」などの回答をしたら、getWeatherInformationツールを使用して最新の天気予報を取得してください。`,
    messages,
    tools: {
      getWeatherInformation: tool({
        description: '東京の天気予報を取得する',
        parameters: z.object({
          dummy: z.string().optional(),
        }),
        execute: async () => {
          const response = await fetch('https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json');
          const data = await response.json();
          
          // 東京地方のデータを抽出
          const tokyoArea = data[0].timeSeries[0].areas[0];
          const temperatures = data[0].timeSeries[2].areas[0].temps;
          
          return {
            forecast: tokyoArea.weatherCodes.map((code: string, index: number) => ({
              date: index === 0 ? "今日" : index === 1 ? "明日" : "明後日",
              weather: tokyoArea.weathers[index],
              wind: tokyoArea.winds[index],
              maxTemp: temperatures[index * 2 + 1],
              minTemp: temperatures[index * 2],
            }))
          };
        },
      }),
      askForConfirmation: tool({
        description: 'ユーザーに確認を求める',
        parameters: z.object({
          message: z.string().describe('確認を求めるメッセージ'),
        }),
      }),
    },
  });
  
  return result.toDataStreamResponse();
}