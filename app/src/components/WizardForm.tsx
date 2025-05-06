'use client';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '@/../../app/actions/submitForm';
import { submitForm } from '@/../../app/actions/submitForm';
import { useState } from 'react';
import StepUpload from './steps/StepUpload';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
export default function WizardForm() {
    const router = useRouter();
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {},          // 可先預填
    });

    const [step, setStep] = useState(0);

    const onSubmit = methods.handleSubmit(async (values) => {
        console.log('提交資料：', values);        // ✅ 檢查有進入
        try {
            const res = await submitForm(values);
            console.log('DB 回應：', res);         // ✅ 檢查 id
            router.push('/result/' + res.id);
        } catch (err) {
            console.error('送出錯誤:', err);
            alert('送出失敗');
        }
    });


    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
                {step === 0 && <Step1 onNext={() => setStep(1)} />}
                {step === 1 && <Step2 onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                {step === 4 && (
                    <StepUpload
                        onBack={() => setStep(3)}
                    />
                )}
            </form>
        </FormProvider>
    );
}
