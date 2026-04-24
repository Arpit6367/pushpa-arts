'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { QuickViewProvider } from '@/context/QuickViewContext';

export default function LayoutWrapper({ children, initialCategories = [], settings = {} }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isHome = pathname === '/';

  // Global Reveal Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal:not(.active), .reveal-left:not(.active), .reveal-right:not(.active), .reveal-zoom:not(.active)');
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => observeElements());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <QuickViewProvider>
      <Header initialCategories={initialCategories} settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} categories={initialCategories} />
    </QuickViewProvider>
  );
}
