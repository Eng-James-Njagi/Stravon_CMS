import { Oswald, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from './components/nav'
import { Toaster } from 'sonner';

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: [ "latin" ],
});

const open_sans = Open_Sans({
  variable: "--font-open_sans",
  subsets: [ "latin" ],
});

export const metadata = {
  title: "Stravon CMS",
  description: " Digital Workplace Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior='smooth'
      className={`${oswald.variable} ${open_sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar/>
        <Toaster position="top-center" richColors />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}