import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { streamObject } from 'ai';
import { profileSchema } from './schema';

export const runtime = 'edge';

const bedrock = createAmazonBedrock({
  region: process.env.NEXT_AWS_BEDROCK_REGION ?? '',
  accessKeyId: process.env.NEXT_AWS_BEDROCK_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.NEXT_AWS_BEDROCK_SECRET_ACCESS_KEY ?? '',
});

export async function POST(req: Request) {
  const value = await req.json();

  const result = await streamObject({
    model: bedrock('anthropic.claude-3-5-sonnet-20241022-v2:0'),
    schema: profileSchema,
    prompt: `以下の人物プロフィールを生成してください：${value}`,
  });

  return result.toTextStreamResponse();
}