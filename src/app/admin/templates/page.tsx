
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
  Save,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Type,
  ChevronRight
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEFAULT_CONFIG = {
  front: {
    headerBg: '#1B3C33',
    bodyBg: '#ffffff',
    footerBg: '#10B981',
    textColor: '#334155',
    bgImage: '',
  },
  back: {
    headerBg: '#1B3C33',
    bodyBg: '#ffffff',
    footerBg: '#f8fafc',
    textColor: '#334155',
    bgImage: '',
  }
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CardTemplate | null>(null);
  const [localConfig, setLocalConfig] = useState<any>(DEFAULT_CONFIG);

  useEffect(() => {
    const db = getDB();
    setTemplates(db.templates);
    setSettings(db.school_settings);
    if (db.students.length > 0) {
      setPreviewStudent(db.students[0]);
    } else {
      // Mock data for template preview if no students exist
      setPreviewStudent({
        id: 'preview',
        name: 'NAMA LENGKAP SISWA',
        nis: '12345678',
        nisn: '0012345678',
        major: 'PROGRAM KEAHLIAN SISWA',
        class: 'XII',
        school_year: '2024/2025',
        status: 'Aktif',
        valid_until: '2025-06-30',
        card_code: 'PREVIEW-001',
        photo_url: 'https://picsum.photos/seed/preview/300/400'
      });
    }
  }, []);

  useEffect(() => {
    if (editingTemplate) {
      try {
        const parsed = JSON.parse(editingTemplate.config_json);
        setLocalConfig({
          front: { ...DEFAULT_CONFIG.front, ...parsed.front },
          back: { ...DEFAULT_CONFIG.back, ...parsed.back }
        });
      } catch (e) {
        setLocalConfig(DEFAULT_CONFIG);
      }
    }
  }, [editingTemplate]);

  const handleToggleActive = (id: string) => {
    const db = getDB();
    const type = db.templates.find(t => t.id === id)?.type;
    const updated = db.templates.map(t => {
      if (t.type === type) return { ...t, is_active: t.id === id };
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

  const handleImageUpload = (side: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalConfig({
        ...localConfig,
        [side]: { ...localConfig[side], bgImage: reader.result as string }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveConfig = () => {
    if (!editingTemplate) return;
    const db = getDB();
    const updatedTemplate = {
      ...editingTemplate,
      config_json: JSON.stringify(localConfig)
    };
    const updated = db.templates.map(t => t.id === editingTemplate.id ? updatedTemplate : t);
    db.templates = updated;
    saveDB(db);
    setTemplates(updated);
    setIsConfigOpen(false);
    toast({ title: "Tersimpan", description: `Desain ${editingTemplate.name} telah diperbarui.` });
  };

  const handleResetData = () => {
    if (confirm("Reset database akan menghapus semua kustomisasi template dan kembali ke pengaturan awal. Lanjutkan?")) {
      localStorage.removeItem('educard_sync_db');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Template Desain</h1>
          <p className="text-muted-foreground">Kustomisasi identitas visual kartu untuk setiap kebutuhan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground" onClick={handleResetData}>
            <RefreshCw className="h-4 w-4" /> Reset Desain
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className={cn(
            "overflow-hidden border-2 transition-all flex flex-col group",
            template.is_active ? "border-primary shadow-lg bg-primary/[0.02]" : "border-transparent hover:border-slate-200"
          )}>
            <CardHeader className="pb-4 relative">
              <div className="flex justify-between items-start">
                <div className={cn("p-2 rounded-lg border shadow-sm text-white transition-transform group-hover:scale-110", template.preview_color || 'bg-slate-400')}>
                  <Layout className="h-5 w-5" />
                </div>
                {template.is_active && (
                  <Badge className="gap-1 bg-primary px-3 py-1">
                    <CheckCircle2 className="h-3 w-3" /> Aktif
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <CardTitle className="text-xl font-bold">{template.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 font-medium">
                  {template.type.replace('_', ' ')} <ChevronRight className="h-3 w-3" />
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-2 space-y-6">
              {/* Card Thumbnail */}
              <div className="aspect-[4/5] bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed relative overflow-hidden shadow-inner group-hover:bg-white transition-colors">
                <div className={cn(
                  "origin-center transform transition-transform duration-500 group-hover:scale-[0.6]",
                  template.type === 'ID_CARD' ? 'scale-[0.5]' : 'scale-[0.6]'
                )}>
                  {template.type === 'STUDENT_CARD' && previewStudent && settings ? (
                    <StudentCardVisual student={previewStudent} settings={settings} template={template} />
                  ) : template.type === 'EXAM_CARD' && previewStudent && settings ? (
                    <ExamCardVisual student={previewStudent} settings={settings} template={template} />
                  ) : template.type === 'ID_CARD' && previewStudent && settings ? (
                    <IdCardVisual student={previewStudent} settings={settings} side="front" template={template} />
                  ) : null}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
              </div>

              <div className="flex gap-2 mt-auto pt-4">
                <Button 
                  className="flex-1 gap-2 font-bold" 
                  variant={template.is_active ? 'secondary' : 'default'}
                  onClick={() => handleToggleActive(template.id)}
                >
                  {template.is_active ? 'Sedang Digunakan' : 'Gunakan'}
                </Button>
                <Button variant="outline" size="icon" className="shadow-sm" onClick={() => openConfig(template)}>
                  <Palette className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Editor Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Kustomisasi Lanjut Desain</DialogTitle>
            <DialogDescription>
              Sesuaikan elemen visual untuk template <strong>{editingTemplate?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
            {/* Controls Side */}
            <div className="space-y-6">
              <Tabs defaultValue="front" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="front">Tampak Depan</TabsTrigger>
                  <TabsTrigger value="back">Tampak Belakang</TabsTrigger>
                </TabsList>
                
                {['front', 'back'].map((side) => (
                  <TabsContent key={side} value={side} className="space-y-6 py-4 border rounded-xl p-4 mt-4 bg-slate-50/50">
                    <div className="space-y-4">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Warna Komposisi</Label>
                      <div className="grid grid-cols-1 gap-4">
                        <ColorInput 
                          label="Header (Atas)" 
                          value={localConfig[side].headerBg} 
                          onChange={(val) => setLocalConfig({...localConfig, [side]: {...localConfig[side], headerBg: val}})} 
                        />
                        <ColorInput 
                          label="Body (Tengah)" 
                          value={localConfig[side].bodyBg} 
                          onChange={(val) => setLocalConfig({...localConfig, [side]: {...localConfig[side], bodyBg: val}})} 
                        />
                        <ColorInput 
                          label="Footer (Bawah)" 
                          value={localConfig[side].footerBg} 
                          onChange={(val) => setLocalConfig({...localConfig, [side]: {...localConfig[side], footerBg: val}})} 
                        />
                        <ColorInput 
                          label="Warna Teks" 
                          value={localConfig[side].textColor} 
                          onChange={(val) => setLocalConfig({...localConfig, [side]: {...localConfig[side], textColor: val}})} 
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Latar Belakang (Gambar)</Label>
                      <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-3 bg-white">
                        {localConfig[side].bgImage ? (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden border shadow-sm">
                            <img src={localConfig[side].bgImage} className="w-full h-full object-cover" alt="BG" />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6 rounded-full"
                              onClick={() => setLocalConfig({...localConfig, [side]: {...localConfig[side], bgImage: ''}})}
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-4 opacity-50">
                            <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-[10px] font-bold">PNG/JPG (Transparan Disarankan)</p>
                          </div>
                        )}
                        <Label className="w-full">
                          <div className="w-full h-10 bg-primary text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/90 transition-all shadow-md active:scale-95">
                            <Upload className="h-3 w-3" /> Unggah Background
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(side as 'front' | 'back', e)}
                          />
                        </Label>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Preview Side */}
            <div className="flex flex-col items-center justify-center bg-slate-100 rounded-2xl border-2 border-slate-200 p-8 min-h-[400px]">
              <div className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em]">Live Interactive Preview</div>
              <div className={cn(
                "transform transition-transform scale-[0.8] lg:scale-[1]",
                editingTemplate?.type === 'ID_CARD' ? 'scale-[0.7]' : 'scale-[0.9]'
              )}>
                 {editingTemplate?.type === 'STUDENT_CARD' && previewStudent && settings ? (
                   <StudentCardVisual student={previewStudent} settings={settings} template={{...editingTemplate, config_json: JSON.stringify(localConfig)}} />
                 ) : editingTemplate?.type === 'EXAM_CARD' && previewStudent && settings ? (
                   <ExamCardVisual student={previewStudent} settings={settings} template={{...editingTemplate, config_json: JSON.stringify(localConfig)}} />
                 ) : editingTemplate?.type === 'ID_CARD' && previewStudent && settings ? (
                   <IdCardVisual student={previewStudent} settings={settings} side="front" template={{...editingTemplate, config_json: JSON.stringify(localConfig)}} />
                 ) : null}
              </div>
              <div className="mt-8 text-xs text-muted-foreground italic text-center px-6">
                *Tampilan pratinjau menunjukkan bagaimana data identitas sekolah dan siswa berpadu dengan desain.
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-6">
            <Button variant="ghost" onClick={() => setIsConfigOpen(false)}>Batal</Button>
            <Button className="gap-2 px-8 font-bold shadow-lg shadow-primary/20 h-11" onClick={handleSaveConfig}>
              <Save className="h-4 w-4" /> Simpan Konfigurasi Desain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-lg border shadow-sm">
      <div className="flex flex-col">
        <Label className="text-[11px] font-bold text-slate-700">{label}</Label>
        <span className="text-[9px] font-mono text-slate-400 uppercase">{value}</span>
      </div>
      <input 
        type="color" 
        className="w-10 h-10 p-0 border-none rounded-lg cursor-pointer bg-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
