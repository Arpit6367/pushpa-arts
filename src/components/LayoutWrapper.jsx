'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
          // observer.unobserve(entry.target); // Keep observing for re-animation if desired
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal:not(.active)');
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    // Watch for new elements being added to the DOM (for category pages/infinite scroll)
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
    <>
      <Header initialCategories={initialCategories} settings={settings} />
      <main className={!isHome ? 'pt-[160px]' : ''}>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
