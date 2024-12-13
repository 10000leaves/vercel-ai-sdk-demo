import { streamText } from 'ai';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';

const bedrock = createAmazonBedrock({
  region: process.env.NEXT_AWS_BEDROCK_REGION ?? '',
  accessKeyId: process.env.NEXT_AWS_BEDROCK_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.NEXT_AWS_BEDROCK_SECRET_ACCESS_KEY ?? '',
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: bedrock('anthropic.claude-3-5-sonnet-20241022-v2:0'), // 生成AIのモデル
    system: 'あなたは役に立つアシスタントです。', // AIに行わせたい役割を記載
    messages,
  });
  return result.toDataStreamResponse();
}