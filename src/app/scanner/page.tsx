"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, CheckCircle2, XCircle, Clock, History, ChevronsLeftRight, GraduationCap, Calendar } from 'lucide-react';
import { getDB, saveDB } from '@/app/lib/db';
import { Student, AttendanceLog, ExamEvent } from '@/app/lib/types';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

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
    if (db.exams.length > 0) setSelectedExamId(db.exams[0].id);
    
    const todayStr = new Date().toISOString().split('T')[0];
    setTodayLogs(db.logs.filter(l => l.date === todayStr));
    setIsMounted(true);
  }, []);

  const simulateScan = () => {
    if (attendanceType === 'ujian' && !selectedExamId) {
      alert("Silakan pilih event ujian terlebih dahulu.");
      return;
    }

    setIsScanning(true);
    setLastScan(null);
    
    setTimeout(() => {
      setIsScanning(false);
      const randomIdx = Math.floor(Math.random() * students.length);
      const student = students[randomIdx];
      
      const db = getDB();
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Check for duplicate based on type
      const sessionId = attendanceType === 'ujian' ? 'exam' : selectedSession;
      const exists = db.logs.find(l => 
        l.student_id === student.id && 
        l.date === todayStr && 
        l.session_id === sessionId &&
        (attendanceType === 'ujian' ? l.exam_id === selectedExamId : true)
      );
      
      if (exists) {
        setLastScan({ 
          status: 'duplicate', 
          student, 
          reason: attendanceType === 'ujian' ? 'Siswa sudah absen untuk ujian ini.' : 'Siswa sudah absen di sesi ini.' 
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
        scanned_by_user_id: 'demo-user',
        is_valid: isValid,
        reason: isValid ? undefined : 'Status kartu nonaktif'
      };

      db.logs.unshift(newLog);
      saveDB(db);
      setTodayLogs([newLog, ...todayLogs]);
      setLastScan({ 
        status: isValid ? 'valid' : 'invalid', 
        student, 
        reason: isValid ? undefined : 'Kartu Tidak Aktif' 
      });
    }, 1200);
  };

  const handleSwitchMode = () => router.push('/mode-selection');

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 relative">
                <Image src="https://iili.io/KAqSZhb.png" alt="Logo" fill className="object-contain" />
             </div>
             <div>
                <h1 className="text-xl font-bold text-primary font-headline">Scanner Petugas</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  Mode: {attendanceType === 'harian' ? 'Absensi Harian' : 'Absensi Ujian'}
                </p>
             </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSwitchMode} className="gap-2">
            <ChevronsLeftRight className="h-4 w-4" /> Ganti Role
          </Button>
        </div>

        <Card className={`border-t-4 ${attendanceType === 'harian' ? 'border-t-primary' : 'border-t-orange-500'}`}>
          <CardHeader>
            <CardTitle>Scan Kehadiran</CardTitle>
            <CardDescription>Pilih tipe absensi dan mulai memindai kartu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground">Tipe Absensi</Label>
                <Select value={attendanceType} onValueChange={(val: any) => setAttendanceType(val)}>
                  <SelectTrigger className="w-full">
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
                  <Label className="text-xs uppercase text-muted-foreground">Sesi Harian</Label>
                  <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s1">Masuk (Pagi)</SelectItem>
                      <SelectItem value="s2">Pulang (Sore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">Event Ujian</Label>
                  <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map(e => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className={`aspect-square w-full max-w-[280px] mx-auto rounded-3xl border-4 flex flex-col items-center justify-center gap-4 transition-all overflow-hidden relative ${isScanning ? 'border-secondary animate-pulse' : 'border-dashed border-muted-foreground/30 bg-muted/20'}`}>
               {isScanning ? (
                 <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center">
                   <div className="w-full h-1 bg-secondary absolute animate-[bounce_2s_infinite]"></div>
                   <QrCode className="h-16 w-16 text-secondary" />
                 </div>
               ) : (
                 <>
                   <QrCode className={`h-12 w-12 ${attendanceType === 'ujian' ? 'text-orange-500' : 'text-muted-foreground'}`} />
                   <p className="text-[10px] text-muted-foreground text-center px-6 font-medium">
                     {attendanceType === 'ujian' ? 'SIAP SCAN KARTU UJIAN' : 'SIAP SCAN ABSEN HARIAN'}
                   </p>
                 </>
               )}
            </div>

            {lastScan && (
              <div className={`p-4 rounded-xl flex items-center gap-4 border ${lastScan.status === 'valid' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="w-12 h-16 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                   {lastScan.student?.photo_url && <Image src={lastScan.student.photo_url} alt="Foto" fill className="object-cover" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    {lastScan.status === 'valid' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <span className="font-bold text-[10px] uppercase">{lastScan.status}</span>
                  </div>
                  <div className="font-bold truncate text-sm">{lastScan.student?.name}</div>
                  <div className="text-[10px] opacity-80">{lastScan.student?.class} - {lastScan.student?.major}</div>
                  {lastScan.reason && <div className="text-[10px] font-bold mt-1 text-red-600">{lastScan.reason}</div>}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className={`w-full h-12 text-lg gap-2 ${attendanceType === 'ujian' ? 'bg-orange-600 hover:bg-orange-700' : ''}`} size="lg" onClick={simulateScan} disabled={isScanning}>
              {attendanceType === 'ujian' ? <GraduationCap className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
              {isScanning ? 'Memproses...' : attendanceType === 'ujian' ? 'Scan Ujian' : 'Scan Absen'}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-sm">
              <History className="h-4 w-4 text-primary" /> Riwayat Hari Ini
            </h3>
            <span className="text-[10px] bg-muted px-2 py-1 rounded-full font-bold uppercase">{todayLogs.length} Records</span>
          </div>
          <div className="space-y-2">
            {todayLogs.length > 0 ? todayLogs.slice(0, 5).map(log => {
              const s = students.find(x => x.id === log.student_id);
              const isExam = log.session_id === 'exam';
              const examName = exams.find(e => e.id === log.exam_id)?.name;
              
              return (
                <div key={log.id} className={`bg-white p-3 rounded-lg border flex items-center justify-between shadow-sm ${isExam ? 'border-l-4 border-l-orange-500' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold overflow-hidden relative">
                       {s?.photo_url ? <Image src={s.photo_url} alt="X" fill className="object-cover"/> : s?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{s?.name}</div>
                      <div className="text-[9px] text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" /> 
                        {isMounted ? new Date(log.scanned_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                        {isExam && <span className="text-orange-600 font-bold uppercase">UJIAN: {examName}</span>}
                      </div>
                    </div>
                  </div>
                  <Badge variant={log.is_valid ? 'default' : 'destructive'} className="text-[9px] h-5">
                    {log.is_valid ? 'Hadir' : 'Invalid'}
                  </Badge>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-muted-foreground text-xs italic border rounded-lg border-dashed">Belum ada scan hari ini.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
