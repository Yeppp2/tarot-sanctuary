'use client';

import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import MoonPhase from '@/components/home/MoonPhase';
import OracleInput from '@/components/home/OracleInput';

export default function Home() {
  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden">
        <MoonPhase />

        <div className="pointer-events-none absolute inset-x-6 top-8 hidden h-px bg-white/[0.06] md:block" />
        <div className="pointer-events-none absolute inset-y-8 left-8 hidden w-px bg-white/[0.06] md:block" />
        <div className="pointer-events-none absolute inset-y-8 right-8 hidden w-px bg-white/[0.06] md:block" />
        <div className="pointer-events-none absolute bottom-8 left-1/2 hidden h-px w-[calc(100%-3rem)] -translate-x-1/2 bg-white/[0.06] md:block" />

        <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-rows-[1fr_auto] px-4 py-8 md:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-[280px_1fr_280px]">
            <aside className="hidden rounded-[26px] border border-white/[0.06] bg-white/[0.018] p-6 lg:block">
              <p className="text-[10px] tracking-[0.25em] text-white/18">RITUAL</p>
              <div className="mt-8 space-y-5 text-sm leading-7 text-white/38">
                <p>先安静下来。</p>
                <p>再选择要不要说出口。</p>
                <p>切牌，抽牌，等自己准备好。</p>
              </div>
            </aside>

            <div className="rounded-[34px] border border-white/[0.065] bg-[#070b16]/72 px-3 py-10 shadow-[0_40px_160px_rgba(0,0,0,0.42)] backdrop-blur-sm md:px-8 md:py-14">
              <OracleInput />
            </div>

            <aside className="hidden rounded-[26px] border border-white/[0.06] bg-white/[0.018] p-6 lg:block">
              <p className="text-[10px] tracking-[0.25em] text-white/18">DECK</p>
              <div className="mt-7 grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 rounded-lg border border-white/[0.07] bg-[#101733]"
                    style={{
                      transform: `rotate(${(index % 3 - 1) * 2}deg)`,
                      background:
                        'radial-gradient(circle at 50% 42%, rgba(185,204,255,0.13), transparent 34%), linear-gradient(145deg, #111731 0%, #050815 54%, #151b37 100%)',
                    }}
                  />
                ))}
              </div>
            </aside>
          </div>

          <div className="flex justify-center pb-2 pt-6">
            <Link
              href="/history"
              className="text-xs tracking-[0.2em] text-white/[0.14] transition-colors duration-500 hover:text-white/[0.34]"
            >
              过往回声
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
