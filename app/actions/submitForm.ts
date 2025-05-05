// app/actions/submitForm.ts
'use server';
import { z } from 'zod';
const schema = z.object({
  systemName: z.string().min(2),
  webCount: z.number().positive(),
  // 其餘欄位...
});
export async function submitForm(data: unknown) {
  const parsed = schema.parse(data);
  // TODO: 呼叫暫時的 mock API 或寫 SQLite
  console.log('Form accepted:', parsed);
  return { ok: true, id: crypto.randomUUID() };
}
