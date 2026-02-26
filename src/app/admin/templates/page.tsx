"use client";

import { useState, useEffect } from 'react';
import { getDB, saveDB } from '@/app/lib/db';
import { CardTemplate, SchoolSettings, Student, TemplateType } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Layout, 
  Palette, 
  CheckCircle2, 
  Save, 
  RotateCcw, 
  Upload, 
  Image as ImageIcon, 
  ChevronRight, 
  Type, 
  Plus, 
  Trash2
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
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const FONT_OPTIONS = [
  { name: 'Inter (Default)', value: 'Inter, sans-serif' },
  { name: 'Oswald (Bold Display)', value: 'Oswald, sans-serif' },
  { name: 'Montserrat (Modern)', value: 'Montserrat, sans-serif' },
  { name: 'Playfair Display (Elegant)', value: 'Playfair Display, serif' },
  { name: 'Roboto Mono (Technical)', value: 'Roboto Mono, monospace' },
];

const DEFAULT_CONFIG = {
  front: { headerBg: '#2E50B8', bodyBg: '#ffffff', footerBg: '#4FBFDD', textColor: '#334155', bgImage: '', fontFamily: 'Inter, sans-serif' },
  back: { headerBg: '#2E50B8', bodyBg: '#ffffff', footerBg: '#4FBFDD', textColor: '#334155', bgImage: '', fontFamily: 'Inter, sans-serif' }
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CardTemplate | null>(null);
  const [localConfig, setLocalConfig] = useState<any>(DEFAULT_CONFIG);

  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateType, setNewTemplateType] = useState<TemplateType>('STUDENT_CARD');
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const refreshData = () => {
    const db = getDB();
    setTemplates(db.templates);
    setSettings(db.school_settings);
    
    if (db.students && db.students.length > 0) {
      setPreviewStudent(db.students[0]);
    } else {
      setPreviewStudent({
        id: 'mock-1',
        name: 'CONTOH NAMA SISWA LENGKAP',
        nis: '20210001',
        nisn: '0059876543',
        class: 'XII',
        major: 'TEKNIK KOMPUTER & JARINGAN',
        school_year: '2024/2025',
        photo_url: 'https://picsum.photos/seed/student-demo/300/400',
        status: 'Aktif',
        valid_until: '2025-06-30',
        card_code: 'ED-SYNC-DEMO-01'
      });
    }
  };

  useEffect(() => {
    refreshData();
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

  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({ title: "Gagal", description: "Nama template wajib diisi.", variant: "destructive" });
      return;
    }
    const db = getDB();
    const newTemplate: CardTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTemplateName,
      type: newTemplateType,
      config_json: JSON.stringify(DEFAULT_CONFIG),
      is_active: false,
      preview_color: 'bg-slate-500'
    };
    db.templates.push(newTemplate);
    saveDB(db);
    setTemplates([...db.templates]);
    setIsAddOpen(false);
    setNewTemplateName('');
    toast({ title: "Berhasil", description: "Template baru ditambahkan." });
  };

  const handleToggleActive = (id: string) => {
    const db = getDB();
    const template = db.templates.find(t => t.id === id);
    if (!template) return;
    db.templates = db.templates.map(t => {
      if (t.type === template.type) return { ...t, is_active: t.id === id };
      return t;
    });
    saveDB(db);
    setTemplates(db.templates);
    toast({ title: "Aktif", description: `Template ${template.name} diaktifkan.` });
  };

  const handleDeleteConfirm = () => {
    if (!templateToDelete) return;
    const db = getDB();
    db.templates = db.templates.filter(t => t.id !== templateToDelete);
    saveDB(db);
    setTemplates(db.templates);
    setTemplateToDelete(null);
    toast({ title: "Dihapus", description: "Template telah dihapus." });
  };

  const openConfig = (template: CardTemplate) => {
    setEditingTemplate(template);
    setIsConfigOpen(true);
  };

  const handleSaveConfig = () => {
    if (!editingTemplate) return;
    const db = getDB();
    db.templates = db.templates.map(t => 
      t.id === editingTemplate.id ? { ...t, config_json: JSON.stringify(localConfig) } : t
    );
    saveDB(db);
    setTemplates(db.templates);
    setIsConfigOpen(false);
    toast({ title: "Tersimpan", description: "Konfigurasi desain diperbarui." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Template Desain</h1>
          <p className="text-muted-foreground">Sesuaikan tampilan kartu dengan data riil dari Settings & Siswa.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Refresh Data
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" /> Template Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Tambah Varian Desain</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nama Template</Label>
                  <Input placeholder="Misal: Blue Modern" value={newTemplateName} onChange={e => setNewTemplateName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tipe Kartu</Label>
                  <Select value={newTemplateType} onValueChange={(v: any) => setNewTemplateType(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT_CARD">Kartu Pelajar</SelectItem>
                      <SelectItem value="EXAM_CARD">Kartu Ujian</SelectItem>
                      <SelectItem value="ID_CARD">ID Card Umum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter><Button onClick={handleAddTemplate}>Simpan</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className={cn(
            "overflow-hidden border-2 transition-all group relative flex flex-col",
            template.is_active ? "border-primary shadow-lg" : "border-transparent"
          )}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div className={cn("p-2 rounded-lg text-white", template.preview_color || 'bg-slate-400')}>
                  <Layout className="h-5 w-5" />
                </div>
                <div className="flex gap-2">
                   {template.is_active ? (
                     <Badge className="bg-primary">AKTIF</Badge>
                   ) : (
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-30 group-hover:opacity-100" onClick={() => setTemplateToDelete(template.id)}>
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   )}
                </div>
              </div>
              <CardTitle className="mt-4">{template.name}</CardTitle>
              <CardDescription className="uppercase text-[10px] font-bold tracking-widest">{template.type.replace('_', ' ')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-6">
              <div className="aspect-[4/5] bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed overflow-hidden group">
                <div className="scale-[0.55] transition-transform group-hover:scale-[0.6]">
                   {template.type === 'STUDENT_CARD' && previewStudent && settings && (
                     <StudentCardVisual student={previewStudent} settings={settings} template={template} />
                   )}
                   {template.type === 'EXAM_CARD' && previewStudent && settings && (
                     <ExamCardVisual student={previewStudent} settings={settings} template={template} />
                   )}
                   {template.type === 'ID_CARD' && previewStudent && settings && (
                     <IdCardVisual student={previewStudent} settings={settings} side="front" template={template} />
                   )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" variant={template.is_active ? 'secondary' : 'default'} onClick={() => handleToggleActive(template.id)} disabled={template.is_active}>
                  {template.is_active ? 'Digunakan' : 'Gunakan'}
                </Button>
                <Button variant="outline" size="icon" onClick={() => openConfig(template)}>
                  <Palette className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!templateToDelete} onOpenChange={o => !o && setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Template?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini permanen. Pastikan Anda tidak memerlukan desain ini lagi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-white">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
               <DialogTitle>Kustomisasi Desain: {editingTemplate?.name}</DialogTitle>
               <Button variant="ghost" size="sm" onClick={() => setLocalConfig(DEFAULT_CONFIG)} className="gap-2 text-muted-foreground">
                 <RotateCcw className="h-4 w-4" /> Reset ke Default
               </Button>
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
            <div className="space-y-6">
              <Tabs defaultValue="front">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="front">Sisi Depan</TabsTrigger>
                  <TabsTrigger value="back">Sisi Belakang</TabsTrigger>
                </TabsList>
                {['front', 'back'].map(side => (
                  <TabsContent key={side} value={side} className="space-y-4 p-4 bg-muted/20 rounded-xl mt-4 border">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">Jenis Font</Label>
                      <Select value={localConfig[side].fontFamily} onValueChange={v => setLocalConfig({...localConfig, [side]: {...localConfig[side], fontFamily: v}})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {FONT_OPTIONS.map(f => <SelectItem key={f.value} value={f.value} style={{fontFamily: f.value}}>{f.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <ColorField label="Header" value={localConfig[side].headerBg} onChange={v => setLocalConfig({...localConfig, [side]: {...localConfig[side], headerBg: v}})} />
                      <ColorField label="Body" value={localConfig[side].bodyBg} onChange={v => setLocalConfig({...localConfig, [side]: {...localConfig[side], bodyBg: v}})} />
                      <ColorField label="Footer" value={localConfig[side].footerBg} onChange={v => setLocalConfig({...localConfig, [side]: {...localConfig[side], footerBg: v}})} />
                      <ColorField label="Teks" value={localConfig[side].textColor} onChange={v => setLocalConfig({...localConfig, [side]: {...localConfig[side], textColor: v}})} />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <div className="bg-slate-100 rounded-2xl flex flex-col items-center justify-center p-8 border-2 border-dashed gap-8">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Preview (Data Riil)</div>
              <div className="flex flex-col gap-6 scale-[0.85] origin-center">
                 {editingTemplate?.type === 'STUDENT_CARD' && previewStudent && settings && (
                   <>
                     <StudentCardVisual student={previewStudent} settings={settings} side="front" template={{...editingTemplate, config_json: JSON.stringify(localConfig)}} />
                     <StudentCardVisual student={previewStudent} settings={settings} side="back" template={{...editingTemplate, config_json: JSON.stringify(localConfig)}} />
                   </>
                 )}
                 {editingTemplate?.type === 'EXAM_CARD' && previewStudent && settings && (
                   <>
                     <ExamCardVisual student={previewStudent} settings={settings} side="front" template={{...editingTemplate, config_json: JSON.stringify(localConfig)}} />
                     <ExamCardVisual student={previewStudent} settings={settings} side="back" template={{...editingTemplate, config_json: JSON.stringify(localConfig)}} />
                   </>
                 )}
                 {editingTemplate?.type === 'ID_CARD' && previewStudent && settings && (
                   <>
                     <IdCardVisual student={previewStudent} settings={settings} side="front" template={{...editingTemplate, config_json: JSON.stringify(localConfig)}} />
                     <IdCardVisual student={previewStudent} settings={settings} side="back" template={{...editingTemplate, config_json: JSON.stringify(localConfig)}} />
                   </>
                 )}
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSaveConfig} className="px-8"><Save className="h-4 w-4 mr-2" /> Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="bg-white p-2 rounded-lg border flex items-center justify-between gap-3">
      <span className="text-[10px] font-bold uppercase">{label}</span>
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
    </div>
  );
}