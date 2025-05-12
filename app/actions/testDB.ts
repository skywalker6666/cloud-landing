// app/actions/testDb.ts
'use server';

import { supabaseServer } from '@/src/lib/supabaseServer';

/** 簡單撈一筆資料來確認連線 (或改成你自己的 table) */
export async function testDbConnection() {
  // 任何 read-only 的 SQL / table 都可以
  const { data, error } = await supabaseServer
    .from('cloud_forms')
    .select('id')
    .limit(1);

  if (error) {
    console.error('[DB TEST] 連線失敗：', error);
    throw new Error(`DB connection failed – ${error.message}`);
  }

  console.log('[DB TEST] 連線成功，取回資料：', data);
  return { ok: true, sample: data };
}
