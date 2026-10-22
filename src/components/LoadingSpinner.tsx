import type React from 'react';

export default function LoadingSpinner(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh w-full gap-6 bg-white dark:bg-slate-900">
      <div className="w-[50px] h-[50px] border-4 border-black/10 dark:border-white/10 border-t-blue-400 rounded-full animate-spin"></div>
      <p className="text-base text-gray-500 dark:text-slate-400 m-0">Calculating prophet probabilities...</p>
    </div>
  );
}
