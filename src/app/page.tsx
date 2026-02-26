
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
  Search, 
  LogIn, 
  ShieldCheck, 
  Info, 
  Loader2, 
  Zap, 
  Navigation,
  CheckCircle2,
  Users,
  CreditCard,
  CalendarCheck
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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

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
          description: "Nomor induk atau kode kartu tidak terdaftar di database kami."
        });
      }
    }, 1200);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    setTimeout(() => {
      if (username === 'admin123' && password === 'password123') {
        localStorage.setItem('isLoggedIn', 'true');
        toast({ title: "Akses Diberikan", description: "Selamat datang di panel kontrol EduCard Sync." });
        router.push('/mode-selection');
      } else {
        setLoginError('Kredensial tidak valid. Silahkan hubungi IT sekolah.');
        setIsLoggingIn(false);
      }
    }, 1500);
  };

  const chartData = [
    { name: 'Sen', rate: 95 },
    { name: 'Sel', rate: 98 },
    { name: 'Rab', rate: 92 },
    { name: 'Kam', rate: 96 },
    { name: 'Jum', rate: 94 },
  ];

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white font-body selection:bg-primary/20">
      {/* Header Portal */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-slate-50 rounded-xl p-2 shadow-sm border border-slate-100">
              <Image 
                src="https://iili.io/KAqSZhb.png" 
                alt="Logo Sekolah" 
                fill 
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-primary leading-none tracking-tighter uppercase">EduCard Portal</span>
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1">SMKN 2 Tana Toraja</span>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="px-8 rounded-full shadow-xl shadow-primary/20 gap-2 font-black uppercase tracking-widest text-[10px] h-12">
                <LogIn className="h-4 w-4" /> Akses Internal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-10 text-white text-center space-y-3 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border border-white/20 mb-2">
                    <ShieldCheck className="h-8 w-8 text-white" />
                 </div>
                 <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Login Sistem</DialogTitle>
                 <DialogDescription className="text-white/70 font-bold text-xs uppercase tracking-widest">
                   Admin & Scanner Management
                 </DialogDescription>
              </div>
              <form onSubmit={handleLogin} className="p-10 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</Label>
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Masukkan ID Anda"
                      required 
                      className="h-12 rounded-xl border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="••••••••"
                      required 
                      className="h-12 rounded-xl border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>
                {loginError && (
                  <Alert variant="destructive" className="py-3 rounded-xl">
                    <AlertDescription className="text-xs font-bold">{loginError}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-lg rounded-2xl" disabled={isLoggingIn}>
                  {isLoggingIn ? <Loader2 className="h-6 w-6 animate-spin" /> : 'VERIFIKASI & MASUK'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      {/* Hero & Stats */}
      <section className="pt-20 pb-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 text-[10px] font-black tracking-[0.4em] uppercase rounded-full">
              Integrated School Smart System
            </Badge>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">
              Smart Control.<br/><span className="text-primary italic">Digital Identity.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
              Solusi manajemen identitas digital terpadu untuk monitoring kehadiran, kartu ujian, dan akses layanan sekolah di SMKN 2 Tana Toraja.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="space-y-1">
                <div className="text-3xl font-black text-primary">1.2K+</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Siswa Aktif</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-secondary">100%</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Digitalized</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-emerald-500">Realtime</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Sync Database</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-100 shadow-xl">
             <div className="flex items-center justify-between mb-8">
                <h4 className="font-black uppercase tracking-tighter">Grafik Kehadiran Pekan Ini</h4>
                <CalendarCheck className="h-5 w-5 text-primary opacity-30" />
             </div>
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Bar dataKey="rate" fill="#2E50B8" radius={[6, 6, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      </section>

      {/* Identity Tracer - Main Feature */}
      <section className="py-24 bg-slate-900 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
               <h2 className="text-4xl font-black text-white tracking-tight uppercase">Identity Tracer System</h2>
               <p className="text-white/50 font-medium">Lacak dan verifikasi identitas siswa secara instan melalui sistem sinkronisasi database log admin.</p>
            </div>

            <Card className="bg-white/5 border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-md">
              <CardContent className="p-12 space-y-10">
                <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
                  <Search className="absolute left-6 top-6 h-8 w-8 text-white/20 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Masukkan NIS / NISN / Kode Kartu..." 
                    className="pl-20 h-20 text-xl border-2 border-white/10 bg-white/5 text-white focus-visible:ring-primary rounded-3xl font-black uppercase placeholder:normal-case placeholder:font-medium placeholder:text-white/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    className="absolute right-4 top-4 h-12 px-8 font-black rounded-2xl text-[10px] tracking-widest shadow-2xl"
                    disabled={isSearching}
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'TELUSURI DATA'}
                  </Button>
                </form>

                {hasSearched && searchResult ? (
                  <div className="animate-in fade-in zoom-in-95 duration-700 bg-white rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center text-left">
                    <div className="w-44 h-56 bg-slate-100 rounded-3xl overflow-hidden relative shadow-2xl shrink-0 border-4 border-slate-50">
                       <Image 
                         src={searchResult.photo_url || 'https://picsum.photos/seed/placeholder/300/400'} 
                         alt="Siswa" fill className="object-cover" unoptimized 
                       />
                    </div>
                    <div className="flex-1 space-y-4">
                       <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500 text-white font-black uppercase text-[8px] tracking-[0.2em]">Verified Aktif</Badge>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{searchResult.card_code}</span>
                       </div>
                       <h3 className="text-4xl font-black text-slate-900 leading-none uppercase tracking-tighter">{searchResult.name}</h3>
                       <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">{searchResult.class} - {searchResult.major}</p>
                       <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                          <div>
                             <p className="text-[8px] font-black uppercase text-slate-400">NIS / NISN</p>
                             <p className="text-sm font-bold text-slate-800">{searchResult.nis} / {searchResult.nisn || '-'}</p>
                          </div>
                          <div>
                             <p className="text-[8px] font-black uppercase text-slate-400">Tahun Ajaran</p>
                             <p className="text-sm font-bold text-slate-800">{searchResult.school_year}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                ) : hasSearched && !searchResult ? (
                   <div className="py-20 text-white/30 font-black uppercase tracking-[0.5em] animate-pulse">
                      Data Tidak Ditemukan Dalam Log Database
                   </div>
                ) : (
                  <div className="flex justify-center gap-12 opacity-20">
                     <Users className="h-12 w-12 text-white" />
                     <CreditCard className="h-12 w-12 text-white" />
                     <ShieldCheck className="h-12 w-12 text-white" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="bg-white py-16 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <Image src="https://iili.io/KAqSZhb.png" alt="Logo" width={40} height={40} unoptimized />
             <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-900">SMKN 2 Tana Toraja</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Official Card Sync Platform</p>
             </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} EDUCARD SYNC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
