import { z } from 'zod';

// 回答させたいスキーマを定義
export const profileSchema = z
  .object({
    name: z.string().describe('名前'),
    age: z.number().describe('年齢'),
    isAccount: z.string().describe('証券口座を開設しているか、していないか'),
    description: z.string().describe('詳細なプロフィール'),
    problem: z.string().describe('抱えている課題'),
  });