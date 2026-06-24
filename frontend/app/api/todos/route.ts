// frontend/app/api/todos/route.ts
import { NextResponse } from 'next/server';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

// POST 요청 (할 일 생성) 프록시
export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${backendUrl}/todos`, { // 환경변수 적용
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  const data = await res.json();
  return NextResponse.json(data); // 결과를 다시 브라우저로 돌려줌
}