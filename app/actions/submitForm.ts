import { supabaseBrowser } from '@/src/lib/supabaseBrowser';
import { formSchema } from './schema';

export async function submitForm(data: unknown) {
  const parsed = formSchema.parse(data);
  console.log('接收到資料:', parsed);

  const { data: row, error } = await supabaseBrowser
    .from('cloud_forms')
    .insert({ form_data: parsed })        // status 預設 new
    .select('id')
    .single();

  if (error) throw error;

  return { ok: true, id: row.id };
}
