"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard, 
  QrCode, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image 
                src="https://iili.io/KAqSZhb.png" 
                alt="Logo SMKN 2 Tana Toraja" 
                fill 
                className="object-contain"
                data-ai-hint="school logo"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary leading-none">EduCard Sync</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Tana Toraja</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Fitur</Link>
            <Link href="#about" className="hover:text-primary transition-colors">Tentang</Link>
            <Link href="/login">
              <Button size="sm" className="px-6 rounded-full">Portal Masuk</Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Digitalisasi Sekolah Modern
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Transformasi <span className="text-primary italic">Identity</span> & <span className="text-secondary">Attendance</span> Sekolah.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Platform terpadu SMKN 2 Tana Toraja untuk manajemen kartu pelajar digital, sistem absensi QR-Code, dan verifikasi ujian berbasis keamanan tinggi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-lg shadow-primary/20 gap-2 w-full sm:w-auto">
                    Mulai Sekarang <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl w-full sm:w-auto">
                  Pelajari Lebih Lanjut
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                      <Image 
                        src={`https://picsum.photos/seed/user-${i}/100/100`} 
                        alt="User" 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  <span className="text-primary font-bold">1,200+</span> Siswa telah terdaftar
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50 -z-10"></div>
              <div className="relative bg-white rounded-2xl border shadow-2xl overflow-hidden aspect-[4/3]">
                <Image 
                  src="https://picsum.photos/seed/school-hero/1200/800" 
                  alt="Dashboard Preview" 
                  fill 
                  className="object-cover"
                  data-ai-hint="modern school"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="text-green-400 h-6 w-6" />
                    <span className="font-bold text-xl uppercase tracking-wider">Verified Identity</span>
                  </div>
                  <p className="text-white/80 text-sm">Sistem terintegrasi untuk keamanan dan efisiensi administratif sekolah.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">Solusi Cerdas untuk Sekolah Kita</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Dirancang khusus untuk memenuhi kebutuhan SMKN 2 Tana Toraja dengan teknologi terkini.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={CreditCard} 
              title="Kartu Pelajar Digital" 
              description="Hasilkan kartu pelajar profesional dengan QR Code unik yang terintegrasi secara instan."
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <FeatureCard 
              icon={QrCode} 
              title="Absensi Real-time" 
              description="Sistem scan cepat untuk absensi harian yang langsung tercatat ke dalam database sekolah."
              color="text-emerald-600"
              bgColor="bg-emerald-50"
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Analisis AI" 
              description="Analisis tren kehadiran siswa secara otomatis menggunakan teknologi AI untuk deteksi dini masalah."
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Verifikasi Ujian" 
              description="Gunakan kartu sebagai kartu ujian yang aman untuk meminimalkan kecurangan dan memudahkan administrasi."
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-extrabold">1240+</div>
              <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-widest">Siswa Aktif</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold">15k+</div>
              <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-widest">Log Absensi</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold">100%</div>
              <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-widest">Digitalized</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold">24/7</div>
              <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-widest">Sistem Aktif</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Visi Digital SMKN 2 Tana Toraja</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                EduCard Sync bukan sekadar alat absensi. Ini adalah komitmen kami untuk membawa SMKN 2 Tana Toraja ke era pendidikan 4.0. Kami percaya bahwa transparansi data dan kemudahan akses adalah kunci keberhasilan akademik.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-primary/10 p-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 text-primary" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Efisiensi Administrasi</h4>
                    <p className="text-sm text-muted-foreground">Mengurangi beban kerja manual petugas dan guru dalam mencatat kehadiran.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-primary/10 p-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 text-primary" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Keamanan Terjamin</h4>
                    <p className="text-sm text-muted-foreground">Setiap kartu memiliki kode enkripsi unik yang sulit dipalsukan.</p>
                  </div>
                </div>
              </div>
              <Button variant="link" className="px-0 text-primary font-bold group">
                Baca Selengkapnya <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
               <div className="space-y-4">
                  <div className="h-64 relative rounded-2xl overflow-hidden shadow-lg border">
                    <Image src="https://picsum.photos/seed/school-life/400/600" alt="Activity" fill className="object-cover" />
                  </div>
                  <div className="h-48 relative rounded-2xl overflow-hidden shadow-lg border">
                    <Image src="https://picsum.photos/seed/school-building/400/400" alt="School" fill className="object-cover" />
                  </div>
               </div>
               <div className="space-y-4 pt-12">
                  <div className="h-48 relative rounded-2xl overflow-hidden shadow-lg border">
                    <Image src="https://picsum.photos/seed/tech-lab/400/400" alt="Tech" fill className="object-cover" />
                  </div>
                  <div className="h-64 relative rounded-2xl overflow-hidden shadow-lg border">
                    <Image src="https://picsum.photos/seed/students/400/600" alt="Students" fill className="object-cover" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 bg-white rounded-md p-1">
                  <Image src="https://iili.io/KAqSZhb.png" alt="Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-white text-lg">EduCard Sync</span>
              </div>
              <p className="text-sm leading-relaxed opacity-70">
                Solusi manajemen identitas digital terintegrasi untuk SMKN 2 Tana Toraja. Masa depan sekolah ada di genggaman Anda.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Navigasi</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">Fitur Utama</Link></li>
                <li><Link href="#about" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Portal Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Layanan</h4>
              <ul className="space-y-4 text-sm">
                <li><span className="opacity-70">Kartu Pelajar</span></li>
                <li><span className="opacity-70">Absensi Digital</span></li>
                <li><span className="opacity-70">Kartu Ujian</span></li>
                <li><span className="opacity-70">Laporan AI</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Kontak</h4>
              <ul className="space-y-4 text-sm opacity-70">
                <li>Jl. Poros Makale-Rantepao, Tana Toraja</li>
                <li>admin@smkn2tanatoraja.sch.id</li>
                <li>(0423) 123456</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs opacity-50 uppercase tracking-widest font-bold">
            <p>&copy; {isMounted ? new Date().getFullYear() : '2024'} SMKN 2 TANA TORAJA. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color, bgColor }: any) {
  return (
    <Card className="border-none shadow-none bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-8 space-y-4">
        <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center ${color}`}>
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="font-bold text-xl text-slate-900 leading-tight">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
