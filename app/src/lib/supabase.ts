import { createClient } from '@supabase/supabase-js';
export const supabaseBrowser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,      // 僅用於 Server Action
    { auth: { persistSession: false } }
);
