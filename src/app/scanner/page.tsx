"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, CheckCircle2, XCircle, Clock, History, ChevronsLeftRight, GraduationCap, Calendar, Loader2 } from 'lucide-react';
import { getDB, saveDB } from '@/app/lib/db';
import { Student, AttendanceLog, ExamEvent } from '@/app/lib/types';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function ScannerPage() {
  const router = useRouter();
  const [attendanceType, setAttendanceType] = useState<'harian' | 'ujian'>('harian');
  const [selectedSession, setSelectedSession] = useState('s1');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<{ status: 'valid' | 'invalid' | 'duplicate', student?: Student, reason?: string } | null>(null);
  const [todayLogs, setTodayLogs] = useState<AttendanceLog[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<ExamEvent[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const db = getDB();
    setStudents(db.students);
    setExams(db.exams);
    
    // Set default exam if available
    if (db.exams.length > 0) {
      setSelectedExamId(db.exams[0].id);
    }
    
    const todayStr = new Date().toISOString().split('T')[0];
    setTodayLogs(db.logs.filter(l => l.date === todayStr));
    setIsMounted(true);
  }, []);

  const simulateScan = () => {
    if (attendanceType === 'ujian' && !selectedExamId) {
      toast({
        variant: "destructive",
        title: "Pilih Ujian",
        description: "Silakan pilih event ujian terlebih dahulu di menu dropdown."
      });
      return;
    }

    if (students.length === 0) {
      toast({
        variant: "destructive",
        title: "Database Kosong",
        description: "Tidak ada data siswa untuk dipindai."
      });
      return;
    }

    setIsScanning(true);
    setLastScan(null);
    
    // Simulasi proses scanning 1.2 detik
    setTimeout(() => {
      setIsScanning(false);
      
      // Ambil siswa acak untuk simulasi scan kartu
      const randomIdx = Math.floor(Math.random() * students.length);
      const student = students[randomIdx];
      
      const db = getDB();
      const todayStr = new Date().toISOString().split('T')[0];
      const sessionId = attendanceType === 'ujian' ? 'exam' : selectedSession;
      
      // Cek apakah sudah absen (Duplicate Check)
      const isDuplicate = db.logs.some(l => 
        l.student_id === student.id && 
        l.date === todayStr && 
        l.session_id === sessionId &&
        (attendanceType === 'ujian' ? l.exam_id === selectedExamId : true)
      );
      
      if (isDuplicate) {
        setLastScan({ 
          status: 'duplicate', 
          student, 
          reason: attendanceType === 'ujian' ? 'Sudah absen untuk ujian ini hari ini.' : 'Sudah absen di sesi ini.' 
        });
        toast({
          variant: "destructive",
          title: "Sudah Absen",
          description: `${student.name} sudah tercatat kehadirannya.`
        });
        return;
      }

      const isValid = student.status === 'Aktif';
      
      const newLog: AttendanceLog = {
        id: Math.random().toString(36).substr(2, 9),
        student_id: student.id,
        card_code: student.card_code,
        date: todayStr,
        session_id: sessionId,
        exam_id: attendanceType === 'ujian' ? selectedExamId : undefined,
        scanned_at: new Date().toISOString(),
        scanned_by_user_id: 'petugas-demo',
        is_valid: isValid,
        reason: isValid ? undefined : 'Status kartu nonaktif/pindah'
      };

      // Simpan ke database lokal
      const updatedLogs = [newLog, ...db.logs];
      db.logs = updatedLogs;
      saveDB(db);
      
      // Update state lokal UI
      setTodayLogs(updatedLogs.filter(l => l.date === todayStr));
      setLastScan({ 
        status: isValid ? 'valid' : 'invalid', 
        student, 
        reason: isValid ? undefined : 'Kartu Tidak Aktif' 
      });

      if (isValid) {
        toast({
          title: "Berhasil",
          description: `${student.name} berhasil diabsen.`
        });
      }
    }, 1200);
  };

  const handleSwitchMode = () => router.push('/mode-selection');

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 relative">
                <Image src="https://iili.io/KAqSZhb.png" alt="Logo" fill className="object-contain" unoptimized />
             </div>
             <div>
                <h1 className="text-lg font-bold text-primary font-headline">Scanner Petugas</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                  {attendanceType === 'harian' ? 'ABSENSI HARIAN' : 'ABSENSI EVENT UJIAN'}
                </p>
             </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSwitchMode} className="gap-2 text-muted-foreground hover:text-primary">
            <ChevronsLeftRight className="h-4 w-4" /> Ganti Role
          </Button>
        </div>

        <Card className={`overflow-hidden border-none shadow-xl ${attendanceType === 'harian' ? 'ring-2 ring-primary/20' : 'ring-2 ring-orange-500/20'}`}>
          <div className={`h-2 ${attendanceType === 'harian' ? 'bg-primary' : 'bg-orange-500'}`}></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" /> Mode Pemindaian
            </CardTitle>
            <CardDescription>Pilih jenis absensi yang sedang berlangsung.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Jenis Absensi</Label>
                <Select value={attendanceType} onValueChange={(val: any) => setAttendanceType(val)}>
                  <SelectTrigger className="w-full h-11 bg-slate-50 border-none font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harian">Absensi Harian</SelectItem>
                    <SelectItem value="ujian">Absensi Ujian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {attendanceType === 'harian' ? (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sesi Hari Ini</Label>
                  <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger className="w-full h-11 bg-slate-50 border-none font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s1">Pagi (Masuk)</SelectItem>
                      <SelectItem value="s2">Sore (Pulang)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pilih Event Ujian</Label>
                  <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger className="w-full h-11 bg-slate-50 border-none font-bold">
                      <SelectValue placeholder="Pilih Ujian" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.length > 0 ? exams.map(e => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      )) : (
                        <SelectItem value="none" disabled>Belum ada event ujian</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div 
              className={`aspect-square w-full max-w-[280px] mx-auto rounded-3xl border-4 flex flex-col items-center justify-center gap-4 transition-all overflow-hidden relative ${
                isScanning 
                ? 'border-secondary animate-pulse shadow-[0_0_30px_rgba(79,191,221,0.3)]' 
                : 'border-dashed border-slate-200 bg-slate-50'
              }`}
            >
               {isScanning ? (
                 <div className="absolute inset-0 bg-secondary/5 flex flex-col items-center justify-center">
                   <div className="w-full h-1 bg-secondary absolute animate-[bounce_2s_infinite]"></div>
                   <Loader2 className="h-16 w-16 text-secondary animate-spin" />
                   <p className="mt-4 font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Memindai...</p>
                 </div>
               ) : (
                 <>
                   <div className={`p-6 rounded-full ${attendanceType === 'ujian' ? 'bg-orange-100 text-orange-600' : 'bg-primary/10 text-primary'}`}>
                      <QrCode className="h-12 w-12" />
                   </div>
                   <p className="text-[10px] text-muted-foreground text-center px-10 font-bold uppercase tracking-widest leading-relaxed">
                     Dekatkan kartu ke kamera untuk memindai
                   </p>
                 </>
               )}
            </div>

            {lastScan && (
              <div className={`p-4 rounded-2xl flex items-center gap-4 border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                lastScan.status === 'valid' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
              }`}>
                <div className="w-14 h-18 relative rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0 border-2 border-white">
                   {lastScan.student?.photo_url ? (
                     <Image src={lastScan.student.photo_url} alt="Foto" fill className="object-cover" unoptimized />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[8px] font-bold">FOTO</div>
                   )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    {lastScan.status === 'valid' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                    <span className="font-black text-[9px] uppercase tracking-widest">
                      {lastScan.status === 'duplicate' ? 'DUPLIKAT' : (lastScan.status === 'valid' ? 'BERHASIL' : 'GAGAL')}
                    </span>
                  </div>
                  <div className="font-black truncate text-base uppercase leading-tight">{lastScan.student?.name}</div>
                  <div className="text-[10px] font-bold opacity-70">{lastScan.student?.class} • {lastScan.student?.major}</div>
                  {lastScan.reason && (
                    <div className="mt-2 text-[10px] bg-white/50 px-2 py-1 rounded inline-block font-bold">
                      {lastScan.reason}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50 p-6">
            <Button 
              className={`w-full h-14 text-lg font-black uppercase tracking-widest gap-3 shadow-lg ${
                attendanceType === 'ujian' 
                ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20' 
                : 'bg-primary hover:bg-primary/90 shadow-primary/20'
              }`} 
              size="lg" 
              onClick={simulateScan} 
              disabled={isScanning}
            >
              {isScanning ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                attendanceType === 'ujian' ? <GraduationCap className="h-6 w-6" /> : <QrCode className="h-6 w-6" />
              )}
              {isScanning ? 'MENGOLAH...' : (attendanceType === 'ujian' ? 'SIMULASI SCAN UJIAN' : 'SIMULASI SCAN ABSEN')}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2 text-slate-500">
              <History className="h-4 w-4" /> Riwayat Hari Ini
            </h3>
            <Badge variant="outline" className="bg-white border-slate-200 text-[10px] font-black uppercase">
              {todayLogs.length} Records
            </Badge>
          </div>
          <div className="space-y-2">
            {todayLogs.length > 0 ? todayLogs.slice(0, 5).map(log => {
              const s = students.find(x => x.id === log.student_id);
              const isExam = log.session_id === 'exam';
              const examName = exams.find(e => e.id === log.exam_id)?.name;
              
              return (
                <div 
                  key={log.id} 
                  className={`bg-white p-4 rounded-2xl border flex items-center justify-between shadow-sm transition-all hover:shadow-md ${
                    isExam ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-inner flex items-center justify-center text-[10px] font-bold overflow-hidden relative">
                       {s?.photo_url ? (
                         <Image src={s.photo_url} alt="X" fill className="object-cover" unoptimized />
                       ) : (
                         <span className="opacity-40">{s?.name.charAt(0)}</span>
                       )}
                    </div>
                    <div>
                      <div className="text-sm font-black uppercase leading-none mb-1">{s?.name || 'Siswa'}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-3 font-bold">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(log.scanned_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {isExam ? (
                          <span className="text-orange-600 flex items-center gap-1"><GraduationCap className="h-3 w-3" /> {examName}</span>
                        ) : (
                          <span className="text-primary flex items-center gap-1"><Calendar className="h-3 w-3" /> {log.session_id === 's1' ? 'PAGI' : 'SORE'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant={log.is_valid ? 'default' : 'destructive'} className="text-[9px] font-black px-3 h-6 rounded-full">
                    {log.is_valid ? 'HADIR' : 'GAGAL'}
                  </Badge>
                </div>
              );
            }) : (
              <div className="bg-white/50 backdrop-blur-sm text-center py-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-2 border-dashed rounded-2xl">
                Belum ada aktivitas hari ini
              </div>
            )}
          </div>
          
          {todayLogs.length > 5 && (
            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400" onClick={() => router.push('/admin/attendance')}>
              Lihat Semua Log di Panel Admin
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
