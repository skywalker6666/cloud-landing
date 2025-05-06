// src/components/steps/Step2.tsx
// ──────────────────────────────────────────
// 「運算資源」步驟
// Props: onNext / onBack
'use client';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    onNext: () => void;
    onBack: () => void;
}

export default function Step2({ onNext, onBack }: Props) {
    const {
        register,
        formState: { errors },
        watch,
    } = useFormContext();

    const webType = watch('webServer');

    return (
        <Card>
            <CardContent className="space-y-6 p-6">
                {/* Web Server Type */}
                <div>
                    <label className="block mb-2 font-medium" htmlFor="webServer">
                        Web Server 類型
                    </label>
                    <Select {...register('webServer')} defaultValue="Nginx">
                        <SelectTrigger id="webServer">
                            <SelectValue placeholder="選擇 Web Server" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Nginx">Nginx</SelectItem>
                            <SelectItem value="Apache">Apache</SelectItem>
                            <SelectItem value="Tomcat">Tomcat</SelectItem>
                            <SelectItem value="IIS">IIS</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.webServer && (
                        <p className="text-xs text-red-600 mt-1">{errors.webServer.message as string}</p>
                    )}
                </div>

                {/* Web server count */}
                <div>
                    <label htmlFor="webServerCount" className="block mb-2 font-medium">
                        Web Server 數量
                    </label>
                    <Input
                        id="webServerCount"
                        type="number"
                        min={1}
                        placeholder="例如 3"
                        {...register('webServerCount', { valueAsNumber: true })}
                    />
                    {errors.webServerCount && (
                        <p className="text-xs text-red-600 mt-1">{errors.webServerCount.message as string}</p>
                    )}
                </div>

                {/* API server count */}
                <div>
                    <label htmlFor="apiServerCount" className="block mb-2 font-medium">
                        API / Interface Server 數量
                    </label>
                    <Input
                        id="apiServerCount"
                        type="number"
                        min={0}
                        placeholder="若無可填 0"
                        {...register('apiServerCount', { valueAsNumber: true })}
                    />
                    {errors.apiServerCount && (
                        <p className="text-xs text-red-600 mt-1">{errors.apiServerCount.message as string}</p>
                    )}
                </div>

                {/* Containerised? */}
                <div>
                    <label htmlFor="containerized" className="block mb-2 font-medium">
                        是否已容器化
                    </label>
                    <Select {...register('containerized')} defaultValue="no">
                        <SelectTrigger id="containerized">
                            <SelectValue placeholder="是否容器化" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">是</SelectItem>
                            <SelectItem value="no">否</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between pt-4">
                    <Button variant="outline" type="button" onClick={onBack}>
                        上一步
                    </Button>
                    <Button type="button" onClick={onNext}>
                        下一步
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

