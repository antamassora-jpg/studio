"use client";

import { useState, useMemo } from 'react';
import { AttendanceLog, Student, ExamEvent } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend,
  CartesianGrid
} from 'recharts';
import { Calendar, Filter, GraduationCap, Loader2, Users, School, LayoutDashboard, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function AttendanceAdminPage() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState<string>('harian');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');

  // Load Database Master
  const logsQuery = useMemoFirebase(() => db ? query(collection(db, 'attendance_logs'), orderBy('scanned_at', 'desc')) : null, [db]);
  const { data: logsData, isLoading: loadingLogs } = useCollection<AttendanceLog>(logsQuery);
  const logs = logsData || [];

  const studentsQuery = useMemoFirebase(() => db ? collection(db, 'students') : null, [db]);
  const { data: studentsData } = useCollection<Student>(studentsQuery);
  const students = studentsData || [];

  const examsQuery = useMemoFirebase(() => db ? collection(db, 'exams') : null, [db]);
  const { data: examsData } = useCollection<ExamEvent>(examsQuery);
  const exams = examsData || [];

  // Filtering Logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (activeTab === 'harian') {
        return log.session_id !== 'exam';
      } else {
        if (selectedExamFilter === 'all') return log.session_id === 'exam';
        return log.session_id === 'exam' && log.exam_id === selectedExamFilter;
      }
    });
  }, [logs, activeTab, selectedExamFilter]);

  // Derived Statistics
  const stats = useMemo(() => {
    const uniqueStudentsInLogs = new Set(filteredLogs.map(l => l.student_id)).size;
    const uniqueClasses = new Set(students.map(s => s.class)).size;
    const uniqueMajors = new Set(students.map(s => s.major)).size;
    const validCount = filteredLogs.filter(l => l.is_valid).length;

    return {
      totalParticipants: uniqueStudentsInLogs,
      masterStudents: students.length,
      classesCount: uniqueClasses,
      majorsCount: uniqueMajors,
      validCount,
      invalidCount: filteredLogs.length - validCount,
      harianCount: logs.filter(l => l.session_id !== 'exam').length,
      ujianCount: logs.filter(l => l.session_id === 'exam').length
    };
  }, [logs, filteredLogs, students]);

  if (loadingLogs) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Menghubungkan ke Cloud Sync...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black font-headline text-[#2E50B8] tracking-tight uppercase">Rekapitulasi Absensi</h1>
          <p className="text-muted-foreground font-medium">Monitoring kehadiran otomatis dari Role Scanner secara real-time.</p>
        </div>
        <Badge variant="outline" className="h-10 px-4 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 gap-2 font-bold">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Scanner Role Auto-Sync Active
        </Badge>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatSummaryCard 
          label="Total Database Siswa" 
          value={stats.masterStudents} 
          subLabel="Siswa Terdaftar" 
          icon={Users} 
          color="text-blue-600 bg-blue-50"
        />
        <StatSummaryCard 
          label="Scan Harian" 
          value={stats.harianCount} 
          subLabel="Total Log Masuk/Pulang" 
          icon={History} 
          color="text-emerald-600 bg-emerald-50"
        />
        <StatSummaryCard 
          label="Scan Ujian" 
          value={stats.ujianCount} 
          subLabel="Total Log Event Ujian" 
          icon={GraduationCap} 
          color="text-orange-600 bg-orange-50"
        />
        <StatSummaryCard 
          label="Varian Kelas" 
          value={stats.classesCount} 
          subLabel="Tingkat Terdeteksi" 
          icon={School} 
          color="text-purple-600 bg-purple-50"
        />
      </div>

      <Tabs defaultValue="harian" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-2xl border mb-6 shadow-sm">
          <TabsList className="bg-slate-100 p-1 h-12 rounded-xl">
            <TabsTrigger value="harian" className="gap-2 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#2E50B8] data-[state=active]:shadow-sm font-bold text-xs uppercase">
              <Calendar className="h-4 w-4" /> Absensi Harian
            </TabsTrigger>
            <TabsTrigger value="ujian" className="gap-2 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#2E50B8] data-[state=active]:shadow-sm font-bold text-xs uppercase">
              <GraduationCap className="h-4 w-4" /> Absensi Ujian
            </TabsTrigger>
          </TabsList>

          {activeTab === 'ujian' && (
            <div className="flex items-center gap-3 w-full md:w-auto px-2">
              <span className="text-[10px] font-black uppercase text-slate-400">Filter Event:</span>
              <Select value={selectedExamFilter} onValueChange={setSelectedExamFilter}>
                <SelectTrigger className="w-full md:w-64 h-10 rounded-xl bg-slate-50 border-none font-bold text-slate-600">
                  <SelectValue placeholder="Semua Event Ujian" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all">Seluruh Event Terdaftar</SelectItem>
                  {exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name} ({e.school_year})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <TabsContent value="harian" className="mt-0">
              <AttendanceDataTable logs={filteredLogs} students={students} exams={exams} />
            </TabsContent>
            <TabsContent value="ujian" className="mt-0">
              <AttendanceDataTable logs={filteredLogs} students={students} exams={exams} isExamTab />
            </TabsContent>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <ComparisonStatsCard harian={stats.harianCount} ujian={stats.ujianCount} />
            <VisualStatsCard valid={stats.validCount} invalid={stats.invalidCount} color={activeTab === 'ujian' ? '#f97316' : '#2E50B8'} />
            
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Info Otomatisasi</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">Seluruh data yang ditampilkan masuk secara otomatis melalui pemindaian Kartu oleh <strong>Mode Scanner</strong>. Integritas data terjamin melalui enkripsi kode kartu.</p>
                <div className="p-4 bg-[#2E50B8]/5 rounded-2xl border border-[#2E50B8]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Total Scan Hari Ini</span>
                    <span className="font-black text-[#2E50B8]">{stats.harianCount + stats.ujianCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function StatSummaryCard({ label, value, subLabel, icon: Icon, color }: { label: string, value: number, subLabel: string, icon: any, color: string }) {
  return (
    <Card className="rounded-3xl border-none shadow-sm group hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110 duration-300`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Live Sync</span>
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-800 leading-none">{value}</h3>
          <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">{label}</p>
          <p className="text-[9px] text-muted-foreground mt-1 font-medium">{subLabel}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AttendanceDataTable({ logs, students, exams, isExamTab = false }: { logs: AttendanceLog[], students: Student[], exams: ExamEvent[], isExamTab?: boolean }) {
  return (
    <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
      <CardHeader className="bg-white border-b border-slate-50 py-6 px-8">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-slate-800">Riwayat Log {isExamTab ? 'Ujian' : 'Harian'}</CardTitle>
          <Badge variant="outline" className="rounded-full text-[9px] font-black uppercase tracking-[0.2em] py-1 px-4 text-slate-400 border-slate-100">
            {logs.length} Records
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-5 px-8 font-black uppercase text-[10px] text-slate-400 tracking-widest">Waktu & Sesi</TableHead>
              <TableHead className="py-5 font-black uppercase text-[10px] text-slate-400 tracking-widest">Identitas Siswa</TableHead>
              <TableHead className="py-5 font-black uppercase text-[10px] text-slate-400 tracking-widest">{isExamTab ? 'Nama Event Ujian' : 'Jenis Kehadiran'}</TableHead>
              <TableHead className="py-5 px-8 font-black uppercase text-[10px] text-slate-400 tracking-widest text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? logs.slice(0, 100).map(log => {
              const s = students.find(x => x.id === log.student_id);
              const examName = exams.find(e => e.id === log.exam_id)?.name || 'Event Tidak Teridentifikasi';
              
              return (
                <TableRow key={log.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                  <TableCell className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm">{log.date}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{new Date(log.scanned_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 leading-tight">{s?.name || 'Unknown Student'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s?.class || '-'} • {s?.major || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isExamTab ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[11px] font-black uppercase tracking-tight text-orange-700">{examName}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-[9px] font-black uppercase bg-slate-50 text-slate-500 border-none px-3">
                        Sesi: {log.session_id === 's1' ? 'Pagi (Masuk)' : 'Sore (Pulang)'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <Badge className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${log.is_valid ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-red-500 hover:bg-red-500'}`}>
                      {log.is_valid ? 'Berhasil' : 'Gagal'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-32">
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <History className="h-12 w-12" />
                    <p className="text-sm font-black uppercase tracking-widest">Belum ada data scan masuk</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ComparisonStatsCard({ harian, ujian }: { harian: number, ujian: number }) {
  const data = [
    { name: 'Harian', value: harian, fill: '#2E50B8' },
    { name: 'Ujian', value: ujian, fill: '#f97316' }
  ];

  return (
    <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
      <CardHeader className="bg-white border-b border-slate-50">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 text-center">Volume Scan (Jenis)</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: -20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function VisualStatsCard({ valid, invalid, color = "#2E50B8" }: { valid: number, invalid: number, color?: string }) {
  const data = [
    { name: 'Valid', value: valid, color },
    { name: 'Gagal', value: invalid, color: '#f43f5e' }
  ];

  return (
    <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
      <CardHeader className="bg-white border-b border-slate-50">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 text-center">Proporsi Keabsahan Scan</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] pt-6 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              fontSize={10} 
              axisLine={false} 
              tickLine={false} 
              fontFamily="monospace"
              fontWeight="900"
            />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
