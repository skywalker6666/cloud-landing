// src/app/actions/upload.ts
'use server';
import { supabaseBrowser } from '@/src/lib/supabaseBrowser';
import { randomUUID } from 'crypto';

export async function createPresignedUrl(filename: string, formId = 'uploads') {
    const ext = filename.split('.').pop();
    const objectKey = `${formId}/${randomUUID()}.${ext}`;

    const { data, error } = await supabaseBrowser
        .storage.from('uploads')
        .createSignedUploadUrl(objectKey);

    if (error) throw error;
    return { url: data.signedUrl, objectKey };
}
