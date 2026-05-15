import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aire — Find sellers before anyone else does',
  description: 'Aire watches sixteen situations that predict a property sale and gives you the best leads in your county before they show up anywhere else.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
