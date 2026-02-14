'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LpRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#lp-hero');
  }, [router]);

  return null;
}
