'use client';
import { useFormContext } from 'react-hook-form';
import { createPresignedUrl } from '../../../actions/upload'; // TODO: server action
import { Button } from '../ui/button';

export default function StepUpload({ onBack }: { onBack: () => void }) {
    const { register, setValue, watch } = useFormContext();
    const file = watch('file');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const f = e.target.files[0];
        // TODO: show loading
        const { url, objectKey } = await createPresignedUrl(f.name, 'temp-id'); // formId 可在 submit 後補
        await fetch(url, { method: 'PUT', body: f });
        setValue('fileKey', objectKey);         // 寫進 RHF state
    };

    return (
        <>
            <input type="file" onChange={handleFileChange} />
            {file && <p className="text-sm mt-2">已選擇：{file.name}</p>}
            <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={onBack}>上一步</Button>
                <Button type="submit">送出評估</Button>   {/* handleSubmit 綁在父 <form> */}
            </div>
        </>
    );
}
