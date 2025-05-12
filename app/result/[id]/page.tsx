// app/result/[id]/page.tsx
import { supabaseServer } from '@/src/lib/supabaseServer';
import { notFound } from 'next/navigation';

export default async function ResultPage({
    params,
}: {
    params: { id: string };
}) {
    // 1. 直接用 service-role key 撈資料
    const { data, error } = await supabaseServer
        .from('cloud_forms')
        .select('form_data, created_at, status')
        .eq('id', params.id)
        .single();

    // 2. 找不到就 404
    if (error || !data) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-3xl p-8 flex flex-col gap-6">
            <h1 className="text-2xl font-bold">表單已送出 ✅</h1>

            <div>
                <p className="text-sm text-gray-500">
                    送出時間：{new Date(data.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">狀態：{data.status}</p>
            </div>

            <pre className="bg-gray-100 rounded-lg p-4 text-sm overflow-auto">
                {JSON.stringify(data.form_data, null, 2)}
            </pre>
        </main>
    );
}
