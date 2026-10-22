'use client';

import {useRef} from 'react';
import type React from 'react';
import {useTheme} from '@/contexts/ThemeContext';
import {roster} from '@/lib/roster';

export default function Header(): React.JSX.Element {
  const aboutRef = useRef<HTMLDialogElement>(null);
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
              aria-label={
                theme === 'light'
                  ? 'Switch to dark theme'
                  : 'Switch to light theme'
              }
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
              onClick={() => aboutRef.current?.showModal()}
              aria-label="About this forecast"
              aria-haspopup="dialog"
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

      {/* A native modal dialog moves focus into itself, keeps it there, and
          closes on Escape. A click on the backdrop lands on the dialog
          element itself, since the content fills it. */}
      <dialog
        ref={aboutRef}
        aria-labelledby="about-title"
        className="m-auto w-[calc(100%-2rem)] max-w-[650px] max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white dark:bg-slate-800 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-xs motion-safe:open:animate-fadeInSlow"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="px-5 pb-6 md:px-8 md:pb-8">
          <div className="sticky top-0 z-10 -mx-5 md:-mx-8 mb-4 flex items-start justify-between gap-4 bg-white dark:bg-slate-800 px-5 pt-5 pb-2 md:px-8 md:pt-8">
            <h2
              id="about-title"
              className="text-2xl font-bold text-gray-900 dark:text-slate-100"
            >
              How This Works
            </h2>
            <button
              className="-mr-3 -mt-2 w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-md text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              onClick={() => aboutRef.current?.close()}
              aria-label="Close"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

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
              <p className="text-base text-gray-700 dark:text-slate-300 leading-normal mt-4">
                The grey line, &ldquo;A future apostle,&rdquo; is the
                probability that every current apostle has passed away by
                then, so the President is someone not yet called as an
                apostle.
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
                <li>All apostles senior to them have passed away</li>
                <li>They are still living</li>
              </ol>
              <p className="text-base text-gray-700 dark:text-slate-300 leading-normal mt-4">
                For each apostle, we calculate the probability of both
                conditions being met on dates 90 days apart over the next 30
                years.
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
                  Administration 2023 period life table for U.S. males, from
                  the 2026 Trustees Report
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                Key Assumptions
              </h3>
              <ul className="text-base text-gray-700 dark:text-slate-300 leading-normal space-y-2 ml-6 list-disc">
                <li>
                  Succession follows apostolic seniority, the order in which
                  the apostles were ordained
                </li>
                <li>No early resignations or unforeseen circumstances</li>
                <li>
                  Apostles die at lower rates than U.S. men their age. The
                  gap is widest in their 60s and 70s and closes by about age
                  98, which fits their record: from 1995 to 2026, 14
                  apostles died where U.S. rates would predict about 31
                </li>
                <li>
                  Each apostle&apos;s death is independent of the others
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
                Apostle list as of{' '}
                {roster.asOf.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </p>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
