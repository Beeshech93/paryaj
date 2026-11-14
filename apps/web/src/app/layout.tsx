import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Paryaj Milyon — Casino Online & Sportsbook',
  description:
    'Plataforma de entretenimiento regulado, apuestas deportivas, casino en vivo y juegos digitales para México y Haití.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-brand-dark text-slate-100 antialiased selection:bg-brand-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}

