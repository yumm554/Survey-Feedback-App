import type { Metadata } from 'next';

import { DM_Sans } from 'next/font/google';
import '../assets/styles/globals.css';
import '../assets/styles/variables.css';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'A Survey Feedback App',
  description: 'An app to submit feedbacks',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
