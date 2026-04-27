import '../styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Load Phosphor Icons script once
    if (!document.getElementById('ph-icons')) {
      const s = document.createElement('script');
      s.id = 'ph-icons';
      s.src = 'https://unpkg.com/@phosphor-icons/web';
      document.head.appendChild(s);
    }
    // Apply saved theme
    if (localStorage.getItem('theme') === 'light') document.documentElement.classList.add('light-theme');
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
