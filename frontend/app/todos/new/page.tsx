"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTodoPage() {
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return alert('할 일을 입력해주세요!');

    // 👇 수정된 핵심 포인트: http://localhost:8000 이 아니라 /api/todos 로 요청!
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, date })
    });

    if (res.ok) {
      router.push('/todos');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4 font-sans">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">새 할 일 추가</h1>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="할 일 내용" className="w-full mb-4 px-4 py-3 border-2 border-gray-100 rounded-lg outline-none focus:border-[#672be0]" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mb-6 px-4 py-3 border-2 border-gray-100 rounded-lg outline-none focus:border-[#672be0]" />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-[#672be0] text-white py-3 rounded-lg font-semibold hover:bg-[#521eb8]">저장</button>
          <button type="button" onClick={() => router.back()} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">취소</button>
        </div>
      </form>
    </div>
  );
}