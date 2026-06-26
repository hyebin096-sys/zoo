import LadderGame from "@/components/LadderGame";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 bg-slate-50 px-4 py-8 sm:py-12 dark:bg-slate-900">
      <header className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl dark:text-slate-100">사다리타기</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          참가자 이름과 결과를 입력하고 사다리를 타보세요
        </p>
      </header>
      <LadderGame />
    </main>
  );
}
