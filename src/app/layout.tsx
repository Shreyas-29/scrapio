import { Navbar } from '@/components';
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Barlow, Rubik, Manrope } from 'next/font/google'
import { cn } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';

const base = Inter({
    subsets: ['latin'],
    variable: '--font-base',
});
const heading = Manrope({
    subsets: ['latin'],
    variable: '--font-heading',
});

export const metadata: Metadata = {
    title: 'Scrapio - Home',
    description: 'Scrapio is a web scraping tool for the modern web.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={cn(
                "min-h-screen font-base relative bg-white antialiased",
                base.variable,
                heading.variable,
            )}>
                <Toaster />
                <main className="max-w-8xl mx-auto">
                    <Navbar />
                </main>
                {children}
            </body>
        </html>
    )
}
