'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function VisitorTracker() {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    // Skip tracking for admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const trackVisit = async () => {
      try {
        // Track visitor (first time or anonymous)
        if (!user) {
          await fetch('/api/track/visitor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: pathname,
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
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
        // Silently fail - don't break the app
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, [pathname, user]);

  return null; // This component doesn't render anything
}
