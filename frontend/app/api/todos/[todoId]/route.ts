import { NextResponse } from 'next/server';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

// PUT 요청 (할 일 수정) 프록시 - POST가 아니라 PUT이어야 해!
export async function PUT(request: Request, { params }: { params: Promise<{ todoId: string }> }) {
  const resolvedParams = await params; // Next.js 15 문법
  const body = await request.json();
  
  const res = await fetch(`${backendUrl}/todos/${resolvedParams.todoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  const data = await res.json();
  return NextResponse.json(data);
}

// DELETE 요청 (할 일 삭제) 프록시 - 하드코딩 제거 완료!
export async function DELETE(request: Request, { params }: { params: Promise<{ todoId: string }> }) {
  const resolvedParams = await params; // Next.js 15 문법
  
  const res = await fetch(`${backendUrl}/todos/${resolvedParams.todoId}`, {
    method: 'DELETE',
  });
  
  const data = await res.json();
  return NextResponse.json(data);
}