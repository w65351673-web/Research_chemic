'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalNavbar({ children }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return children;
}
