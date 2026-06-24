"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4 font-sans">
      <h2 className="text-xl font-bold text-red-500 mb-4">문제가 발생했습니다!</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button onClick={() => reset()} className="px-6 py-2 bg-[#672be0] text-white rounded-lg hover:bg-[#521eb8]">
        다시 시도하기
      </button>
    </div>
  );
}