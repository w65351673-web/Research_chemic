'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function useVisitorTracking(user = null) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        // Track visitor (first time or anonymous)
        if (!user) {
          await fetch('/api/track/visitor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: pathname,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
            }),
          });
        }

        // Track page view with user info if logged in
        await fetch('/api/track/page-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname,
            user: user?.email || user?.name || null,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [pathname, user]);
}
