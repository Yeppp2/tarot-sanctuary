import type { Metadata } from 'next';
import './globals.css';
import { AtmosphereWrapper } from '@/components/atmosphere/AtmosphereWrapper';

export const metadata: Metadata = {
  title: '回声 - 塔罗情绪陪伴',
  description: '一个可以不急着说出口的塔罗占卜与情绪回应空间。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="min-h-full overflow-x-hidden bg-[#080c18] text-white/85">
        <AtmosphereWrapper />
        <main className="relative z-10 flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
