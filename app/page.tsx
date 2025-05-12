// src/app/page.tsx
import Link from 'next/link';
import { testDbConnection } from '@/actions/testDB';



export default async function Home() {
  if (process.env.NODE_ENV === 'development') {
    await testDbConnection();
  }
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">雲啟前哨-入雲助理</h1>

      {/* 導向多步驟表單（Wizard） */}
      <Link
        href="/wizard"
        className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        開始填寫上雲評估表單
      </Link>

      <p className="text-gray-500 text-sm">
        Next.js + Tailwind + shadcn/ui &nbsp;|&nbsp; Prototype v0.1
      </p>
    </main>
  );
}
