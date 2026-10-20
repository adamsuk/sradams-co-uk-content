import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

/**
 * The page scrolls inside <main>, not the window, so the header and the contact bar stay
 * in view. Next.js only resets and restores window scroll, so this does it for <main>:
 * new pages start at the top (or at their #anchor), and back/forward returns to where the
 * reader was.
 */
export function useMainScroll(ref: React.RefObject<HTMLElement>) {
  const router = useRouter();
  const positions = useRef(new Map<string, number>());
  const popped = useRef(false);

  useEffect(() => {
    const save = () => {
      if (ref.current) positions.current.set(router.asPath, ref.current.scrollTop);
    };
    const onPop = () => {
      popped.current = true;
    };
    const onDone = (url: string) => {
      const main = ref.current;
      if (!main) return;
      const hash = url.split('#')[1];
      const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      if (target) {
        target.scrollIntoView();
      } else if (popped.current) {
        main.scrollTop = positions.current.get(url) ?? 0;
      } else {
        main.scrollTop = 0;
      }
      popped.current = false;
      // Keyboard scrolling (Page Down, Space, arrows) should move the new page.
      if (!main.contains(document.activeElement)) main.focus({ preventScroll: true });
    };
    window.addEventListener('popstate', onPop);
    router.events.on('routeChangeStart', save);
    router.events.on('routeChangeComplete', onDone);
    return () => {
      window.removeEventListener('popstate', onPop);
      router.events.off('routeChangeStart', save);
      router.events.off('routeChangeComplete', onDone);
    };
  }, [router, ref]);
}

interface ScrollAreaProps {
  children: React.ReactNode;
}

function ScrollArea({ children }: ScrollAreaProps) {
  const ref = useRef<HTMLElement>(null);
  useMainScroll(ref);
  return (
    <main
      ref={ref}
      id="main"
      // Focusable so keyboard users can scroll it; no outline because it is the whole page.
      tabIndex={-1}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain outline-none print:overflow-visible"
    >
      {children}
    </main>
  );
}

export default ScrollArea;
