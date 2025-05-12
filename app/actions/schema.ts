// src/app/actions/schema.ts
// ──────────────────────────────────────────
// Zod schema 定義所有 Wizard 欄位，供前端與 Server Action 共用

import { z } from 'zod';

export const formSchema = z.object({
  /** 系統名稱 */
  systemName: z.string().min(2, { message: '系統名稱至少 2 個字' }),

  /** 系統描述（選填） */
  systemDesc: z.string().optional(),

  /** Web Server 類型 (Nginx/Apache/Tomcat…) */
  webServerType: z.string(),

  /** Web Server 數量 */
  webServerCount: z.number().int().positive(),

  /** 介面 / API Server 數量 */
  interfaceCount: z.number().int().positive(),

  /** 資料庫類型 (PostgreSQL/MySQL/…) */
  dbType: z.string(),

  /** DB CPU Core */
  dbCores: z.number().int().positive(),

  /** DB 記憶體 (GB) */
  dbRam: z.number().positive(),

  /** DB 資料量 (GB) */
  dbSize: z.number().positive(),


  /** 高峰並發 / TPS */
  concurrency: z.number().positive(),

  /** 網路流量高峰 (Mbps) */
  trafficPeak: z.number().positive(),

  /** 備份頻率 (例如 daily / hourly) */
  backupFrequency: z.string(),

  /** 備份保留週期 (例如 30d / 7d) */
  backupRetention: z.string(),

  /** 上傳檔案完成後回寫的 objectKey (選填) */
  fileKey: z.string().optional(),
  /** 檔案上傳 S3 物件鍵：架構圖 */
  archKey: z.string().optional(),
  /** 檔案上傳 S3 物件鍵：防火牆盤點表 */
  fwKey: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
