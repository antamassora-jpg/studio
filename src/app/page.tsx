
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  QrCode, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  CheckCircle2,
  LogIn,
  UserCheck,
  Info,
  Camera,
  XCircle,
  Loader2,
  Zap,
  Navigation
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getDB } from '@/app/lib/db';
import { Student } from '@/app/lib/types';
import { toast } from '@/hooks/use-toast';

export default function LandingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Student | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(false);
    
    // Simulasi pencarian database riil
    setTimeout(() => {
      const db = getDB();
      const found = db.students.find(s => 
        s.nis === searchQuery || 
        s.nisn === searchQuery || 
        s.card_code === searchQuery ||
        s.card_code === `VERIFY-${searchQuery}`
      );
      
      setSearchResult(found || null);
      setIsSearching(false);
      setHasSearched(true);
      
      if (!found) {
        toast({
          variant: "destructive",
          title: "Data Tidak Ditemukan",
          description: "Pastikan NIS/NISN atau Kode Kartu yang Anda masukkan benar."
        });
      }
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    setTimeout(() => {
      if (username === 'admin123' && password === 'password123') {
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/mode-selection');
      } else {
        setLoginError('Username atau password salah.');
        setIsLoggingIn(false);
      }
    }, 1000);
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white font-body selection:bg-primary/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image 
                src="https://iili.io/KAqSZhb.png" 
                alt="Logo SMKN 2 Tana Toraja" 
                fill 
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-primary leading-none tracking-tighter uppercase">EduCard Sync</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">SMKN 2 Tana Toraja</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Link href="#features" className="hover:text-primary transition-colors">Fitur Utama</Link>
            <Link href="#tracking" className="hover:text-primary transition-colors">Tracer System</Link>
            <Link href="#stats" className="hover:text-primary transition-colors">Statistik</Link>
          </div>

          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="px-8 rounded-full shadow-xl shadow-primary/20 gap-2 font-black uppercase tracking-widest text-[10px] h-12">
                  <LogIn className="h-4 w-4" /> Portal Masuk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
                <div className="bg-primary p-8 text-white text-center space-y-2">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border border-white/20 mb-2">
                      <Image src="https://iili.io/KAqSZhb.png" alt="Logo" width={40} height={40} className="object-contain invert brightness-0" unoptimized />
                   </div>
                   <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Login Akses</DialogTitle>
                   <DialogDescription className="text-white/70 font-bold text-xs">
                     Manajemen Kartu & Absensi Digital Terpadu
                   </DialogDescription>
                </div>
                <form onSubmit={handleLogin} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</Label>
                      <Input 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="admin123"
                        required 
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        required 
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:bg-white"
                      />
                    </div>
                  </div>
                  {loginError && (
                    <Alert variant="destructive" className="py-3 rounded-xl">
                      <AlertDescription className="text-xs font-bold">{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Alert className="bg-primary/5 border-none rounded-xl">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-[10px] uppercase font-bold text-muted-foreground">
                      Demo Mode: admin123 / password123
                    </AlertDescription>
                  </Alert>
                  <Button type="submit" className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20" disabled={isLoggingIn}>
                    {isLoggingIn ? <Loader2 className="h-6 w-6 animate-spin" /> : 'MASUK SEKARANG'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-48 bg-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-10">
           <Badge className="bg-primary/10 text-primary border-none px-6 py-2 text-[10px] font-black tracking-[0.3em] uppercase rounded-full">
              Digital Educational Identity v2.5
           </Badge>
           <h1 className="text-6xl md:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter">
             Masa Depan <br/><span className="text-primary italic">Kartu Digital.</span>
           </h1>
           <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
             Platform terpadu untuk pencetakan kartu pelajar, kartu ujian, dan sistem absensi cerdas berbasis QR Code. Cepat, akurat, dan profesional.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="h-16 px-10 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20" asChild>
                 <Link href="#tracking">Mulai Melacak</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-sm font-black uppercase tracking-widest border-2" asChild>
                 <Link href="#features">Pelajari Fitur</Link>
              </Button>
           </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </section>

      {/* Tracer Section */}
      <section id="tracking" className="py-24 bg-slate-50 border-y relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                  <div className="md:col-span-3 p-10 lg:p-16 space-y-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                         <Navigation className="h-5 w-5 fill-primary" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Tracer Identity Tool</span>
                      </div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Verifikasi Kartu Secara Real-Time.</h3>
                      <p className="text-muted-foreground font-medium">Lacak keabsahan kartu melalui database pusat SMKN 2 Tana Toraja.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative group">
                      <div className="absolute left-5 top-5 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors">
                        <Search />
                      </div>
                      <Input 
                        placeholder="NISN / NIS / ID KARTU..." 
                        className="pl-14 h-16 text-xl border-2 border-slate-100 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-primary focus-visible:border-primary rounded-2xl transition-all font-bold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button 
                        type="submit" 
                        className="absolute right-3 top-3 h-10 px-8 font-black rounded-xl text-[10px] tracking-widest"
                        disabled={isSearching}
                      >
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SEARCH'}
                      </Button>
                    </form>

                    <div className="grid grid-cols-3 gap-4">
                      <TracerToolBadge icon={UserCheck} label="NISN/NIS" active={searchQuery.length > 5} />
                      <TracerToolBadge icon={Camera} label="Scan Foto" />
                      <TracerToolBadge icon={QrCode} label="ID Kartu" />
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-slate-900 p-10 lg:p-16 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                      {hasSearched && searchResult ? (
                        <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8 text-center">
                          <div className="w-32 h-44 bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mx-auto">
                            <Image 
                              src={searchResult.photo_url || 'https://picsum.photos/seed/user/300/400'} 
                              alt="Foto" fill className="object-cover" unoptimized 
                            />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-2xl font-black uppercase tracking-tight">{searchResult.name}</h4>
                            <p className="text-xs text-primary font-black tracking-widest uppercase">{searchResult.class} • {searchResult.major}</p>
                          </div>
                          <div className="space-y-2">
                             <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Status</span>
                                <Badge className="bg-emerald-500 text-emerald-950 border-none text-[10px] font-black">{searchResult.status}</Badge>
                             </div>
                             <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Berlaku</span>
                                <span className="text-xs font-black">{searchResult.valid_until}</span>
                             </div>
                          </div>
                          <Button variant="secondary" className="w-full font-black h-12 rounded-xl text-[10px] tracking-[0.2em] uppercase" asChild>
                            <Link href={`/verify/${searchResult.card_code}`}>VERIFIKASI LANJUT</Link>
                          </Button>
                        </div>
                      ) : hasSearched ? (
                        <div className="text-center space-y-6 animate-in fade-in duration-500">
                          <XCircle className="h-16 w-16 text-red-500 mx-auto opacity-50" />
                          <div className="space-y-2">
                            <h4 className="text-xl font-black tracking-tight uppercase">Data Tidak Ditemukan</h4>
                            <p className="text-xs opacity-60 font-medium italic">Silakan hubungi Admin Sekolah jika kartu Anda belum terdaftar.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-8 opacity-40 flex flex-col items-center py-10">
                          <Zap className="h-24 w-24 text-white" fill="white" />
                          <div className="space-y-2">
                            <h4 className="text-xl font-black tracking-tight uppercase">Ready to Scan</h4>
                            <p className="text-xs font-medium">Input parameter untuk melihat profil siswa.</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Abstract background for right side */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl -mr-32 -mt-32"></div>
                       <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl -ml-32 -mb-32"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features & Stats */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <LandingFeature 
                icon={CreditCard} 
                title="Smart ID Card" 
                desc="Desain modern dengan QR Code unik yang terenkripsi untuk setiap siswa."
              />
              <LandingFeature 
                icon={BarChart3} 
                title="AI Analytics" 
                desc="Monitoring tren kehadiran dan statistik harian secara otomatis."
              />
              <LandingFeature 
                icon={ShieldCheck} 
                title="Data Security" 
                desc="Penyimpanan data aman dengan protokol verifikasi ganda."
              />
           </div>

           <div id="stats" className="mt-32 p-16 bg-primary rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_100%)]"></div>
              <LandingStat value="1.5K+" label="Siswa Terdata" />
              <LandingStat value="20K+" label="Log Scan" />
              <LandingStat value="100%" label="Akurasi Data" />
              <LandingStat value="24/7" label="Uptime Server" />
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t py-20">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex justify-center items-center gap-4">
              <div className="relative w-12 h-12">
                <Image src="https://iili.io/KAqSZhb.png" alt="Logo" fill className="object-contain" unoptimized />
              </div>
              <div className="text-left">
                <span className="font-black text-primary text-xl leading-none uppercase">EduCard Sync</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SMKN 2 Tana Toraja</p>
              </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
             &copy; {new Date().getFullYear()} EDU-SYNC SYSTEM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}

function TracerToolBadge({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
      active ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-slate-50/50 border-transparent hover:border-slate-200'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110 ${
        active ? 'bg-primary text-white' : 'bg-white text-slate-400'
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-primary' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}

function LandingFeature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-6 group">
       <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
          <Icon className="h-8 w-8" />
       </div>
       <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h4>
       <p className="text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function LandingStat({ value, label }: { value: string, label: string }) {
  return (
    <div className="text-center relative z-10">
       <div className="text-5xl font-black mb-2 tracking-tighter">{value}</div>
       <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">{label}</div>
    </div>
  );
}
