import LadderGame from "@/components/LadderGame";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 bg-gradient-to-b from-indigo-50 via-slate-50 to-white px-4 py-10 sm:py-14 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <header className="animate-rise-in relative flex flex-col items-center gap-4 text-center">
        {/* soft glowing aura behind the title */}
        <div
          aria-hidden
          className="animate-title-glow pointer-events-none absolute -top-8 left-1/2 h-28 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-sky-400 opacity-50 blur-3xl sm:w-96"
        />

        <div className="relative flex items-center justify-center gap-2 sm:gap-3">
          <span className="animate-float-y select-none text-3xl drop-shadow-sm sm:text-5xl">🪜</span>
          <h1 className="animate-gradient-pan bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-[0_2px_12px_rgba(99,102,241,0.35)] sm:text-6xl dark:from-fuchsia-400 dark:via-indigo-300 dark:to-sky-400">
            사다리타기
          </h1>
          <span className="animate-twinkle select-none text-2xl sm:text-4xl">✨</span>
          <span className="animate-twinkle twinkle-delayed absolute -right-3 -top-2 select-none text-base sm:text-xl">
            ⭐
          </span>
        </div>

        <p className="rounded-full border border-white/60 bg-white/70 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm sm:text-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
          참가자와 결과를 입력하고 운명의 사다리를 타보세요
        </p>
      </header>

      <LadderGame />
    </main>
  );
}
