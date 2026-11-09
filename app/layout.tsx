import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Greenlight Next | Your immigration journey', description: 'Secure case management for applicants and immigration professionals.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
