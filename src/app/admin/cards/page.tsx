"use client";

import { useState, useEffect } from 'react';
import { getDB } from '@/app/lib/db';
import { Student, SchoolSettings } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentCardVisual } from '@/components/student-card-visual';
import { Printer, Download, Eye, RefreshCw } from 'lucide-react';

export default function CardsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    const db = getDB();
    setStudents(db.students);
    setSettings(db.school_settings);
    if (db.students.length > 0) setPreviewId(db.students[0].id);
  }, []);

  const classes = Array.from(new Set(students.map(s => s.class)));
  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(s => s.class === selectedClass);

  const previewStudent = students.find(s => s.id === previewId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Kartu Pelajar</h1>
          <p className="text-muted-foreground">Generate dan cetak kartu pelajar siswa.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export Semua
          </Button>
          <Button className="gap-2">
            <Printer className="h-4 w-4" /> Cetak Massal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pilih</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter Kelas</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Daftar Siswa ({filteredStudents.length})</label>
              <div className="max-h-[400px] overflow-y-auto border rounded-md divide-y bg-muted/20">
                {filteredStudents.map(s => (
                  <div 
                    key={s.id} 
                    className={`p-3 text-sm cursor-pointer hover:bg-white flex items-center justify-between group ${previewId === s.id ? 'bg-white border-l-4 border-primary' : ''}`}
                    onClick={() => setPreviewId(s.id)}
                  >
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.nis}</div>
                    </div>
                    <Eye className={`h-4 w-4 opacity-0 group-hover:opacity-100 ${previewId === s.id ? 'opacity-100 text-primary' : ''}`} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              Live Preview
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <RefreshCw className="h-3 w-3" /> Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8 py-8 bg-muted/10">
            {previewStudent && settings ? (
              <>
                <div className="space-y-4 flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tampak Depan</span>
                  <StudentCardVisual student={previewStudent} settings={settings} side="front" />
                </div>
                <div className="space-y-4 flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tampak Belakang</span>
                  <StudentCardVisual student={previewStudent} settings={settings} side="back" />
                </div>
                <div className="w-full flex justify-center gap-4 mt-4">
                   <Button variant="outline" className="gap-2">
                     <Download className="h-4 w-4" /> Download PDF (1 Kartu)
                   </Button>
                   <Button className="gap-2">
                     <Printer className="h-4 w-4" /> Cetak Sekarang
                   </Button>
                </div>
              </>
            ) : (
              <div className="py-20 text-muted-foreground italic">Pilih siswa untuk melihat preview</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}