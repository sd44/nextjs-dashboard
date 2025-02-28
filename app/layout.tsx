import "@/app/ui/global.css";
import { lusitana, noto_sans_sc } from "@/app/ui/fonts";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={`${lusitana.className} ${noto_sans_sc.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
      >
        {children}
      </body>
    </html>
  );
}
