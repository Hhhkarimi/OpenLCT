import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/700.css';
import './globals.css';

export const metadata = {
  title: 'OpenLCT | Logistics Control Tower',
  description: 'FMCG Logistics Intelligence Platform'
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
