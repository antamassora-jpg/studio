"use client";

import { useState, useEffect } from 'react';
import { getDB } from '@/app/lib/db';
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
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Sparkles, Download, FileText, Calendar, Filter, GraduationCap } from 'lucide-react';
import { analyzeAttendance } from '@/ai/flows/analyze-attendance-flow';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AttendanceAdminPage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<ExamEvent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('harian');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');

  useEffect(() => {
    const db = getDB();
    setLogs(db.logs);
    setStudents(db.students);
    setExams(db.exams);
    setIsMounted(true);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (activeTab === 'harian') {
      return log.session_id !== 'exam';
    } else {
      if (selectedExamFilter === 'all') return log.session_id === 'exam';
      return log.session_id === 'exam' && log.exam_id === selectedExamFilter;
    }
  });

  const handleAiAnalysis = async () => {
    if (filteredLogs.length === 0) {
      toast({ title: "Data kosong", description: "Belum ada data untuk dianalisis." });
      return;
    }

    setIsAnalyzing(true);
    setAiResult(null);
    try {
      const records = filteredLogs.map(l => {
        const student = students.find(s => s.id === l.student_id);
        const examName = exams.find(e => e.id === l.exam_id)?.name;
        return {
          studentId: l.student_id,
          studentName: student?.name || 'Unknown',
          nis: student?.nis || 'Unknown',
          date: l.date,
          sessionName: l.session_id === 'exam' ? `Ujian: ${examName}` : (l.session_id === 's1' ? 'Masuk' : 'Pulang'),
          status: l.is_valid ? 'Present' : 'Absent' as any,
          isLate: false
        };
      });

      const result = await analyzeAttendance({
        className: "Semua Kelas",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        attendanceRecords: records
      });
      setAiResult(result);
    } catch (err) {
      toast({ title: "Gagal analisis", description: "Terjadi kesalahan saat memproses data." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Rekap Absensi</h1>
          <p className="text-muted-foreground">Monitor kehadiran siswa harian dan event ujian.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80" onClick={handleAiAnalysis} disabled={isAnalyzing}>
            <Sparkles className="h-4 w-4" /> {isAnalyzing ? 'Menganalisis...' : 'AI Analisis Tren'}
          </Button>
        </div>
      </div>

      {aiResult && (
        <Card className="border-secondary bg-secondary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              <CardTitle className="text-lg">AI Analysis: {activeTab === 'harian' ? 'Absensi Harian' : 'Absensi Ujian'}</CardTitle>
            </div>
            <CardDescription>{aiResult.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Laju Kehadiran</div>
                <div className="text-2xl font-bold text-primary">{aiResult.overallStats.averageAttendanceRate}%</div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Total Absen</div>
                <div className="text-2xl font-bold text-destructive">{aiResult.overallStats.totalAbsences}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Kehadiran Valid</div>
                <div className="text-2xl font-bold text-emerald-500">{filteredLogs.filter(l => l.is_valid).length}</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Wawasan Utama:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {aiResult.patternsIdentified.map((p: string, i: number) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="harian" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="harian" className="gap-2">
              <Calendar className="h-4 w-4" /> Harian
            </TabsTrigger>
            <TabsTrigger value="ujian" className="gap-2">
              <GraduationCap className="h-4 w-4" /> Event Ujian
            </TabsTrigger>
          </TabsList>

          {activeTab === 'ujian' && (
            <div className="flex items-center gap-2 w-full md:w-64">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedExamFilter} onValueChange={setSelectedExamFilter}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Semua Ujian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Event Ujian</SelectItem>
                  {exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <TabsContent value="harian" className="mt-0">
          <AttendanceTable logs={filteredLogs} students={students} exams={exams} isMounted={isMounted} />
        </TabsContent>
        <TabsContent value="ujian" className="mt-0">
          <AttendanceTable logs={filteredLogs} students={students} exams={exams} isMounted={isMounted} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AttendanceTable({ logs, students, exams, isMounted }: { logs: AttendanceLog[], students: Student[], exams: ExamEvent[], isMounted: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Kehadiran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Siswa</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? logs.slice(0, 20).map(log => {
                const s = students.find(x => x.id === log.student_id);
                const isExam = log.session_id === 'exam';
                const examName = exams.find(e => e.id === log.exam_id)?.name;
                
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs">
                      <div className="font-medium">{log.date}</div>
                      <div className="text-muted-foreground">{isMounted ? new Date(log.scanned_at).toLocaleTimeString() : '--:--'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{s?.name || 'Siswa'}</div>
                      <div className="text-[10px] text-muted-foreground">{s?.class} - {s?.major}</div>
                    </TableCell>
                    <TableCell>
                      {isExam ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600">
                          <GraduationCap className="h-3 w-3" /> {examName}
                        </div>
                      ) : (
                        <div className="text-[10px] uppercase font-medium">
                          Sesi: {log.session_id === 's1' ? 'Masuk' : 'Pulang'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.is_valid ? 'default' : 'destructive'} className="text-[9px]">
                        {log.is_valid ? 'Hadir' : 'Gagal'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">Belum ada data absensi.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistik Visual</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[
                 {name: 'Valid', count: logs.filter(l => l.is_valid).length}, 
                 {name: 'Gagal', count: logs.filter(l => !l.is_valid).length}
               ]}>
                 <XAxis dataKey="name" fontSize={10} />
                 <YAxis fontSize={10} />
                 <Tooltip />
                 <Bar dataKey="count" fill="#2E50B8" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
