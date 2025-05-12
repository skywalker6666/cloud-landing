'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/actions/schema';
import { createPresignedUrl } from '@/actions/upload';
import { submitForm } from '@/actions/submitForm';


export const StepIdx = {
    Basic: 0,
    Compute: 1,
    Database: 2,
    Network: 3,
    Upload: 4,
} as const;
type StepIdxType = typeof StepIdx[keyof typeof StepIdx];
const steps = [
    { id: StepIdx.Basic, title: '基本資訊' },
    { id: StepIdx.Compute, title: '運算資源' },
    { id: StepIdx.Database, title: '資料庫' },
    { id: StepIdx.Network, title: '流量 & 備份' },
    { id: StepIdx.Upload, title: '檔案上傳' },
];
interface StepIndicatorProps {
    current: StepIdxType;
}
function StepIndicator({ current }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            {steps.map((s, idx) => (
                <div key={s.id} className="flex-1 text-center">
                    <div
                        className={`w-8 h-8 mx-auto rounded-full border-2 ${idx <= current
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 text-gray-500'
                            } flex items-center justify-center font-bold`}
                    >
                        {idx + 1}
                    </div>
                    <p className="text-sm mt-2">{s.title}</p>
                </div>
            ))}
        </div>
    );
}


export default function MultiStepForm() {
    const router = useRouter();
    const methods = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onBlur',
    });
    const stepFields: Record<StepIdxType, (keyof FormValues)[]> = {
        [StepIdx.Basic]: ['systemName'],
        [StepIdx.Compute]: ['webServerType', 'webServerCount', 'interfaceCount'],
        [StepIdx.Database]: ['dbType', 'dbCores', 'dbRam', 'dbSize'],
        [StepIdx.Network]: [
            'concurrency',
            'trafficPeak',
            'backupFrequency',
            'backupRetention',
        ],
        [StepIdx.Upload]: ['archKey'], // fwKey 可選
    };
    // 3. onNext 驗證當前步驟欄位
    const onNext = async () => {
        const valid = await methods.trigger(stepFields[step]);
        if (valid) next();
    };

    // 4. 最終送出（只在 Upload 步驟）
    const onFinalSubmit = methods.handleSubmit(async (values) => {
        try {
            const { id } = await submitForm(values);
            router.push(`/result/${id}`);
        } catch (err) {
            console.error(err);
            alert('送出失敗');
        }
    });
    const [step, setStep] = useState<StepIdxType>(StepIdx.Basic);

    const next = () => setStep((s) => (Math.min(s + 1, StepIdx.Upload) as StepIdxType));
    const prev = () => setStep((s) => (Math.max(s - 1, StepIdx.Basic) as StepIdxType));

    /* 檔案即時上傳 */
    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'archKey' | 'fwKey'
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const { url, objectKey } = await createPresignedUrl(file.name);
        await fetch(url, { method: 'PUT', body: file });
        methods.setValue(field, objectKey, { shouldValidate: true });
    };

    /* 最終送出 */
    const onSubmit = async (values: FormValues) => {
        if (step < StepIdx.Upload) {
            next();
            return;
        }
        try {
            const { id } = await submitForm(values);
            router.push(`/result/${id}`);
        } catch (err) {
            console.error(err);
            alert('送出失敗');
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="max-w-3xl mx-auto p-6"
            >
                <StepIndicator current={step} />

                {/* 卡片容器 */}
                <Card className="mb-6 shadow-xl rounded-2xl p-6">
                    <CardContent>
                        {/* Step 0 */}
                        {step === StepIdx.Basic && (
                            <div className="grid gap-4">
                                <Input
                                    {...methods.register('systemName', { required: true })}
                                    placeholder="系統名稱"
                                />
                                <Input
                                    {...methods.register('systemDesc')}
                                    placeholder="系統描述 (選填)"
                                />
                            </div>
                        )}

                        {/* Step 1 */}
                        {step === StepIdx.Compute && (
                            <div className="grid gap-4">
                                <Input
                                    {...methods.register('webServerType', { required: true })}
                                    placeholder="Web Server 類型 (Nginx/Tomcat)"
                                />
                                <Input
                                    type="number"
                                    {...methods.register('webServerCount', { required: true, min: 1,valueAsNumber: true })}
                                    placeholder="Web Server 數量"
                                />
                                <Input
                                    type="number"
                                    {...methods.register('interfaceCount', { required: true, min: 0,valueAsNumber: true })}
                                    placeholder="介面 / API Server 數量"
                                />
                            </div>
                        )}

                        {/* Step 2 */}
                        {step === StepIdx.Database && (
                            <div className="grid gap-4">
                                <Input {...methods.register('dbType', { required: true })} placeholder="資料庫類型 (PostgreSQL)" />
                                <Input type="number" {...methods.register('dbCores', { required: true, min: 1 ,valueAsNumber: true})} placeholder="DB Core 數" />
                                <Input type="number" {...methods.register('dbRam', { required: true, min: 1 ,valueAsNumber: true})} placeholder="DB RAM (GB)" />
                                <Input type="number" {...methods.register('dbSize', { required: true, min: 1,valueAsNumber: true })} placeholder="DB 資料量 (GB)" />
                            </div>
                        )}

                        {/* Step 3 */}
                        {step === StepIdx.Network && (
                            <div className="grid gap-4">
                                <Input type="number" {...methods.register('concurrency', { required: true, min: 1,valueAsNumber: true })} placeholder="高峰並發 / TPS" />
                                <Input type="number" {...methods.register('trafficPeak', { required: true, min: 1 ,valueAsNumber: true})} placeholder="網路出口峰值 (Mbps)" />
                                <Input {...methods.register('backupFrequency', { required: true })} placeholder="備份頻率 (每日/每小時)" />
                                <Input {...methods.register('backupRetention', { required: true })} placeholder="備份保留週期" />
                            </div>
                        )}

                        {/* Step 4 */}
                        {step === StepIdx.Upload && (
                            <div className="grid gap-4">
                                <input
                                    type="file"
                                    accept=".png,.pdf,.jpg"
                                    onChange={(e) => handleFileUpload(e, 'archKey')}
                                />
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={(e) => handleFileUpload(e, 'fwKey')}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={prev}
                        disabled={step === StepIdx.Basic}
                    >
                        上一步
                    </Button>

                    {step === StepIdx.Upload ? (
                        <Button type="button" onClick={onFinalSubmit}>
                            送出
                        </Button>
                    ) : (
                        <Button type="button" onClick={onNext}>
                            下一步
                        </Button>
                    )}
                </div>
            </form>
        </FormProvider>
    );
}
