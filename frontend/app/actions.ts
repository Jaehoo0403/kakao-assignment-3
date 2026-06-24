"use server";

export async function getTodos() {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
  const res = await fetch(`${backendUrl}/todos`, {
    cache: 'no-store'
  });
  
  if (!res.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
  return res.json();
}