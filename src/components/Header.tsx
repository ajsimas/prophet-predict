'use client';

import {useState} from 'react';
import {useTheme} from '@/contexts/ThemeContext';

export default function Header(): JSX.Element {
  const [showInfo, setShowInfo] = useState(false);
  const {theme, toggleTheme} = useTheme();

  return (
    <>
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-3 md:px-8 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="m-0 text-xl md:text-2xl font-semibold text-gray-800 dark:text-slate-100 tracking-tight">
              Prophet Predict
            </h1>
            <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-gray-500 dark:text-slate-400 font-normal leading-tight">
              Statistical probabilities of succession in The Church of Jesus Christ of Latter-day Saints
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              className="bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md p-2 flex items-center justify-center cursor-pointer text-gray-700 dark:text-slate-300 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-slate-500 active:bg-gray-300 dark:active:bg-slate-600"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              className="bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 md:px-4 md:py-2 flex items-center gap-1.5 cursor-pointer text-gray-700 dark:text-slate-300 text-sm md:text-sm font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-slate-500 active:bg-gray-300 dark:active:bg-slate-600"
              onClick={() => setShowInfo(!showInfo)}
              aria-label="Show methodology information"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">About</span>
            </button>
          </div>
        </div>
      </header>

      {showInfo && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-8 md:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="relative w-full max-w-[650px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-2rem)] animate-fadeInSlow md:animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors cursor-pointer z-10"
              onClick={() => setShowInfo(false)}
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="overflow-y-auto p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 pr-10">
                How This Works
              </h2>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                    What This Calculates
                  </h3>
                  <p className="text-base text-gray-700 dark:text-slate-300 leading-normal">
                    The probability that each apostle will serve as President
                    (Prophet) of The Church of Jesus Christ of Latter-Day Saints
                    on any given date over the next 30 years.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                    How It Works
                  </h3>
                  <p className="text-base text-gray-700 dark:text-slate-300 leading-normal mb-4">
                    An apostle becomes President when:
                  </p>
                  <ol className="text-base text-gray-700 dark:text-slate-300 leading-normal space-y-2 ml-6 list-decimal">
                    <li>All apostles ordained before them have passed away</li>
                    <li>They are still living</li>
                  </ol>
                  <p className="text-base text-gray-700 dark:text-slate-300 leading-normal mt-4">
                    For each apostle, we calculate the probability of both
                    conditions being met for each day over the next 30 years.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                    Data Sources
                  </h3>
                  <ul className="text-base text-gray-700 dark:text-slate-300 leading-normal space-y-2 ml-6 list-disc">
                    <li>
                      <strong>Ordination dates:</strong> Publicly available
                      church records
                    </li>
                    <li>
                      <strong>Birth dates:</strong> Publicly available church
                      records
                    </li>
                    <li>
                      <strong>Mortality data:</strong> Social Security
                      Administration actuarial tables for U.S. males
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                    Key Assumptions
                  </h3>
                  <ul className="text-base text-gray-700 dark:text-slate-300 leading-normal space-y-2 ml-6 list-disc">
                    <li>Succession follows seniority by ordination date</li>
                    <li>No early resignations or unforeseen circumstances</li>
                    <li>
                      Individual health follows average mortality patterns
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                    Limitations
                  </h3>
                  <ul className="text-base text-gray-700 dark:text-slate-300 leading-normal space-y-2 ml-6 list-disc">
                    <li>
                      Statistical model cannot account for individual health
                      conditions
                    </li>
                    <li>Shows probabilities, not predictions</li>
                    <li>Cannot predict unforeseen circumstances</li>
                  </ul>
                </section>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Last updated:{' '}
                    {new Date().toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
