
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, QrCode, LogOut, ArrowLeftFromLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ModeSelection() {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Tampilkan toast "Akses Diberikan" saat masuk halaman ini (sesuai screenshot)
    const hasToasted = sessionStorage.getItem('login_toast_shown');
    if (!hasToasted) {
      toast({
        title: "Akses Diberikan",
        description: "Selamat datang di panel kontrol EduCard Sync.",
        duration: 5000,
      });
      sessionStorage.setItem('login_toast_shown', 'true');
    }

    if (localStorage.getItem('isLoggedIn') !== 'true') {
      router.push('/'); 
    }
  }, [router, toast]);

  const selectMode = (mode: 'admin' | 'scanner') => {
    localStorage.setItem('userRole', mode);
    router.push(mode === 'admin' ? '/admin' : '/scanner');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('login_toast_shown');
    router.push('/');
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16">
           <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-sm mb-6 border border-slate-100 flex items-center justify-center">
             <img src="https://iili.io/KAqSZhb.png" alt="Logo" className="w-full h-full object-contain" />
           </div>
           <h1 className="text-5xl font-black text-center mb-3 font-headline text-[#2E50B8] tracking-tighter uppercase">Pilih Mode Akses</h1>
           <p className="text-center text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px]">SMKN 2 Tana Toraja • EduCard System</p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Admin Card */}
          <Card 
            className="group relative border-none bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-12px_rgba(46,80,184,0.15)] transition-all duration-500 cursor-pointer"
            onClick={() => selectMode('admin')}
          >
            <CardHeader className="text-center pt-6 pb-2">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-[#2E50B8] group-hover:text-white transition-all duration-500 border border-slate-100/50">
                <ShieldCheck className="h-9 w-9" />
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight text-slate-800 mb-3 group-hover:text-[#2E50B8] transition-colors">Mode Admin</CardTitle>
              <CardDescription className="text-[13px] font-medium leading-relaxed text-slate-400 max-w-[240px] mx-auto">
                Kelola database master, cetak kartu massal, dan monitoring log database sekolah.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-10 pb-4">
              <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border-2 border-slate-100 bg-slate-50/50 group-hover:bg-[#2E50B8] group-hover:text-white group-hover:border-transparent transition-all">
                MASUK ADMIN
              </Button>
            </CardContent>
          </Card>

          {/* Scanner Card */}
          <Card 
            className="group relative border-none bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-12px_rgba(46,80,184,0.15)] transition-all duration-500 cursor-pointer"
            onClick={() => selectMode('scanner')}
          >
            <CardHeader className="text-center pt-6 pb-2">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-[#2E50B8] group-hover:text-white transition-all duration-500 border border-slate-100/50">
                <QrCode className="h-9 w-9" />
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight text-slate-800 mb-3 group-hover:text-[#2E50B8] transition-colors">Mode Scanner</CardTitle>
              <CardDescription className="text-[13px] font-medium leading-relaxed text-slate-400 max-w-[240px] mx-auto">
                Pemindaian kartu untuk absensi harian, event ujian, dan verifikasi identitas cepat.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-10 pb-4">
              <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border-2 border-slate-100 bg-slate-50/50 group-hover:bg-[#2E50B8] group-hover:text-white group-hover:border-transparent transition-all">
                MASUK SCANNER
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="mt-20 text-center space-y-8">
          <div className="w-full h-px bg-slate-200/60 max-w-3xl mx-auto"></div>
          <button 
            onClick={handleLogout} 
            className="inline-flex items-center gap-3 text-slate-400 hover:text-[#2E50B8] transition-colors font-black uppercase text-[10px] tracking-[0.3em]"
          >
            <ArrowLeftFromLine className="h-4 w-4" /> 
            KELUAR KE PORTAL UTAMA
          </button>
        </div>
      </div>
    </div>
  );
}
