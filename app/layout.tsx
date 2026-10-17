import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Jose Enrique Leyva — Systems & Design Engineer',
  description: 'Full-stack and mobile engineer building production apps and backend systems. Based in Attendorn, Germany.',
  metadataBase: new URL('https://leyvaje.com'),
  openGraph: {
    title: 'Jose Enrique Leyva — Systems & Design Engineer',
    description: 'Mobile engineering, distributed systems, music, and ideas.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
