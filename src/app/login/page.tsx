
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Sekarang login ada di portal utama (/) via pop-up
    // Halaman /login diarahkan kembali ke portal utama
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
        Mengarahkan ke Portal Utama...
      </p>
    </div>
  );
}
