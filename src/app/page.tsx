
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
  ArrowRight,
  CheckCircle2,
  LogIn,
  UserCheck,
  Info,
  Camera,
  XCircle,
  Loader2,
  Users,
  Award,
  Zap
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
    
    // Simulasi pencarian database
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
    <div className="flex flex-col min-h-screen bg-white font-body">
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
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-primary leading-none tracking-tighter uppercase">EduCard Sync</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">SMKN 2 Tana Toraja</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-600">
            <Link href="#features" className="hover:text-primary transition-colors">Fitur</Link>
            <Link href="#stats" className="hover:text-primary transition-colors">Statistik</Link>
            <Link href="#tracking" className="hover:text-primary transition-colors">Lacak Kartu</Link>
          </div>

          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="px-8 rounded-full shadow-xl shadow-primary/20 gap-2 font-bold uppercase tracking-widest text-xs">
                  <LogIn className="h-4 w-4" /> Portal Masuk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl">
                <DialogHeader className="flex flex-col items-center gap-2 pt-6">
                  <div className="w-20 h-20 relative mb-2 bg-slate-50 p-2 rounded-2xl shadow-inner">
                    <Image src="https://iili.io/KAqSZhb.png" alt="Logo" fill className="object-contain" />
                  </div>
                  <DialogTitle className="text-3xl font-black text-primary uppercase tracking-tighter">Login Internal</DialogTitle>
                  <DialogDescription className="text-center font-medium">
                    Masuk ke sistem manajemen kartu dan absensi digital terpadu.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-5 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Masukkan username"
                      required 
                      className="h-12 rounded-xl border-slate-200"
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
                      className="h-12 rounded-xl border-slate-200"
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive" className="py-3 rounded-xl">
                      <AlertDescription className="text-xs font-bold">{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Alert className="bg-slate-50 border-none rounded-xl">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-[10px] uppercase font-bold text-muted-foreground">
                      Demo: admin123 / password123
                    </AlertDescription>
                  </Alert>
                  <Button type="submit" className="w-full h-14 text-lg font-black uppercase tracking-widest" disabled={isLoggingIn}>
                    {isLoggingIn ? <Loader2 className="h-6 w-6 animate-spin" /> : 'MASUK SEKARANG'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Hero & Card Tracker Section */}
      <section id="tracking" className="relative py-24 lg:py-32 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8 mb-20">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-none px-6 py-2 text-[10px] font-black tracking-[0.3em] uppercase rounded-full">
              SISTEM INFORMASI KARTU DIGITAL TERPADU
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
              Lacak & Verifikasi <br/><span className="text-primary italic">Kartu Pelajar.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Solusi modern untuk transparansi data identitas siswa. Verifikasi status kartu, kehadiran, dan validitas kartu ujian secara real-time.
            </p>
          </div>

          {/* Central Search Tool */}
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border-none rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                  <div className="md:col-span-3 p-10 lg:p-16 space-y-10 bg-white">
                    <div className="space-y-3">
                      <h3 className="text-3xl font-black text-slate-800 tracking-tight">Identity Tracer</h3>
                      <p className="text-base text-muted-foreground font-medium">Gunakan NISN, NIS, atau Kode QR untuk menelusuri database kartu.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative group">
                      <div className="absolute left-5 top-5 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors">
                        <Search />
                      </div>
                      <Input 
                        placeholder="Ketik NISN / NIS / ID Kartu..." 
                        className="pl-14 h-16 text-xl border-2 border-slate-100 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-primary focus-visible:border-primary rounded-2xl transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button 
                        type="submit" 
                        className="absolute right-3 top-3 h-10 px-8 font-black rounded-xl text-xs tracking-widest"
                        disabled={isSearching}
                      >
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'LACAK'}
                      </Button>
                    </form>

                    <div className="grid grid-cols-3 gap-6 pt-4">
                      <TracerBadge icon={UserCheck} label="NISN/NIS" active={searchQuery.length > 5} />
                      <TracerBadge icon={Camera} label="Scan Foto" />
                      <TracerBadge icon={QrCode} label="QR Code" />
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-primary p-10 lg:p-16 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                    
                    <div className="relative z-10 space-y-8">
                      {hasSearched && searchResult ? (
                        <div className="animate-in fade-in zoom-in-95 slide-in-from-right-10 duration-700 space-y-8">
                          <div className="flex flex-col items-center gap-6">
                            <div className="w-32 h-44 bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                              <Image 
                                src={searchResult.photo_url || 'https://picsum.photos/seed/user/300/400'} 
                                alt="Foto" fill className="object-cover" unoptimized 
                              />
                            </div>
                            <div className="text-center">
                              <h4 className="text-2xl font-black uppercase leading-tight tracking-tight">{searchResult.name}</h4>
                              <p className="text-xs text-white/70 font-black mt-2 tracking-[0.2em] uppercase">{searchResult.class} • {searchResult.major}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                             <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center border border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Identitas</span>
                                <Badge className="bg-emerald-400 text-emerald-950 border-none text-[10px] font-black px-4">{searchResult.status}</Badge>
                             </div>
                             <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center border border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Masa Berlaku</span>
                                <span className="text-xs font-black tracking-widest">{searchResult.valid_until}</span>
                             </div>
                          </div>
                          <Button variant="secondary" className="w-full font-black h-12 rounded-xl text-[10px] tracking-[0.2em] uppercase shadow-lg shadow-secondary/20" asChild>
                            <Link href={`/verify/${searchResult.card_code}`}>Detail Selengkapnya</Link>
                          </Button>
                        </div>
                      ) : hasSearched ? (
                        <div className="text-center space-y-6 py-10 animate-in fade-in duration-500">
                          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-white/20">
                            <XCircle className="h-12 w-12 text-white/40" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-2xl font-black tracking-tight">Data Tidak Ditemukan</h4>
                            <p className="text-sm opacity-60 font-medium">Pastikan parameter pencarian benar.</p>
                          </div>
                          <Button variant="outline" className="bg-transparent text-white border-white/20 hover:bg-white/10 h-11 px-8 rounded-xl font-black text-[10px] tracking-widest" onClick={() => setHasSearched(false)}>ULANGI CARI</Button>
                        </div>
                      ) : (
                        <div className="text-center space-y-8 py-10 opacity-50 flex flex-col items-center">
                          <div className="w-32 h-32 relative animate-pulse">
                             <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl"></div>
                             <Zap className="h-32 w-32 relative text-white" fill="white" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-2xl font-black tracking-tight">Standby Mode</h4>
                            <p className="text-sm font-medium">Sistem siap melacak database.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Ekosistem Digital EduCard</h2>
            <p className="text-muted-foreground font-medium italic">Solusi menyeluruh manajemen identitas sekolah masa depan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={CreditCard} 
              title="Kartu Multi-Fungsi" 
              description="Satu kartu untuk identitas pelajar, kartu ujian, dan akses layanan sekolah terpadu."
              color="text-primary"
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Analisis Real-Time" 
              description="Pantau kehadiran dan tren perilaku siswa melalui dashboard analitik berbasis AI."
              color="text-secondary"
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Keamanan Terjamin" 
              description="Data terenkripsi dan verifikasi QR Code unik mencegah pemalsuan identitas."
              color="text-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-8">
            <StatItem value="1.2K+" label="Siswa Aktif" description="Terdaftar di database nasional" />
            <StatItem value="15K+" label="Log Absensi" description="Tercatat sejak tahun ajaran baru" />
            <StatItem value="100%" label="Uptime Server" description="Layanan digital 24/7 tanpa henti" />
            <StatItem value="98%" label="Akurasi Data" description="Berdasarkan verifikasi barcode" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-b pb-16 mb-16">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 bg-slate-50 p-2 rounded-2xl shadow-inner">
                <Image src="https://iili.io/KAqSZhb.png" alt="Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-primary text-2xl leading-none tracking-tighter uppercase">EduCard Sync</span>
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-slate-400 mt-2">SMKN 2 Tana Toraja</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <Link href="#" className="hover:text-primary transition-all hover:translate-x-1">Visi Institusi</Link>
              <Link href="#" className="hover:text-primary transition-all hover:translate-x-1">Pusat Bantuan</Link>
              <Link href="#" className="hover:text-primary transition-all hover:translate-x-1">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-primary transition-all hover:translate-x-1">Kontak Kami</Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            <p>&copy; {new Date().getFullYear()} SMKN 2 TANA TORAJA. SYSTEM BY EDUCARD ENGINE.</p>
            <div className="flex gap-10">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> ISO 27001 SECURE</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> GDPR COMPLIANT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TracerBadge({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer group ${
      active ? 'bg-primary/5 border-primary/20' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110 ${
        active ? 'bg-primary text-white' : 'bg-white text-slate-400'
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-primary' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  return (
    <Card className="p-10 rounded-[2.5rem] border-none bg-slate-50 transition-all hover:bg-white hover:shadow-2xl group cursor-default">
      <div className={`w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${color}`}>
        <Icon className="h-8 w-8" />
      </div>
      <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h4>
      <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
    </Card>
  );
}

function StatItem({ value, label, description }: { value: string, label: string, description: string }) {
  return (
    <div className="flex flex-col gap-3 group">
      <div className="text-6xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{value}</div>
      <div className="space-y-1">
        <h4 className="text-sm font-black uppercase tracking-widest text-primary">{label}</h4>
        <p className="text-xs text-slate-400 font-medium">{description}</p>
      </div>
    </div>
  );
}
