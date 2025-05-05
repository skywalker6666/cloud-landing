'use client';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = [
  { id: 1, title: '基本資訊' },
  { id: 2, title: '運算資源' },
  { id: 3, title: '資料庫' },
  { id: 4, title: '流量 & 備份' },
  { id: 5, title: '檔案上傳' }
];
interface StepIndicatorProps {
  current: number;           // 目前所在步驟 index
}
function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((s, idx) => (
        <div key={s.id} className="flex-1 text-center">
          <div className={`w-8 h-8 mx-auto rounded-full border-2 ${idx <= current ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-500'} flex items-center justify-center font-bold`}>{s.id}</div>
          <p className="text-sm mt-2">{s.title}</p>
        </div>
      ))}
    </div>
  );
}

const MultiStepForm = () => {
  const methods = useForm({ mode: 'onBlur' });
  const { handleSubmit } = methods;
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: any) => {
    if (step < steps.length - 1) {
      next();
    } else {
      console.log('Form data', data);
      // TODO: call API
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6">
        <StepIndicator current={step} />

        {/* 卡片容器 */}
        <Card className="mb-6 shadow-xl rounded-2xl p-6">
          <CardContent>
            {step === 0 && (
              <div className="grid gap-4">
                <Input {...methods.register('systemName', { required: true })} placeholder="系統名稱" />
                <Input {...methods.register('systemDesc')} placeholder="系統描述 (選填)" />
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4">
                <Input {...methods.register('webServerType', { required: true })} placeholder="Web Server 類型 (Nginx/Tomcat)" />
                <Input type="number" {...methods.register('webServerCount', { required: true, min: 1 })} placeholder="Web Server 數量" />
                <Input type="number" {...methods.register('apiCount', { required: true })} placeholder="介面 / API Server 數量" />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                <Input {...methods.register('dbType', { required: true })} placeholder="資料庫類型 (PostgreSQL)" />
                <Input type="number" {...methods.register('dbCores', { required: true, min: 1 })} placeholder="DB Core 數" />
                <Input type="number" {...methods.register('dbRam', { required: true, min: 1 })} placeholder="DB RAM (GB)" />
                <Input type="number" {...methods.register('dbSize', { required: true, min: 1 })} placeholder="DB 資料量 (GB)" />
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4">
                <Input type="number" {...methods.register('concurrency', { required: true, min: 1 })} placeholder="高峰並發 / TPS" />
                <Input type="number" {...methods.register('peakBandwidth', { required: true, min: 1 })} placeholder="網路出口峰值 (Mbps)" />
                <Input {...methods.register('backupFreq', { required: true })} placeholder="備份頻率 (每日/每小時)" />
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-4">
                <input type="file" {...methods.register('archDiagram', { required: true })} />
                <input type="file" {...methods.register('fwSheet')} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={prev} disabled={step === 0}>上一步</Button>
          <Button type="submit">{step === steps.length - 1 ? '送出' : '下一步'}</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;
