// src/components/steps/Step1.tsx
// ──────────────────────────────────────────
// 「基本資訊」步驟
// Props: onNext: () => void
'use client';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
    onNext: () => void;
}

export default function Step1({ onNext }: Props) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Card className="w-full max-w-xl mx-auto">
            <CardContent className="space-y-6 pt-6">
                {/* 系統名稱 */}
                <div>
                    <label htmlFor="systemName" className="block text-sm font-medium mb-1">
                        系統名稱 <span className="text-red-600">*</span>
                    </label>
                    <Input id="systemName" placeholder="如：CRM‑Prod" {...register('systemName')} />
                    {errors.systemName && (
                        <p className="text-xs text-red-600 mt-1">{String(errors.systemName.message)}</p>
                    )}
                </div>

                {/* 系統描述 (選填) */}
                <div>
                    <label htmlFor="systemDesc" className="block text-sm font-medium mb-1">
                        系統描述 (選填)
                    </label>
                    <Input id="systemDesc" placeholder="簡短描述此系統功能" {...register('systemDesc')} />
                </div>

                <div className="flex justify-end">
                    <Button type="button" onClick={onNext}>
                        下一步
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
