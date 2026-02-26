"use client";

import { useState, useEffect, useRef } from 'react';
import { getDB } from '@/app/lib/db';
import { Student, SchoolSettings, ExamEvent } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExamCardVisual } from '@/components/exam-card-visual';
import { 
  Printer, 
  Download, 
  Eye, 
  RefreshCw, 
  Search, 
  CheckSquare, 
  Square,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function ExamCardsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<ExamEvent[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  
  const cardRefFront = useRef<HTMLDivElement>(null);
  const cardRefBack = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const db = getDB();
    setStudents(db.students);
    setSettings(db.school_settings);
    setExams(db.exams);
    if (db.exams.length > 0) setSelectedExamId(db.exams[0].id);
    if (db.students.length > 0) setPreviewId(db.students[0].id);
  }, []);

  const selectedExam = exams.find(e => e.id === selectedExamId);
  const classes = Array.from(new Set(students.map(s => s.class)));

  const filteredStudents = students.filter(s => {
    const matchClass = selectedClass === 'all' || s.class === selectedClass;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.nis.includes(searchQuery);
    return matchClass && matchSearch;
  });

  const previewStudent = students.find(s => s.id === previewId);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const handleDownloadSingle = async () => {
    if (!previewStudent || !cardRefFront.current || !cardRefBack.current) return;
    setIsProcessing(true);
    
    try {
      const canvasFront = await html2canvas(cardRefFront.current, { scale: 3, useCORS: true });
      const canvasBack = await html2canvas(cardRefBack.current, { scale: 3, useCORS: true });

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
      pdf.addImage(canvasFront.toDataURL('image/png'), 'PNG', 0, 0, 85.6, 54);
      pdf.addPage([85.6, 54], 'landscape');
      pdf.addImage(canvasBack.toDataURL('image/png'), 'PNG', 0, 0, 85.6, 54);

      pdf.save(`Kartu_Ujian_${previewStudent.name.replace(/\s+/g, '_')}.pdf`);
      toast({ title: "Berhasil", description: "PDF Kartu Ujian telah diunduh." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Gagal membuat PDF." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    if (!selectedExamId) {
      toast({ variant: "destructive", title: "Pilih Ujian", description: "Silahkan pilih event ujian terlebih dahulu." });
      return;
    }
    setTimeout(() => {
      window.print();
      setIsPrintModalOpen(false);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Print Area Section */}
      <div id="print-area">
        <div className="flex flex-col items-center gap-10 p-10">
          {(selectedIds.size > 0 ? Array.from(selectedIds) : [previewId]).map(id => {
            const s = students.find(x => x.id === id);
            return s && settings ? (
              <div key={id} className="page-break flex flex-col gap-6 items-center mb-10 pb-10 border-b border-dashed">
                <ExamCardVisual student={s} settings={settings} exam={selectedExam} side="front" />
                <ExamCardVisual student={s} settings={settings} exam={selectedExam} side="back" />
              </div>
            ) : null;
          })}
        </div>
      </div>

      <div className="no-print flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Kartu Ujian</h1>
          <p className="text-muted-foreground">Cetak kartu tanda peserta ujian untuk siswa.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setIsPrintModalOpen(true)} disabled={selectedIds.size === 0}>
            <Printer className="h-4 w-4" /> Cetak Massal ({selectedIds.size})
          </Button>
        </div>
      </div>

      <div className="no-print grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Ujian</CardTitle>
              <CardDescription>Pilih pelaksanaan ujian aktif.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Event Ujian" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name} ({e.semester})</SelectItem>)}
                </SelectContent>
              </Select>
              {!selectedExamId && (
                <div className="mt-4 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                  <AlertCircle className="h-4 w-4" />
                  Belum ada event ujian terpilih.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Siswa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Filter Kelas</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {classes.map(c => <SelectItem key={c} value={c}>Kelas {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Daftar Siswa</span>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={toggleSelectAll}>
                    {selectedIds.size === filteredStudents.length ? 'Batal Semua' : 'Pilih Semua'}
                  </Button>
                </div>
                <div className="max-h-[300px] overflow-y-auto border rounded divide-y bg-muted/5">
                  {filteredStudents.map(s => (
                    <div 
                      key={s.id} 
                      className={`p-2.5 text-xs cursor-pointer hover:bg-white flex items-center justify-between transition-colors ${previewId === s.id ? 'bg-white border-l-4 border-primary' : ''}`}
                      onClick={() => setPreviewId(s.id)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div onClick={(e) => toggleSelect(s.id, e)}>
                          {selectedIds.has(s.id) ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="truncate">
                          <div className="font-bold truncate">{s.name}</div>
                          <div className="text-[9px] text-muted-foreground">{s.nis}</div>
                        </div>
                      </div>
                      <Eye className={`h-3 w-3 ${previewId === s.id ? 'text-primary' : 'opacity-20'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Pratinjau Kartu Ujian</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8 py-10 bg-muted/10 rounded-b-lg">
            {previewStudent && settings ? (
              <>
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tampilan Depan</span>
                  <div ref={cardRefFront} className="shadow-2xl">
                    <ExamCardVisual student={previewStudent} settings={settings} exam={selectedExam} side="front" />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tampilan Belakang</span>
                  <div ref={cardRefBack} className="shadow-2xl">
                    <ExamCardVisual student={previewStudent} settings={settings} exam={selectedExam} side="back" />
                  </div>
                </div>
                <div className="flex gap-3 w-full max-w-sm">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadSingle} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Unduh PDF
                  </Button>
                  <Button className="flex-1 gap-2" onClick={handlePrint}>
                    <Printer className="h-4 w-4" /> Cetak
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-20 text-muted-foreground italic">Pilih siswa untuk melihat pratinjau</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
        <DialogContent className="max-w-3xl no-print">
          <DialogHeader>
            <DialogTitle>Konfirmasi Cetak Massal</DialogTitle>
            <DialogDescription>
              Anda akan mencetak {selectedIds.size} kartu ujian untuk event <strong>{selectedExam?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-orange-50 p-4 border border-orange-200 rounded-lg flex items-start gap-3">
             <FileText className="h-5 w-5 text-orange-500 mt-0.5" />
             <div className="text-xs space-y-1">
               <p className="font-bold text-orange-900">Petunjuk Pencetakan:</p>
               <ul className="list-disc list-inside text-orange-800">
                 <li>Gunakan kertas minimal 210gsm untuk kartu yang kaku.</li>
                 <li>Setel margin "None" pada dialog print browser.</li>
                 <li>Pastikan opsi "Background Graphics" dicentang.</li>
               </ul>
             </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPrintModalOpen(false)}>Batal</Button>
            <Button className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" /> Mulai Cetak Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}