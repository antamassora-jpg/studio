"use client";

import { useState, useEffect } from 'react';
import { getDB, saveDB } from '@/app/lib/db';
import { CardTemplate, SchoolSettings, Student } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout, Palette, CheckCircle2, Copy, Trash2, Plus, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { StudentCardVisual } from '@/components/student-card-visual';
import { ExamCardVisual } from '@/components/exam-card-visual';
import { IdCardVisual } from '@/components/id-card-visual';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  useEffect(() => {
    const db = getDB();
    setTemplates(db.templates);
    setSettings(db.school_settings);
    if (db.students.length > 0) setPreviewStudent(db.students[0]);
  }, []);

  const handleToggleActive = (id: string) => {
    const db = getDB();
    const type = db.templates.find(t => t.id === id)?.type;
    
    const updated = db.templates.map(t => {
      if (t.type === type) {
        return { ...t, is_active: t.id === id };
      }
      return t;
    });
    
    db.templates = updated;
    saveDB(db);
    setTemplates(updated);
    toast({ title: "Template Diperbarui", description: "Template aktif berhasil diubah." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Template Desain</h1>
        <p className="text-muted-foreground">Pilih dan aktifkan gaya kartu untuk sekolah Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className={`overflow-hidden border-2 transition-all flex flex-col ${template.is_active ? 'border-primary shadow-md bg-primary/5' : 'border-transparent'}`}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg border shadow-sm ${template.preview_color} text-white`}>
                  <Layout className="h-5 w-5" />
                </div>
                {template.is_active && (
                  <Badge className="gap-1 bg-primary">
                    <CheckCircle2 className="h-3 w-3" /> Digunakan
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription>
                  Tipe: {template.type === 'STUDENT_CARD' ? 'Kartu Pelajar' : template.type === 'EXAM_CARD' ? 'Kartu Ujian' : 'ID Card Umum'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-2 space-y-6">
              <div className="aspect-[4/5] bg-white rounded-xl flex items-center justify-center border-2 border-dashed relative group overflow-hidden shadow-inner">
                <div className={`${template.type === 'ID_CARD' ? 'scale-[0.5]' : 'scale-[0.6]'} origin-center transform transition-transform group-hover:scale-[1.1] duration-500`}>
                  {template.type === 'STUDENT_CARD' && previewStudent && settings ? (
                    <StudentCardVisual student={previewStudent} settings={settings} />
                  ) : template.type === 'EXAM_CARD' && previewStudent && settings ? (
                    <ExamCardVisual student={previewStudent} settings={settings} />
                  ) : template.type === 'ID_CARD' && previewStudent && settings ? (
                    <IdCardVisual student={previewStudent} settings={settings} />
                  ) : (
                    <div className="w-[340px] h-[215px] bg-white border rounded-xl flex flex-col items-center justify-center p-4">
                      <div className={`w-full h-10 ${template.preview_color} rounded-t-lg mb-4`}></div>
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Preview {template.name}</p>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="gap-2">
                    <Eye className="h-4 w-4" /> Pratinjau
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <Button 
                  className="flex-1 gap-2" 
                  variant={template.is_active ? 'secondary' : 'default'}
                  disabled={template.is_active}
                  onClick={() => handleToggleActive(template.id)}
                >
                  {template.is_active ? 'Aktif' : 'Gunakan'}
                </Button>
                <Button variant="outline" size="icon">
                  <Palette className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-2 border-dashed flex flex-col items-center justify-center py-12 gap-4 cursor-pointer hover:bg-muted/50 transition-colors group">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Plus className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h4 className="font-bold">Rancang Desain</h4>
            <p className="text-xs text-muted-foreground">Mulai kustomisasi baru</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
