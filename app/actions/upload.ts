// src/app/actions/upload.ts
'use server';
import { supabaseServer } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function createPresignedUrl(filename: string, formId: string) {
    const ext = filename.split('.').pop();
    const objectKey = `${formId}/${randomUUID()}.${ext}`;

    const { data, error } = await supabaseServer
        .storage.from('uploads')
        .createSignedUploadUrl(objectKey);

    if (error) throw error;
    return { url: data.signedUrl, objectKey };
}
