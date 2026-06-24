import Link from 'next/link';
// 👇 1. 내부 로직 대신, 우리가 만든 actions.ts 파일에서 서버 함수를 불러옴
import { getTodos } from '../actions'; 

export default async function TodosPage() {
  const todos = await getTodos(); // 👇 2. 불러온 함수로 데이터 가져오기

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8 font-sans">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">나의 할 일 목록</h1>
        
        <div className="mb-4">
          <Link href="/todos/new" className="bg-[#672be0] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#521eb8] transition block text-center">
            + 새 할 일 추가하기
          </Link>
        </div>

        {todos.length === 0 ? (
          <p className="text-center py-8 text-gray-500">등록된 할 일이 없습니다.</p>
        ) : (
          <ul>
            {todos.map((todo: any) => (
              <li key={todo.id} className="flex items-center justify-between p-4 mb-3 border rounded-lg bg-white border-gray-100 hover:border-[#672be0] transition">
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {todo.text} <span className="text-xs text-gray-400 ml-2">({todo.date})</span>
                </span>
                <Link href={`/todos/${todo.id}`} className="px-3 py-1 text-sm rounded border bg-white text-gray-600 border-gray-200 hover:bg-gray-50">
                  상세/수정
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}