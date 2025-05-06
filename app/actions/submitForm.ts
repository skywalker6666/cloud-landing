'use server';
import { supabaseServer } from '@/lib/supabase';
import { z } from 'zod';
import { createPresignedUrl } from '../actions/upload';  // 見下

export const formSchema = z.object({
  systemName: z.string().min(2),
  webCount: z.number().int().positive(),
  // ... 其餘欄位
  fileKey: z.string().optional(),         // 上傳完成後前端塞進來
});

export async function submitForm(data: unknown) {
  const parsed = formSchema.parse(data);
  console.log('接收到資料:', parsed);

  const { data: row, error } = await supabaseServer
    .from('cloud_forms')
    .insert({ form_data: parsed })        // status 預設 new
    .select('id')
    .single();

  if (error) throw error;

  return { ok: true, id: row.id };
}
