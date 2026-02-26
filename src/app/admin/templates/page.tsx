"use client";

import { useState, useEffect } from 'react';
import { getDB, saveDB } from '@/app/lib/db';
import { CardTemplate, SchoolSettings, Student } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Layout, 
  Palette, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Eye, 
  Settings2,
  Save,
  RefreshCw,
  Check
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { StudentCardVisual } from '@/components/student-card-visual';
import { ExamCardVisual } from '@/components/exam-card-visual';
import { IdCardVisual } from '@/components/id-card-visual';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const PRESET_COLORS = [
  { name: 'Emerald Batik', hex: '#1B3C33', tailwind: 'bg-emerald-900' },
  { name: 'Navy Corporate', hex: '#0F172A', tailwind: 'bg-slate-900' },
  { name: 'Royal Blue', hex: '#1E3A8A', tailwind: 'bg-blue-900' },
  { name: 'Deep Maroon', hex: '#450A0A', tailwind: 'bg-red-950' },
  { name: 'Charcoal', hex: '#1F2937', tailwind: 'bg-gray-800' },
  { name: 'Deep Purple', hex: '#3B0764', tailwind: 'bg-purple-950' },
  { name: 'Forest Green', hex: '#064E3B', tailwind: 'bg-green-950' },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CardTemplate | null>(null);

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

  const openConfig = (template: CardTemplate) => {
    setEditingTemplate({ ...template });
    setIsConfigOpen(true);
  };

  const handleSelectColor = (hex: string, tailwind: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      preview_color: tailwind,
      config_json: JSON.stringify({ primary: hex })
    });
  };

  const getCurrentColorHex = () => {
    try {
      if (editingTemplate?.config_json) {
        return JSON.parse(editingTemplate.config_json).primary;
      }
    } catch (e) {}
    return null;
  };

  const handleSaveConfig = () => {
    if (!editingTemplate) return;

    const db = getDB();
    const updated = db.templates.map(t => 
      t.id === editingTemplate.id ? editingTemplate : t
    );
    
    db.templates = updated;
    saveDB(db);
    setTemplates(updated);
    setIsConfigOpen(false);
    toast({ title: "Tersimpan", description: `Konfigurasi ${editingTemplate.name} telah diperbarui.` });
  };

  const handleResetData = () => {
    localStorage.removeItem('educard_sync_db');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Template Desain</h1>
          <p className="text-muted-foreground">Pilih, aktifkan, dan kustomisasi gaya visual kartu sekolah Anda.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleResetData}>
            <RefreshCw className="h-4 w-4" /> Reset Database
          </Button>
          <Button className="gap-2" onClick={() => toast({ title: "Segera Hadir" })}>
            <Plus className="h-4 w-4" /> Template Baru
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className={cn(
            "overflow-hidden border-2 transition-all flex flex-col",
            template.is_active ? "border-primary shadow-lg bg-primary/5" : "border-transparent"
          )}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className={cn("p-2 rounded-lg border shadow-sm text-white", template.preview_color || 'bg-slate-400')}>
                  <Layout className="h-5 w-5" />
                </div>
                <div className="flex gap-2">
                  {template.is_active && (
                    <Badge className="gap-1 bg-primary">
                      <CheckCircle2 className="h-3 w-3" /> Aktif
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openConfig(template)}>
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
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
                <div className={cn(
                  "origin-center transform transition-transform group-hover:scale-[0.55] duration-500",
                  template.type === 'ID_CARD' ? 'scale-[0.4]' : 'scale-[0.5]'
                )}>
                  {template.type === 'STUDENT_CARD' && previewStudent && settings ? (
                    <StudentCardVisual student={previewStudent} settings={settings} />
                  ) : template.type === 'EXAM_CARD' && previewStudent && settings ? (
                    <ExamCardVisual student={previewStudent} settings={settings} />
                  ) : template.type === 'ID_CARD' && previewStudent && settings ? (
                    <IdCardVisual student={previewStudent} settings={settings} side="front" template={template} />
                  ) : (
                    <div className="w-[340px] h-[215px] bg-white border rounded-xl flex flex-col items-center justify-center p-4 text-center">
                      <div className={cn("w-full h-10 rounded-t-lg mb-4 opacity-50", template.preview_color)}></div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Desain {template.name}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-auto pt-4">
                <Button 
                  className="flex-1 gap-2" 
                  variant={template.is_active ? 'secondary' : 'default'}
                  disabled={template.is_active}
                  onClick={() => handleToggleActive(template.id)}
                >
                  {template.is_active ? 'Sedang Digunakan' : 'Aktifkan Template'}
                </Button>
                <Button variant="outline" size="icon" onClick={() => openConfig(template)}>
                  <Palette className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="outline" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Kustomisasi Visual</DialogTitle>
            <DialogDescription>
              Pilih identitas warna untuk template <strong>{editingTemplate?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="t-name">Nama Template</Label>
                <Input 
                  id="t-name" 
                  value={editingTemplate.name} 
                  onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Pilih Warna Tema Utama</Label>
                <div className="grid grid-cols-4 gap-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      className={cn(
                        "group relative aspect-square rounded-full border-2 transition-all flex items-center justify-center",
                        color.tailwind,
                        getCurrentColorHex() === color.hex ? "border-primary scale-110 shadow-md" : "border-transparent hover:scale-105"
                      )}
                      onClick={() => handleSelectColor(color.hex, color.tailwind)}
                      title={color.name}
                    >
                      {getCurrentColorHex() === color.hex && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground italic mt-2">Warna ini akan digunakan sebagai latar belakang dan aksen utama pada kartu.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfigOpen(false)}>Batal</Button>
            <Button className="gap-2" onClick={handleSaveConfig}>
              <Save className="h-4 w-4" /> Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
