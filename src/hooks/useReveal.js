'use client';
import { useEffect } from 'react';

/**
 * Custom hook to trigger scroll reveal animations using IntersectionObserver.
 * It targets elements with the '.reveal' class within a given dependency array.
 * 
 * @param {Array} deps - Dependency array to re-run the observer (e.g., after dynamic content loads)
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: unobserve after reveal to save resources
          // observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters the viewport
    });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, deps);
}
