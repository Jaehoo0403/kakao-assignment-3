"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams();
  const todoId = params.todoId;

  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [date, setDate] = useState('');

  useEffect(() => {
    // 참고: 단일 상세 조회(GET)는 route.ts에 프록시를 안 만들었으므로 백엔드 URL을 그대로 유지해.
    fetch('http://localhost:8000/todos')
      .then(res => res.json())
      .then(data => {
        const todo = data.find((t: any) => t.id === Number(todoId));
        if (todo) {
          setText(todo.text);
          setCompleted(todo.completed);
          setDate(todo.date);
        }
      });
  }, [todoId]);

  const handleUpdate = async () => {
    await fetch(`/api/todos/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, completed, date })
    });
    router.push('/todos');
    router.refresh();
  };

  const handleDelete = async () => {
    await fetch(`/api/todos/${todoId}`, { method: 'DELETE' });
    router.push('/todos');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4 font-sans">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">할 일 수정</h1>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full mb-4 px-4 py-3 border-2 border-gray-100 rounded-lg outline-none focus:border-[#672be0]" />
        <div className="flex items-center gap-2 mb-4 px-2">
          <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="w-5 h-5 accent-[#672be0]" />
          <label className="font-medium text-gray-700">완료 여부</label>
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mb-6 px-4 py-3 border-2 border-gray-100 rounded-lg outline-none focus:border-[#672be0]" />
        <div className="flex flex-col gap-2">
          <button onClick={handleUpdate} className="bg-[#672be0] text-white py-3 rounded-lg font-semibold hover:bg-[#521eb8]">수정 완료</button>
          <button onClick={handleDelete} className="bg-red-50 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-100">삭제하기</button>
          <button onClick={() => router.back()} className="bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">취소</button>
        </div>
      </div>
    </div>
  );
}